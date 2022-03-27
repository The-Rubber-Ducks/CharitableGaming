from flask import request, abort
from application import app, fbase, RiotWatcher
from .FirebaseFuncs.FirebaseFuncs import CurrentUserNotSet, UserAuthenticationError, UserTokenError
from firebase_admin import auth, exceptions
import json
import requests


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


@app.route("/api/get_all_charities")
def get_all_charities():
    if request.method == "GET":
        # Call database functions to get charities
        return  json.dumps({'success': True}), 200, {'ContentType':'application/json'}
    return abort(405)


@app.route("/api/set_charity", methods=["POST"])
def set_charity():
    if request.method == "POST":
        set_charity_response = request.get_json()
        try: 
            charity_name = set_charity_response['charity_name']
            if not charity_name:
                return abort(400)
            fbase.set_user_charity(charity_name)

        except KeyError:
            return abort(400)
        except exceptions.NotFoundError:
            return abort(400)
        else:
            return  json.dumps({'success': True}), 200, {'ContentType':'application/json'}

    return abort(405) 


@app.route("/api/logout")
def logout():
    if request.method == "GET":
        try:
            fbase.logout_user()
            return  json.dumps({'success': True}), 200, {'ContentType':'application/json'}
        except firebase_admin.exceptions.FirebaseError:
            return abort(400)

    return abort(405)
        

@app.route("/api/get_user_league_games")
def get_user_league_games():
    # Get the player's GameID
    # Call Will's Riot API to get the games
    # Add a check for game in database
    # Add games to database
    # Send games to frontend
    if request.method == "GET":
        try:
            fbase.authenticate_user("mob@example.com", "password")
            summoner_name = fbase.get_user_player_id()
            region = "North America"
            puid = RiotWatcher.get_puuid(summoner_name, region)
            return puid

        except exceptions.FirebaseError:
            return abort(400)
        except UserTokenError:
            return abort(400)


    return abort(405)

#@app.route("/api/get_user_league_games")
#def get_league_games():
#    if request.method == "GET":
#
#
#@app.route("/api/charities")
#def charities():
