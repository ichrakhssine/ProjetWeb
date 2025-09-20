from flask import Blueprint, jsonify

# Créer le blueprint principal pour l'API
api_blueprint = Blueprint('api', __name__)

@api_blueprint.route('/')
def api_index():
    """Route racine de l'API."""
    return jsonify({
        "message": "API RH - Bienvenue",
        "version": "1.0.0",
        "endpoints": {
            "auth": "/api/auth/",
            "home": "/api/home/",
            "charts": "/api/charts/",
            "dynamic_data": "/api/dyn_dt/"
        }
    })