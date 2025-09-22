from enum import Enum
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import SQLAlchemyError
from apps import db
from apps.exceptions.exception import InvalidUsage

# =======
# Enums 
# =======
class UserRole(Enum):
    CANDIDAT = "candidat"
    RECRUTEUR = "recruteur"
    ADMIN = "admin"

class ContractType(Enum):
    CDI = "CDI"
    CDD = "CDD"
    STAGE = "Stage"
    FREELANCE = "Freelance"

class ApplicationStatus(Enum):
    EN_ATTENTE = "en_attente"
    ACCEPTEE = "acceptee"
    REJETEE = "rejetee"

# ===============================
# Classe de base abstraite
# ===============================
class BaseModel(db.Model):
    __abstract__ = True

    def save(self):
        try:
            db.session.add(self)
            db.session.commit()
        except SQLAlchemyError as e:
            db.session.rollback()
            error = str(e.__dict__['orig'])
            raise InvalidUsage(error, 422)

    def delete(self):
        try:
            db.session.delete(self)
            db.session.commit()
        except SQLAlchemyError as e:
            db.session.rollback()
            error = str(e.__dict__['orig'])
            raise InvalidUsage(error, 422)
        


# ===============================
# Classe Candidat
# ===============================
class Candidat(BaseModel):
    __tablename__ = "candidats"
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, unique=True)
    competences = db.Column(db.Text)
    nationalite = db.Column(db.String(100))
    niveau_etude = db.Column(db.String(100))
    telephone = db.Column(db.String(20))
    adresse = db.Column(db.Text)
    
    # Relations
    user = db.relationship("User", back_populates="candidat")
    documents = db.relationship("Document", back_populates="candidat", lazy=True)
    candidatures = db.relationship("Candidature", back_populates="candidat", lazy=True)
    
    def __repr__(self):
        return f"<Candidat {self.user.prenom} {self.user.nom}>"

# ===============================
# Classe Recruteur
# ===============================
class Recruteur(BaseModel):
    __tablename__ = "recruteurs"
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, unique=True)
    entreprise = db.Column(db.String(150), nullable=False)
    localisation = db.Column(db.String(100))
    poste = db.Column(db.String(100))
    
    # Relations
    user = db.relationship("User", back_populates="recruteur")
    offres = db.relationship("OffreEmploi", back_populates="recruteur", lazy=True)
    
    def __repr__(self):
        return f"<Recruteur {self.user.prenom} {self.user.nom} - {self.entreprise}>"

# ===============================
# Classe Document
# ===============================
class Document(BaseModel):
    __tablename__ = "documents"
    
    id = db.Column(db.Integer, primary_key=True)
    titre = db.Column(db.String(200), nullable=False)
    type_document = db.Column(db.String(50), nullable=False)
    chemin_fichier = db.Column(db.String(255), nullable=False)
    format = db.Column(db.String(10), default="pdf")
    date_upload = db.Column(db.DateTime, default=datetime.utcnow)
    
    candidat_id = db.Column(db.Integer, db.ForeignKey("candidats.id"), nullable=False)
    
    # Relation
    candidat = db.relationship("Candidat", back_populates="documents")
    
    def __repr__(self):
        return f"<Document {self.titre} ({self.type_document})>"

# ===============================
# Classe OffreEmploi
# ===============================
class OffreEmploi(BaseModel):
    __tablename__ = "offres_emploi"
    
    id = db.Column(db.Integer, primary_key=True)
    titre = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    localisation = db.Column(db.String(100))
    competences_requises = db.Column(db.Text)
    type_contrat = db.Column(db.Enum(ContractType), nullable=False)
    salaire = db.Column(db.Numeric(10, 2))
    date_publication = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    date_expiration = db.Column(db.DateTime)
    statut = db.Column(db.String(20), default="ouverte")
    
    recruteur_id = db.Column(db.Integer, db.ForeignKey("recruteurs.id"), nullable=False)
    
    # Relations
    recruteur = db.relationship("Recruteur", back_populates="offres")
    candidatures = db.relationship("Candidature", back_populates="offre", lazy=True)
    
    def __repr__(self):
        return f"<OffreEmploi {self.titre} - {self.recruteur.entreprise}>"

# ===============================
# Classe Candidature
# ===============================
class Candidature(BaseModel):
    __tablename__ = "candidatures"
    
    id = db.Column(db.Integer, primary_key=True)
    date_postulation = db.Column(db.DateTime, default=datetime.utcnow)
    statut = db.Column(db.Enum(ApplicationStatus), default=ApplicationStatus.EN_ATTENTE)
    lettre_motivation = db.Column(db.Text)
    cv_id = db.Column(db.Integer, db.ForeignKey("documents.id"))
    
    candidat_id = db.Column(db.Integer, db.ForeignKey("candidats.id"), nullable=False)
    offre_id = db.Column(db.Integer, db.ForeignKey("offres_emploi.id"), nullable=False)
    
    # Relations
    cv = db.relationship("Document", foreign_keys=[cv_id])
    candidat = db.relationship("Candidat", back_populates="candidatures")
    offre = db.relationship("OffreEmploi", back_populates="candidatures")
    
    def __repr__(self):
        return f"<Candidature {self.candidat.user.prenom} pour {self.offre.titre}>"