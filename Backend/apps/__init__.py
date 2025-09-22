

import os
from flask import Flask, jsonify, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_dance.contrib.github import make_github_blueprint
from flask_dance.contrib.google import make_google_blueprint

# Initialiser les extensions
db = SQLAlchemy()
login_manager = LoginManager()

def create_app(config_class):
    
    # Chemin ABSOLU vers le dossier templates à la racine
    base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
    template_dir = os.path.join(base_dir, 'templates')
    static_dir = os.path.join(base_dir, 'static') 
    
    app = Flask(__name__, template_folder=template_dir, static_folder=static_dir)
    app.config.from_object(config_class)

    # Initialiser les extensions
    db.init_app(app)
    login_manager.init_app(app)
    login_manager.login_view = 'authentication.login'

    # Configurer les blueprints OAuth avec les vraies valeurs
    if app.config.get('GITHUB_ID') and app.config.get('GITHUB_SECRET'):
        github_blueprint = make_github_blueprint(
            client_id=app.config['GITHUB_ID'],
            client_secret=app.config['GITHUB_SECRET'],
            redirect_to='authentication.login_github'
        )
        app.register_blueprint(github_blueprint, url_prefix='/login')

    if app.config.get('GOOGLE_ID') and app.config.get('GOOGLE_SECRET'):
        google_blueprint = make_google_blueprint(
            client_id=app.config['GOOGLE_ID'],
            client_secret=app.config['GOOGLE_SECRET'],
            redirect_to='authentication.login_google',
            scope=['profile', 'email']
        )
        app.register_blueprint(google_blueprint, url_prefix='/login')

    # Enregistrer les blueprints des modules
    from apps.authentication import blueprint as auth_blueprint
    app.register_blueprint(auth_blueprint)

    # Importer et enregistrer les autres blueprints
    try:
        from apps.home.routes import home_blueprint
        app.register_blueprint(home_blueprint)
    except ImportError:
        app.logger.warning("Module home non trouvé")

    try:
        from apps.charts.routes import charts_blueprint
        app.register_blueprint(charts_blueprint, url_prefix='/charts')
    except ImportError:
        app.logger.warning("Module charts non trouvé")

    try:
        from apps.dyn_dt.routes import dyn_dt_blueprint
        app.register_blueprint(dyn_dt_blueprint, url_prefix='/data')
    except ImportError:
        app.logger.warning("Module dyn_dt non trouvé")

    # Route pour la racine de l'API
    @app.route('/api')
    def api_index():
        return jsonify({
            "message": "API RH - Bienvenue",
            "version": "1.0.0",
            "endpoints": {
                "auth": "/login",
                "home": "/",
                "charts": "/charts",
                "data": "/data"
            }
        })

    # Ensuite définir la route racine
    @app.route('/')
    def index():
        return redirect('/login')
   
    
    
    # Gestionnaire d'utilisateur pour Flask-Login
    from apps.authentication.models import User
    
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    return app