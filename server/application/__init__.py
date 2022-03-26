from flask import Flask
from .FirebaseFuncs import FirebaseFuncs

app = Flask(__name__)
app.config['FLASK_ENV'] = "development"
fbase = FirebaseFuncs.FirebaseFuncs()

from application import routes
