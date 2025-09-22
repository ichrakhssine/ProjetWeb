from flask import Blueprint, request, jsonify, render_template, redirect, url_for
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from apps import db
from apps.authentication.models import User, UserRole
from apps.models import Candidat, Recruteur
from datetime import datetime

auth_bp = Blueprint('auth', __name__)

# Route pour afficher la page de login
@auth_bp.route('/login', methods=['GET'])
def login_page():
    return render_template('login.html')

# Route pour afficher la page d'inscription
@auth_bp.route('/register', methods=['GET'])
def register_page():
    return render_template('register.html')

# Route pour traiter le formulaire de login
@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        # Gérer à la fois JSON et form data
        if request.is_json:
            data = request.get_json()
        else:
            data = request.form
        
        if not data or 'email' not in data or 'password' not in data:
            if request.is_json:
                return jsonify({'error': 'Email et mot de passe requis'}), 400
            else:
                return render_template('login.html', error='Email et mot de passe requis')
        
        user = User.query.filter_by(email=data['email']).first()
        
        if not user or not user.check_password(data['password']):
            if request.is_json:
                return jsonify({'error': 'Email ou mot de passe incorrect'}), 401
            else:
                return render_template('login.html', error='Email ou mot de passe incorrect')
        
        access_token = create_access_token(identity=user.id)
        
        if request.is_json:
            return jsonify({
                'message': 'Connexion réussie',
                'access_token': access_token,
                'user': user.to_dict()
            }), 200
        else:
            # Rediriger vers le dashboard après connexion réussie
            response = redirect(url_for('admin.dashboard'))
            response.set_cookie('access_token', access_token, httponly=True)
            return response
        
    except Exception as e:
        if request.is_json:
            return jsonify({'error': str(e)}), 500
        else:
            return render_template('login.html', error=str(e))

# Route pour traiter le formulaire d'inscription
@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        # Gérer à la fois JSON et form data
        if request.is_json:
            data = request.get_json()
        else:
            data = request.form
        
        # Validation des données
        required_fields = ['username', 'email', 'password', 'nom', 'prenom', 'role']
        for field in required_fields:
            if field not in data:
                if request.is_json:
                    return jsonify({'error': f'Le champ {field} est requis'}), 400
                else:
                    return render_template('register.html', error=f'Le champ {field} est requis')
        
        # Vérifier si l'utilisateur existe déjà
        if User.query.filter_by(username=data['username']).first():
            if request.is_json:
                return jsonify({'error': 'Ce nom d\'utilisateur est déjà pris'}), 400
            else:
                return render_template('register.html', error='Ce nom d\'utilisateur est déjà pris')
        
        if User.query.filter_by(email=data['email']).first():
            if request.is_json:
                return jsonify({'error': 'Cet email est déjà utilisé'}), 400
            else:
                return render_template('register.html', error='Cet email est déjà utilisé')
        
        # Créer l'utilisateur
        user = User(
            username=data['username'],
            email=data['email'],
            nom=data['nom'],
            prenom=data['prenom'],
            role=UserRole(data['role'])
        )
        user.set_password(data['password'])
        user.save()
        
        # Créer le profil selon le rôle
        if user.role == UserRole.CANDIDAT:
            candidat = Candidat(
                user_id=user.id,
                competences=data.get('competences', ''),
                nationalite=data.get('nationalite', ''),
                niveau_etude=data.get('niveau_etude', ''),
                telephone=data.get('telephone', ''),
                adresse=data.get('adresse', '')
            )
            candidat.save()
        elif user.role == UserRole.RECRUTEUR:
            recruteur = Recruteur(
                user_id=user.id,
                entreprise=data.get('entreprise', ''),
                localisation=data.get('localisation', ''),
                poste=data.get('poste', '')
            )
            recruteur.save()
        
        # Créer le token JWT
        access_token = create_access_token(identity=user.id)
        
        if request.is_json:
            return jsonify({
                'message': 'Utilisateur créé avec succès',
                'access_token': access_token,
                'user': user.to_dict()
            }), 201
        else:
            # Rediriger vers le login après inscription réussie
            return redirect(url_for('auth.login_page', message='Inscription réussie! Vous pouvez maintenant vous connecter.'))
        
    except Exception as e:
        if request.is_json:
            return jsonify({'error': str(e)}), 500
        else:
            return render_template('register.html', error=str(e))

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'Utilisateur non trouvé'}), 404
        
        profile_data = user.to_dict()
        
        # Ajouter les informations spécifiques au rôle
        if user.role == UserRole.CANDIDAT and user.candidat:
            profile_data['candidat'] = user.candidat.to_dict()
        elif user.role == UserRole.RECRUTEUR and user.recruteur:
            profile_data['recruteur'] = user.recruteur.to_dict()
        
        return jsonify(profile_data), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Route de déconnexion
@auth_bp.route('/logout', methods=['GET', 'POST'])
def logout():
    response = redirect(url_for('auth.login_page'))
    response.delete_cookie('access_token')
    return response