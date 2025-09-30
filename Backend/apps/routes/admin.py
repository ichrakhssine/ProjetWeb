from flask import Blueprint, request, jsonify, render_template, session, redirect, url_for, flash
from apps.models import User, UserRole, Candidat, Recruteur, OffreEmploi, Candidature
from apps import db
from apps.routes.auth import admin_required_web
from datetime import datetime, timedelta

admin_bp = Blueprint('admin', __name__)

def format_relative_time(date_obj):
    """Formate une date en temps relatif (il y a X temps)"""
    now = datetime.utcnow()
    diff = now - date_obj
    
    if diff < timedelta(minutes=1):
        return "À l'instant"
    elif diff < timedelta(hours=1):
        minutes = int(diff.total_seconds() / 60)
        return f"Il y a {minutes} min"
    elif diff < timedelta(days=1):
        hours = int(diff.total_seconds() / 3600)
        return f"Il y a {hours} h"
    elif diff < timedelta(days=30):
        days = diff.days
        return f"Il y a {days} jour(s)"
    else:
        return date_obj.strftime('%d/%m/%Y')

@admin_bp.route('/dashboard')
@admin_required_web
def admin_dashboard():
    print("🎯 DASHBOARD: Accès à la route")
    
    if not session.get('logged_in'):
        print("🎯 DASHBOARD: Non connecté")
        return redirect('/auth/login')
    
    user_id = session.get('user_id')
    current_user = User.query.get(user_id)
    
    if not current_user:
        print("🎯 DASHBOARD: Utilisateur non trouvé")
        return redirect('/auth/login')
    
    print(f"🎯 DASHBOARD: Utilisateur {current_user.email} autorisé")
    
    try:
        # Stats complètes avec gestion d'erreur
        stats = {
            'total_users': User.query.count(),
            'total_candidats': User.query.filter_by(role=UserRole.CANDIDAT).count(),
            'total_recruteurs': User.query.filter_by(role=UserRole.RECRUTEUR).count(),
            'users_by_role': {
                'admin': User.query.filter_by(role=UserRole.ADMIN).count(),
                'candidat': User.query.filter_by(role=UserRole.CANDIDAT).count(),
                'recruteur': User.query.filter_by(role=UserRole.RECRUTEUR).count()
            }
        }
        
        # RÉCUPÉRATION DES ACTIVITÉS RÉCENTES
        recent_activities = []
        
        # Ajoute les stats pour les offres et candidatures avec vérification
        try:
            stats['total_offres'] = OffreEmploi.query.count()
            stats['offres_actives'] = OffreEmploi.query.filter_by(statut="ouverte").count()
            stats['total_candidatures'] = Candidature.query.count()
            stats['candidatures_en_attente'] = Candidature.query.filter_by(statut="en_attente").count()
            
            # 1. Dernières candidatures (les 5 plus récentes)
            recent_candidatures = Candidature.query.order_by(
                Candidature.date_postulation.desc()
            ).limit(5).all()
            
            for candidature in recent_candidatures:
                # Gestion sécurisée des relations
                candidat_nom = "Candidat inconnu"
                if candidature.candidat and candidature.candidat.user:
                    candidat_nom = f"{candidature.candidat.user.prenom} {candidature.candidat.user.nom}"
                
                offre_titre = "Offre inconnue"
                entreprise = "Entreprise inconnue"
                if candidature.offre:
                    offre_titre = candidature.offre.titre
                    if candidature.offre.recruteur:
                        entreprise = candidature.offre.recruteur.entreprise
                
                recent_activities.append({
                    'type': 'candidature',
                    'icon': 'fa-file-alt',
                    'color': 'warning',
                    'titre': f'Nouvelle candidature',
                    'description': f'{candidat_nom} - {offre_titre}',
                    'date': candidature.date_postulation,
                    'relative_time': format_relative_time(candidature.date_postulation),
                    'statut': candidature.statut.value,
                    'details': {
                        'candidat': candidat_nom,
                        'offre': offre_titre,
                        'entreprise': entreprise
                    }
                })
            
            # 2. Derniers utilisateurs inscrits (les 3 plus récents)
            recent_users = User.query.order_by(
                User.date_creation.desc()
            ).limit(3).all()
            
            for new_user in recent_users:
                recent_activities.append({
                    'type': 'user',
                    'icon': 'fa-user-plus',
                    'color': 'success',
                    'titre': f'Nouvel utilisateur inscrit',
                    'description': f'{new_user.prenom} {new_user.nom} ({new_user.email})',
                    'date': new_user.date_creation,
                    'relative_time': format_relative_time(new_user.date_creation),
                    'role': new_user.role.value
                })
            
            # 3. Dernières offres créées (les 3 plus récentes)
            recent_offres = OffreEmploi.query.order_by(
                OffreEmploi.date_publication.desc()
            ).limit(3).all()
            
            for offre in recent_offres:
                entreprise = "Entreprise inconnue"
                if offre.recruteur:
                    entreprise = offre.recruteur.entreprise
                
                recent_activities.append({
                    'type': 'offre',
                    'icon': 'fa-briefcase',
                    'color': 'info',
                    'titre': f'Nouvelle offre publiée',
                    'description': f'{offre.titre}',
                    'date': offre.date_publication,
                    'relative_time': format_relative_time(offre.date_publication),
                    'entreprise': entreprise
                })
            
            # Trier toutes les activités par date (du plus récent au plus ancien)
            recent_activities.sort(key=lambda x: x['date'], reverse=True)
            # Prendre les 5 plus récentes
            recent_activities = recent_activities[:5]
            
        except Exception as e:
            print(f"⚠️ Erreur récupération activités: {e}")
            stats['total_offres'] = 0
            stats['offres_actives'] = 0
            stats['total_candidatures'] = 0
            stats['candidatures_en_attente'] = 0
            recent_activities = []
        
        print(f"🎯 STATS calculées: {stats}")
        print(f"🎯 Activités récentes: {len(recent_activities)}")
        
        return render_template('admin/dashboard.html', 
                             stats=stats, 
                             current_user=current_user,
                             recent_activities=recent_activities)
                             
    except Exception as e:
        print(f"❌ ERREUR dans dashboard: {e}")
        import traceback
        print(f"❌ TRACEBACK: {traceback.format_exc()}")
        
        # Fallback avec stats de base
        stats_fallback = {
            'total_users': User.query.count(),
            'total_candidats': User.query.filter_by(role=UserRole.CANDIDAT).count(),
            'total_recruteurs': User.query.filter_by(role=UserRole.RECRUTEUR).count(),
            'total_offres': 0,
            'offres_actives': 0,
            'total_candidatures': 0,
            'candidatures_en_attente': 0,
            'users_by_role': {
                'admin': User.query.filter_by(role=UserRole.ADMIN).count(),
                'candidat': User.query.filter_by(role=UserRole.CANDIDAT).count(),
                'recruteur': User.query.filter_by(role=UserRole.RECRUTEUR).count()
            }
        }
        return render_template('admin/dashboard.html', 
                             stats=stats_fallback, 
                             current_user=current_user,
                             recent_activities=[])

