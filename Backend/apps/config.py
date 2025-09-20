import os
import logging
from pathlib import Path
from enum import Enum

# Configurer les logs pour le débogage
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Définir les rôles en cohérence avec models.py
class UserRole(Enum):
    CANDIDAT = "candidat"
    RECRUTEUR = "recruteur"
    ADMIN = "admin"

class Config:
    """Configuration de base pour l'application RH."""
    BASE_DIR = Path(__file__).resolve().parent

    # Clé secrète pour la sécurité
    SECRET_KEY = os.getenv('SECRET_KEY', '8a954a476acea1c1b02a05dc99fda1b59a9894f59cde8eaafe17f0b0ef7e1153')
    logger.info(f"SECRET_KEY chargée : {'Oui' if SECRET_KEY else 'Non'}")

    # Désactiver le suivi des modifications SQLAlchemy
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Configuration de la base de données
    DB_ENGINE = os.getenv('DB_ENGINE')
    DB_USERNAME = os.getenv('DB_USERNAME')
    DB_PASS = os.getenv('DB_PASS')
    DB_HOST = os.getenv('DB_HOST')
    DB_PORT = os.getenv('DB_PORT')
    DB_NAME = os.getenv('DB_NAME')

    USE_SQLITE = True

    # Configuration pour un SGBD relationnel
    if DB_ENGINE and DB_NAME and DB_USERNAME:
        try:
            SQLALCHEMY_DATABASE_URI = '{}://{}:{}@{}:{}/{}'.format(
                DB_ENGINE,
                DB_USERNAME,
                DB_PASS,
                DB_HOST,
                DB_PORT,
                DB_NAME
            )
            USE_SQLITE = False
            logger.info("Configuration de base de données externe utilisée")
        except Exception as e:
            logger.error(f"Erreur de configuration DBMS : {str(e)}")
            logger.info("Retour à SQLite par défaut.")

    # Configuration SQLite pour le développement
    if USE_SQLITE:
        SQLALCHEMY_DATABASE_URI = f'sqlite:///{os.path.join(BASE_DIR, "db.sqlite3")}'
        logger.info("Configuration SQLite utilisée")

    # Rôles des utilisateurs
    USERS_ROLES = {role.name: role.value for role in UserRole}

    # Configuration OAuth
    GITHUB_ID = os.getenv('GITHUB_ID')
    GITHUB_SECRET = os.getenv('GITHUB_SECRET')
    GOOGLE_ID = os.getenv('GOOGLE_ID')
    GOOGLE_SECRET = os.getenv('GOOGLE_SECRET')

class ProductionConfig(Config):
    """Configuration pour l'environnement de production."""
    DEBUG = False
    SESSION_COOKIE_HTTPONLY = True
    REMEMBER_COOKIE_HTTPONLY = True
    REMEMBER_COOKIE_DURATION = 3600

class DebugConfig(Config):
    """Configuration pour l'environnement de développement."""
    DEBUG = True

# Dictionnaire des configurations
config_dict = {
    'Production': ProductionConfig,
    'Debug': DebugConfig
}