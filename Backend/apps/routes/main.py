from flask import Blueprint, jsonify

# Crée un Blueprint appelé "main_bp"
main_bp = Blueprint('main', __name__)

@main_bp.route('/', methods=['GET'])
def home():
    return jsonify({"message": "Bienvenue sur l'API Flask ! 🚀"})