# Page Gestion Utilisateurs
@admin_bp.route('/users')
@admin_required_web
def admin_users():
    try:
        user_id = session.get('user_id')
        current_user = User.query.get(user_id)
        
        if not current_user:
            flash('Utilisateur non trouvé', 'error')
            return redirect(url_for('auth.login_form'))
        
        users = User.query.order_by(User.date_creation.desc()).all()
        print(f"✅ Chargement de {len(users)} utilisateurs")
        
        return render_template('admin/users.html', 
                             users=users, 
                             current_user=current_user)
                             
    except Exception as e:
        print(f"❌ Erreur users: {str(e)}")
        flash('Erreur lors du chargement des utilisateurs', 'error')
        session.clear()
        return redirect(url_for('auth.login_form'))

# Page Statistiques
@admin_bp.route('/statistics')
@admin_required_web
def admin_statistics():
    try:
        user_id = session.get('user_id')
        current_user = User.query.get(user_id)
        
        if not current_user:
            flash('Utilisateur non trouvé', 'error')
            return redirect(url_for('auth.login_form'))
        
        stats = {
            'total_users': User.query.count(),
            'total_candidats': User.query.filter_by(role=UserRole.CANDIDAT).count(),
            'total_recruteurs': User.query.filter_by(role=UserRole.RECRUTEUR).count(),
            'total_offres': OffreEmploi.query.count(),
            'total_candidatures': Candidature.query.count(),
        }
        
        return render_template('admin/statistics.html', 
                             current_user=current_user,
                             stats=stats)
                             
    except Exception as e:
        print(f"❌ Erreur statistics: {str(e)}")
        flash('Erreur lors du chargement des statistiques', 'error')
        session.clear()
        return redirect(url_for('auth.login_form'))

