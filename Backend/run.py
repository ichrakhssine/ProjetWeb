import os
from flask_migrate import Migrate
from apps import create_app, db
from apps.config import config_dict
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

# Déterminer le mode de configuration (Debug ou Production)
DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'
CONFIG_MODE = 'Debug' if DEBUG else 'Production'

try:
    # Charger la configuration
    app_config = config_dict[CONFIG_MODE]
except KeyError:
    raise ValueError(f"Erreur : Mode de configuration invalide. "
                     f"Valeurs attendues : [Debug, Production]. Reçu : {CONFIG_MODE}")

# Initialiser l'application Flask
app = create_app(app_config)

# Configurer Flask-Migrate pour les migrations
Migrate(app, db)

# Créer les tables de la base de données
with app.app_context():
    try:
        db.create_all()
        app.logger.info("Tables de la base de données créées avec succès.")
    except Exception as e:
        app.logger.error(f"Erreur lors de la création des tables : {str(e)}")
        raise

# Logs au démarrage
app.logger.info(f"Mode DEBUG : {DEBUG}")
app.logger.info(f"Base de données : {app_config.SQLALCHEMY_DATABASE_URI}")
app.logger.info(f"Configuration chargée : {CONFIG_MODE}")

if __name__ == "__main__":
    HOST = os.getenv('APP_HOST', '0.0.0.0')
    PORT = int(os.getenv('APP_PORT', 8000))
    app.run(host=HOST, port=PORT, debug=DEBUG)