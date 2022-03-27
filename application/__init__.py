from flask import Flask
from .FirebaseFuncs import FirebaseFuncs
from flask_cors import CORS

app = Flask(__name__)
fbase = FirebaseFuncs.FirebaseFuncs()
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

from application import routes
