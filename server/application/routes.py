from flask import request, abort
from application import app, fbase
from .FirebaseFuncs.FirebaseFuncs import CurrentUserNotSet, UserAuthenticationError, UserTokenError
from firebase_admin import auth, exceptions
import json


@app.route("/api/login", methods=['POST'])
def login():
    if request.method == "POST":
        login_response = request.get_json()

        # Authenticate
        try:
            # Need to make these forms
            email = login_response['email']
            password = login_response['password']
            authenticate = fbase.authenticate_user(email, password)
        except UserAuthenticationError:
            return abort(400)
        except KeyError:
            return abort(400)
        else:
            return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 

    return abort(405)


@app.route("/api/register", methods=['POST'])
def register():
    if request.method == "POST":
        register_response = request.get_json()
        # Return array of games and player handles
        # Add new user to firebase
        # Authenticate
        # Add playerID to database
        try:
            email = register_response['email'] # email input field goes here
            password = register_response['password'] # password input field goes here
            confirmpassword = register_response['confirmpassword']
            gamerhandles = register_response['gamerhandles']

            if not gamerhandles:
                return abort(400)

            for game in gamerhandles:
                for val in game.values():
                    if not val:
                        return abort(400)

            if password != confirmpassword:
                return abort(400)
            fbase.add_new_user_email_and_password(email, password)
            authenticate = fbase.authenticate_user(email, password)

            for game in gamerhandles:
                game_name, gamerhandle = game.popitem()
                fbase.set_user_player_id(gamerhandle, game_name)

            # Still need to add playerID to database

        except auth.EmailAlreadyExistsError: 
            return abort(400)
        except UserAuthenticationError:
            return abort(404)
        except KeyError:
            return abort(400)
        except exceptions.NotFoundError:
            return abort(400)
        else:
            return  json.dumps({'success': True}), 200, {'ContentType':'application/json'}


    return abort(405)



#@app.route("/api/get_user_league_games")
#def get_league_games():
#    if request.method == "GET":
#
#
#@app.route("/api/charities")
#def charities():
