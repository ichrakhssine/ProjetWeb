import os
import logging
from pathlib import Path
from enum import Enum
from datetime import timedelta


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class UserRole(Enum):
    CANDIDAT = "candidat"
    RECRUTEUR = "recruteur"
    ADMIN = "admin"

class Config:
    """Base configuration for the RH application."""
    BASE_DIR = Path(__file__).resolve().parent

    # Secret key for security
    SECRET_KEY = os.getenv('SECRET_KEY', '8a954a476acea1c1b02a05dc99fda1b59a9894f59cde8eaafe17f0b0ef7e1153')
    PERMANENT_SESSION_LIFETIME = timedelta(hours=24)
    logger.info(f"SECRET_KEY loaded: {'Yes' if SECRET_KEY else 'No'}")

    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', SECRET_KEY)  
    logger.info(f"JWT_SECRET_KEY loaded: {'Yes' if JWT_SECRET_KEY else 'No'}")

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    DB_ENGINE = os.getenv('DB_ENGINE')
    DB_USERNAME = os.getenv('DB_USERNAME')
    DB_PASS = os.getenv('DB_PASS')
    DB_HOST = os.getenv('DB_HOST')
    DB_PORT = os.getenv('DB_PORT')
    DB_NAME = os.getenv('DB_NAME')

    USE_SQLITE = True

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
            logger.info("External database configuration used")
        except Exception as e:
            logger.error(f"DBMS configuration error: {str(e)}")
            logger.info("Falling back to SQLite default.")

    if USE_SQLITE:
        SQLALCHEMY_DATABASE_URI = f'sqlite:///{os.path.join(BASE_DIR, "db.sqlite3")}'
        logger.info("SQLite configuration used")

    USERS_ROLES = {role.name: role.value for role in UserRole}

    GITHUB_ID = os.getenv('GITHUB_ID')
    GITHUB_SECRET = os.getenv('GITHUB_SECRET')
    GOOGLE_ID = os.getenv('GOOGLE_ID')
    GOOGLE_SECRET = os.getenv('GOOGLE_SECRET')

    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SECURE = False 
    PERMANENT_SESSION_LIFETIME = 3600

class ProductionConfig(Config):
    """Configuration for production environment."""
    DEBUG = False
    SESSION_COOKIE_SECURE = True  

class DebugConfig(Config):
    """Configuration for development environment."""
    DEBUG = True


config_dict = {
    'Production': ProductionConfig,
    'Debug': DebugConfig
}