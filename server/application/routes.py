from flask import url_for, redirect, jsonify
from application import app, fbase


@app.route("/api/login", methods=['POST'])
def login():
    if request.method == "POST":
        # Need to make these forms
        email=request.form.get("email")
        password=request.form.get("password")
        # Authenticate



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
        # Add player names to database


    return abort(405)


print(fbase.authenticate_user("mob@example.com", "password"))
