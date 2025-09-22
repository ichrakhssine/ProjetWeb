# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""

from apps.home import blueprint
from flask import render_template, request
from flask_login import login_required
from jinja2 import TemplateNotFound

# Route pour la page d'accueil publique (sans login required)
@blueprint.route('/')
def home_public():
    return render_template('home/index.html')

# Route pour le tableau de bord (avec login required)
@blueprint.route('/dashboard')
@login_required
def dashboard():
    return render_template('home/index.html', segment='index')

# Route pour les templates avec gestion d'erreur
@blueprint.route('/<template>')
@login_required
def route_template(template):
    try:
        if not template.endswith('.html'):
            template += '.html'

        # Détecter la page courante
        segment = get_segment(request)

        # Servir le fichier depuis app/templates/home/FILE.html
        return render_template("home/" + template, segment=segment)

    except TemplateNotFound:
        return render_template('home/page-404.html'), 404
    except Exception as e:
        print(f"Erreur: {e}")
        return render_template('home/page-500.html'), 500

# Helper - Extraire le nom de la page courante depuis la requête
def get_segment(request):
    try:
        segment = request.path.split('/')[-1]
        if segment == '':
            segment = 'index'
        return segment
    except:
        return None