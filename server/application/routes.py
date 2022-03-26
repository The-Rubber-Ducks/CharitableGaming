from flask import url_for, redirect, jsonify
from application import app, fbase
from FirebaseFuncs.FirebaseFuncs import CurrentUserNotSet, UserAuthenticationError, UserTokenError
from firebase_admin import auth


@app.route("/api/login", methods=['POST'])
def login():
    if request.method == "POST":
        # Need to make these forms
        email=request.form.get("email")
        password=request.form.get("password")
        # Authenticate
        try:
            authenticate = fbase.authenticate_user(email, password)
        except UserAuthenticationError:
            return abort(404)
        else:
            return 
        



    return abort(405)


@app.route("/api/register", methods=['POST'])
def register():
    if request.method == "POST":
        # Return array of games and player handles
        email=request.form.get("email") # email input field goes here
        password=request.form.get("password") # password input field goes here
        confirmpassword=request.form.get("confirmpassword") 
        if password != confirmpassword:
            return abort(400)
        # Add new user to firebase
        # Authenticate
        # Add playerID to database
        try:
            fbase.add_new_user_email_and_password(email, password)
            authenticate = fbase.authenticate_user(email, password)
            # Still need to add playerID to database
        except auth.EmailAlreadyExistsError: 
            return abort(400)
        except UserAuthenticationError:
            return abort(404)
        else:
            return 

        


    return abort(405)


@app.route("/api/get_user_league_games")
def get_league_games():
    if request.method == "GET":

