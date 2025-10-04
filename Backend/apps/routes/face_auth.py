import base64
import os
from flask import Blueprint, render_template, request, jsonify, session, redirect, url_for
from apps.models import User  
face_auth_bp = Blueprint('face_auth', __name__)

FACE_DATA_DIR = 'face_data'

def ensure_face_data_dir():
    if not os.path.exists(FACE_DATA_DIR):
        os.makedirs(FACE_DATA_DIR)

@face_auth_bp.route('/face-login')
def face_login_page():
    return render_template('auth/face_login.html')

@face_auth_bp.route('/face-register')
def face_register_page():
    return render_template('auth/face_register.html')

@face_auth_bp.route('/api/face/login', methods=['POST'])
def face_login():
    """Login basé sur la comparaison des images faciales"""
    try:
        data = request.get_json()
        image_data = data.get('image')
        
        image_bytes = base64.b64decode(image_data.split(',')[1])
        
        ensure_face_data_dir()
        face_files = [f for f in os.listdir(FACE_DATA_DIR) if f.endswith('.jpg')]
        
        best_match = None
        best_score = 0
        
        for face_file in face_files:
            user_id = face_file.split('.')[0]
            saved_image_path = os.path.join(FACE_DATA_DIR, face_file)
            
         
            saved_size = os.path.getsize(saved_image_path)
            captured_size = len(image_bytes)
            
            
            size_diff = abs(saved_size - captured_size)
            score = max(0, 1 - (size_diff / max(saved_size, captured_size)))
            
            if score > best_score and score > 0.3: 
                best_score = score
                best_match = user_id
        
        if best_match:
        
            user = User.query.get(int(best_match))
            if user:
                session['user_id'] = user.id
                session['user_role'] = user.role.value
                session['user_email'] = user.email
                session['user_name'] = f"{user.prenom} {user.nom}"
                
                if user.role.value == 'admin':
                    redirect_url = '/admin/users'
                else:
                    redirect_url = '/'
                
                return jsonify({
                    'success': True, 
                    'message': f'Bienvenue {user.prenom} {user.nom}!',
                    'redirect_url': redirect_url,
                    'similarity': best_score
                })
        
        return jsonify({
            'success': False, 
            'error': 'Visage non reconnu. Avez-vous enregistré votre visage?'
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@face_auth_bp.route('/api/face/register', methods=['POST'])
def register_face():
    """Enregistrement de l'image faciale"""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        image_data = data.get('image')
        
        ensure_face_data_dir()
        image_bytes = base64.b64decode(image_data.split(',')[1])
        
        image_file = os.path.join(FACE_DATA_DIR, f'{user_id}.jpg')
        with open(image_file, 'wb') as f:
            f.write(image_bytes)
        
        return jsonify({'success': True, 'message': 'Visage enregistré avec succès'})
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})