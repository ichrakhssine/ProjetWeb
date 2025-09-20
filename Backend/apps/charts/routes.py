from flask import Blueprint, jsonify

charts_blueprint = Blueprint('charts', __name__)

# Si vous avez besoin d'importer des modèles, utilisez :
try:
    from apps.authentication.models import Users  # ou le modèle approprié
except ImportError:
    # Gérer l'importation manquante
    pass

@charts_blueprint.route('/')
def charts_index():
    return jsonify({"message": "Charts Endpoints"})

@charts_blueprint.route('/stats')
def stats():
    return jsonify({"message": "Statistics data"})