from flask import Flask
from flask_cors import CORS, cross_origin
from .FirebaseFuncs import FirebaseFuncs

app = Flask(__name__)
app.config['FLASK_ENV'] = "development"
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
fbase = FirebaseFuncs.FirebaseFuncs()

from application import routes
