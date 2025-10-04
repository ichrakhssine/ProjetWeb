from flask import Blueprint, request, jsonify, render_template, redirect, url_for, flash, session
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, decode_token
from apps.models import User, UserRole
from apps import db
from datetime import datetime, timedelta
from flask import redirect, url_for, flash  

auth_bp = Blueprint('auth', __name__)

active_sessions = {}

@auth_bp.route('/login', methods=['GET'])
def login_form():
    if 'user_token' in session:
        try:
            decoded_token = decode_token(session['user_token'])
            user_id = decoded_token['sub']
            user = User.query.get(user_id)
            if user and user.is_admin():
                return redirect(url_for('admin.admin_dashboard'))
        except:
            session.pop('user_token', None)
    
    return render_template('auth/login.html')

@auth_bp.route('/register', methods=['GET'])
def register_form():
    return render_template('auth/register.html')

@auth_bp.route('/login', methods=['POST'])
def login_submit():
    try:
        print(" === DÉBUT LOGIN ===")
        email = request.form.get('email')
        password = request.form.get('password')
        
        print(f" Email reçu: {email}")
        print(f" Password reçu: {password}")

        if not email or not password:
            print(" ERREUR: Champs manquants")
            flash('Email et mot de passe requis', 'error')
            return redirect(url_for('auth.login_form'))
        
        user = User.query.filter_by(email=email).first()
        print(f" Utilisateur trouvé: {user}")
        
        if not user:
            print("ERREUR: Utilisateur non trouvé")
            flash('Email ou mot de passe incorrect', 'error')
            return redirect(url_for('auth.login_form'))
        
        password_ok = user.check_password(password)
        print(f" Mot de passe correct: {password_ok}")
        
        if not password_ok:
            print("ERREUR: Mot de passe incorrect")
            flash('Email ou mot de passe incorrect', 'error')
            return redirect(url_for('auth.login_form'))
        
        if not user.est_actif:
            print(" ERREUR: Compte désactivé")
            flash('Compte désactivé', 'error')
            return redirect(url_for('auth.login_form'))
        
        is_admin = user.is_admin()
        print(f" Est admin: {is_admin}")
        
        if not is_admin:
            print(" ERREUR: Pas un admin")
            flash('Accès réservé aux administrateurs', 'error')
            return redirect(url_for('auth.login_form'))
        
        print("Configuration de la session...")
        session['user_id'] = user.id
        session['user_email'] = user.email
        session['user_role'] = user.role.value
        session['logged_in'] = True
        session.permanent = True

        print(f" Session après configuration:")
        print(f"   user_id: {session.get('user_id')}")
        print(f"   logged_in: {session.get('logged_in')}")
        print(f"   user_email: {session.get('user_email')}")
        
        flash('Connexion réussie !', 'success')
        
        print(" REDIRECTION vers /admin/dashboard")
        response = redirect('/admin/dashboard')
        print(f" Response headers: {response.headers}")
        
        return response
        
    except Exception as e:
        print(f" ERREUR CRITIQUE: {str(e)}")
        import traceback
        print(f"TRACEBACK COMPLET: {traceback.format_exc()}")
        flash(f'Erreur technique: {str(e)}', 'error')
        return redirect(url_for('auth.login_form'))

@auth_bp.route('/register', methods=['POST'])
def register_submit():
    try:
        email = request.form.get('email')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')
        nom = request.form.get('nom')
        prenom = request.form.get('prenom')
        role = request.form.get('role', 'admin')
        
        if not all([email, password, nom, prenom]):
            flash('Tous les champs sont requis', 'error')
            return redirect(url_for('auth.register_form'))
        
        if password != confirm_password:
            flash('Les mots de passe ne correspondent pas', 'error')
            return redirect(url_for('auth.register_form'))
        
        if User.query.filter_by(email=email).first():
            flash('Email déjà utilisé', 'error')
            return redirect(url_for('auth.register_form'))
        
        user = User(
            email=email,
            nom=nom,
            prenom=prenom,
            role=UserRole(role)
        )
        user.set_password(password)
        user.save()
        
        flash('Compte créé avec succès ! Vous pouvez maintenant vous connecter.', 'success')
        return redirect(url_for('auth.login_form'))
        
    except Exception as e:
        flash(f'Erreur lors de la création du compte: {str(e)}', 'error')
        return redirect(url_for('auth.register_form'))

@auth_bp.route('/logout')
def logout():
    session.pop('user_token', None)
    session.pop('user_id', None)
    flash('Déconnexion réussie', 'success')
    return redirect(url_for('auth.login_form'))

def admin_required_web(fn):
    def wrapper(*args, **kwargs):
        print(f" ADMIN_REQUIRED: Vérification pour {fn.__name__}")
        
        if not session.get('logged_in'):
            print(" Non connecté, redirection vers login")
            flash('Veuillez vous connecter', 'error')
            return redirect(url_for('auth.login_form'))
        
        user_id = session.get('user_id')
        if not user_id:
            print(" user_id manquant")
            flash('Session invalide', 'error')
            return redirect(url_for('auth.login_form'))
        
        user = User.query.get(user_id)
        if not user:
            print(" Utilisateur non trouvé")
            session.clear()  
            flash('Utilisateur non trouvé', 'error')
            return redirect(url_for('auth.login_form'))
            
        if not user.is_admin():
            print(" Pas un admin")
            flash('Accès non autorisé', 'error')
            return redirect(url_for('auth.login_form'))
        
        print(" Accès autorisé")
        return fn(*args, **kwargs)
        
    
    wrapper.__name__ = fn.__name__
    return wrapper