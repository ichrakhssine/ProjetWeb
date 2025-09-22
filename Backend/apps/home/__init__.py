from flask import Blueprint

# Utiliser un seul nom de blueprint cohérent
blueprint = Blueprint('home', __name__)

from apps.home import routes