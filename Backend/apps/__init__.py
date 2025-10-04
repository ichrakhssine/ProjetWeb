from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from datetime import timedelta
from flask import redirect

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Configuration de la session
    app.config['SESSION_TYPE'] = 'filesystem'
    app.config['SECRET_KEY'] = 'votre-secret-session-key'
    app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(hours=24)
    
    # Initialisation des extensions
    db.init_app(app)
    jwt.init_app(app)
    CORS(app)
    
    # Import des modèles
    from apps import models
    
    # Import des routes
    from apps.routes.auth import auth_bp
    from apps.routes.admin import admin_bp
    from apps.routes.main import main_bp
    from apps.routes.face_auth import face_auth_bp  # Ajouter cette ligne
    
    # Enregistrement des blueprints
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(admin_bp, url_prefix='/admin')
    app.register_blueprint(main_bp, url_prefix='/api')
    app.register_blueprint(face_auth_bp, url_prefix='/auth')  # Ajouter cette ligne
    
    # Route racine - Redirection vers la page de login
    @app.route('/')
    def index():
        return redirect('/auth/login')
    
    return app