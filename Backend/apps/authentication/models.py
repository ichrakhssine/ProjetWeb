from datetime import datetime
from flask_login import UserMixin
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from flask_dance.consumer.storage.sqla import OAuthConsumerMixin

from apps import db, login_manager
from apps.config import UserRole

# ===============================
# Classe User
# ===============================
class User(db.Model, UserMixin):
    __tablename__ = "users"
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    nom = db.Column(db.String(100), nullable=False)
    prenom = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.Enum(UserRole),  nullable=False)  # Ajout de default
    date_creation = db.Column(db.DateTime, default=datetime.utcnow)
    date_modification = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relations (si les modèles Candidat et Recruteur existent)
    # candidat = db.relationship("Candidat", back_populates="user", uselist=False, cascade="all, delete-orphan")
    # recruteur = db.relationship("Recruteur", back_populates="user", uselist=False, cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<User {self.username} ({self.role.value})>"

    # Méthodes utilitaires pour vérifier les rôles
    def is_admin(self):
        return self.role == UserRole.ADMIN
    
    def is_recruteur(self):
        return self.role == UserRole.RECRUTEUR
    
    def is_candidat(self):
        return self.role == UserRole.CANDIDAT
    
    def get_role_display(self):
        return self.role.value

    @classmethod
    def find_by_email(cls, email: str) -> "User":
        return cls.query.filter_by(email=email).first()

    @classmethod
    def find_by_username(cls, username: str) -> "User":
        return cls.query.filter_by(username=username).first()
    
    @classmethod
    def find_by_id(cls, _id: int) -> "User":
        return cls.query.filter_by(id=_id).first()
   
    def save(self) -> None:
        try:
            db.session.add(self)
            db.session.commit()
        except SQLAlchemyError as e:
            db.session.rollback()
            error = str(e.__dict__.get('orig', e))
            raise IntegrityError(error, 422)
        finally:
            db.session.close()
    
    def delete_from_db(self) -> None:
        try:
            db.session.delete(self)
            db.session.commit()
        except SQLAlchemyError as e:
            db.session.rollback()
            error = str(e.__dict__.get('orig', e))
            raise IntegrityError(error, 422)
        finally:
            db.session.close()

@login_manager.user_loader
def user_loader(id):
    return User.query.get(int(id))

@login_manager.request_loader
def request_loader(request):
    username = request.form.get('username')
    user = User.query.filter_by(username=username).first()
    return user if user else None

class OAuth(OAuthConsumerMixin, db.Model):
    __tablename__ = "oauth"
    
    provider_user_id = db.Column(db.String(256), unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="cascade"), nullable=False)
    user = db.relationship("User", backref=db.backref("oauth_accounts", lazy=True))
    
    def __repr__(self):
        return f"<OAuth {self.provider_user_id} for User {self.user_id}>"