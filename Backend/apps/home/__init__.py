from flask import Blueprint

"home_blueprint = Blueprint('home', __name__)"
home_blueprint = Blueprint('home_blueprint', __name__)

from apps.home import routes