# API pour les statistiques
@admin_bp.route('/api/stats')
@admin_required_web
def get_stats():
    try:
        stats = {
            'total_users': User.query.count(),
            'total_candidats': User.query.filter_by(role=UserRole.CANDIDAT).count(),
            'total_recruteurs': User.query.filter_by(role=UserRole.RECRUTEUR).count(),
            'total_offres': OffreEmploi.query.count(),
            'total_candidatures': Candidature.query.count(),
            'users_by_role': {
                'admin': User.query.filter_by(role=UserRole.ADMIN).count(),
                'candidat': User.query.filter_by(role=UserRole.CANDIDAT).count(),
                'recruteur': User.query.filter_by(role=UserRole.RECRUTEUR).count()
            }
        }
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Ajouter un utilisateur
@admin_bp.route('/users/add', methods=['POST'])
@admin_required_web
def add_user():
    try:
        prenom = request.form.get('prenom')
        nom = request.form.get('nom')
        email = request.form.get('email')
        password = request.form.get('password')
        role = request.form.get('role')
        
        if not all([prenom, nom, email, password, role]):
            return jsonify({'success': False, 'error': 'Tous les champs sont requis'})
        
        if User.query.filter_by(email=email).first():
            return jsonify({'success': False, 'error': 'Email déjà utilisé'})
        
        user = User(
            prenom=prenom,
            nom=nom,
            email=email,
            role=UserRole(role)
        )
        user.set_password(password)
        user.save()
        
        # Créer le profil spécifique selon le rôle
        if role == 'candidat':
            candidat = Candidat(user_id=user.id)
            candidat.save()
        elif role == 'recruteur':
            recruteur = Recruteur(user_id=user.id, entreprise="À définir")
            recruteur.save()
        
        return jsonify({'success': True, 'message': 'Utilisateur créé avec succès'})
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

# Récupérer un utilisateur
@admin_bp.route('/api/users/<int:user_id>')
@admin_required_web
def get_user(user_id):
    try:
        user = User.query.get_or_404(user_id)
        user_data = {
            'id': user.id,
            'prenom': user.prenom,
            'nom': user.nom,
            'email': user.email,
            'role': user.role.value
        }
        return jsonify(user_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 404

# Modifier un utilisateur
@admin_bp.route('/users/update', methods=['POST'])
@admin_required_web
def update_user():
    try:
        user_id = request.form.get('user_id')
        prenom = request.form.get('prenom')
        nom = request.form.get('nom')
        email = request.form.get('email')
        password = request.form.get('password')
        role = request.form.get('role')
        
        user = User.query.get_or_404(user_id)
        
        existing_user = User.query.filter_by(email=email).first()
        if existing_user and existing_user.id != user.id:
            return jsonify({'success': False, 'error': 'Email déjà utilisé'})
        
        user.prenom = prenom
        user.nom = nom
        user.email = email
        user.role = UserRole(role)
        
        if password:
            user.set_password(password)
        
        user.save()
        
        return jsonify({'success': True, 'message': 'Utilisateur modifié avec succès'})
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

# Changer le statut
@admin_bp.route('/api/users/<int:user_id>/status', methods=['POST'])
@admin_required_web
def toggle_user_status(user_id):
    try:
        data = request.get_json()
        activate = data.get('activate', True)
        
        user = User.query.get_or_404(user_id)
        user.est_actif = activate
        user.save()
        
        return jsonify({'success': True, 'message': 'Statut modifié avec succès'})
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

# Supprimer un utilisateur
@admin_bp.route('/api/users/<int:user_id>', methods=['DELETE'])
@admin_required_web
def delete_user(user_id):
    try:
        user = User.query.get_or_404(user_id)
        
        if user.candidat:
            db.session.delete(user.candidat)
        if user.recruteur:
            db.session.delete(user.recruteur)
        
        db.session.delete(user)
        db.session.commit()
        
        return jsonify({'success': True, 'message': 'Utilisateur supprimé avec succès'})
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)})