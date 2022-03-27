from ast import Index
from flask import request, abort
from application import app, fbase, RiotWatcher
from .FirebaseFuncs.FirebaseFuncs import CurrentUserNotSet, UserAuthenticationError, UserTokenError
from firebase_admin import auth, exceptions
import json
from flask_cors import cross_origin


@app.route("/api/login", methods=['POST'])
@cross_origin()
def login():
    """
    Logs in a user by requesting an idToken from Firebase authentication system.
    Sets the user's data in the FirebaseFuncs object.
    """
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
@cross_origin()
def register():
    """
    Registers a new user. Adds them to the database. Then requests an idToken from the
    Firebase authentication system. "Logs" them in by set their user data in the FirebaseFuncs object.
    Sets their charity and player handles for specified games.
    """
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
            charity = register_response['charity']

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

            fbase.set_user_charity(charity)

        except auth.EmailAlreadyExistsError: 
            return abort(400)
        except UserAuthenticationError:
            return abort(404)
        except KeyError:
            return abort(400)
        except exceptions.NotFoundError:
            return abort(400)
        except IndexError:
            return abort(400)
        else:
            return  json.dumps({'success': True}), 200, {'ContentType':'application/json'}

    return abort(405)


@app.route("/api/get_all_charities")
@cross_origin()
def get_all_charities():
    """
    Provides all the charity's data.
    """
    if request.method == "GET":
        charity_info = fbase.get_all_charity_info()
        # Call database functions to get charities
        return  json.dumps(charity_info['charities']), 200, {'ContentType':'application/json'}
    return abort(405)


@app.route("/api/set_charity", methods=["POST"])
@cross_origin()
def set_charity():
    """
    Sets a user's charity via the charity name.
    """
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
@cross_origin()
def logout():
    """
    Logs out a user by revoking their refresh tokens, and dumping their data 
    in the FirebaseFuncs object.
    """
    if request.method == "GET":
        try:
            fbase.logout_user()
            return  json.dumps({'success': True}), 200, {'ContentType':'application/json'}
        except exceptions.FirebaseError:
            return abort(400)

    return abort(405)
        

@app.route("/api/get_user_league_games")
@cross_origin()
def get_user_league_games():
    """
    Returns the user's most recent 5 League of Legends games.
    Requires pulling the summoner name they gave on registration.
    """
    if request.method == "GET":
        try:
            summoner_name, region = fbase.get_user_handle_and_region()
            puid = RiotWatcher.get_puuid(summoner_name, region)
            last_five_matches = RiotWatcher.get_matchlist(puid, "North America", 5)
            stats = RiotWatcher.get_player_match_stats(puid, "North America", last_five_matches, "kills", "deaths", "assists", "win")
            fbase.add_league_matches(summoner_name, stats)
            return json.dumps(stats), 200, {'ContentType':'application/json'}

        except exceptions.FirebaseError:
            return abort(400)
        except UserTokenError:
            return abort(400)

    return abort(405)


@app.route("/api/get_leaderboard")
@cross_origin()
def get_leaderboard():
    """
    Returns the top 3 players with the most charity points.
    URL Example: http://localhost:8080/api/get_leaderboard?game=League_of_Legends

    Args:
        Requires a gamename.

    Returns a JSON, as an example:
        [{"topo": 692}, {"topo": 0}, {"topo": 0}]
    """
    if request.method == "GET":
        game_name = request.args['game']
        game_name = game_name.replace('_', ' ')
        num_choices = request.args['num_of_choices']
        leaderboard = fbase.get_leaderboard(num_choices, game_name)
        return json.dumps(leaderboard), 200, {'ContentType':'application/json'}

    return abort(405)


@app.route("/api/get_user_data")
@cross_origin()
def get_user_data():
    """
    Gets the currently logged in user's data.
    
    Returns JSON as example:
        {
            "user_region": "North America", 
            "created_at": "03/27/2022 14:02:52", 
            "charity_points": 0, 
            "charity": "",  # Charity needs to be set on registration
            "gamer_handle": "topo"}
    """
    if request.method == "GET":
        user_data = fbase.get_logged_in_user_data()
        return json.dumps(user_data), 200, {'ContentType':'application/json'}

    # Need to catch if user doesn't have a charity gracefully... for now this is it

    return abort(405)
