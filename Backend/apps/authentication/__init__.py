from flask import Blueprint

# Créer le blueprint pour l'authentification
blueprint = Blueprint('authentication', __name__, template_folder='templates')

# Import des routes doit être fait APRÈS la création du blueprint
from apps.authentication import routes