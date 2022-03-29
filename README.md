# Charitable Gaming

Welcome to the REST API for Charitable Gaming, which is currently deployed on heroku.
It uses the Flask microframework to provide a set of endpoints needed to provide the 
optimal user experience for a gamer to game and donate!

## Endpoints
### api/login
Method = POST.
Logs in the user to the Firebase service.
Must include a JSON containing an email and password, which the REST API then uses to authenticate
the user on Firebase.

Example JSON input:
```
{
    "email": "myemail@email.com",
    "password": "password"
}
```

---

### api/register
Method = POST.
Registers a new user to the Firebase service.
Must include a JSON containing an email, password, password confirmation, a gamer handle for each game, and the charity they wish to donate to. On the frontend, the user is provided the list of charities to choose from in a dropdown menu.

Example JSON input:
```
{
    "email": "myemail@email.com",
    "password": "password",
    "confirmpassword": "password",
    "gamerhandles": [{"League of Legends": "My Gamer Handle"}],
    "charity": "My Charity",
    "display_name": "My Display Name"
}
```

---

### api/get_all_charities
Method = GET.
Returns all currently stored information regarding the available charities, which are stored in Firestore, in JSON format.

Example JSON output:
```
[
    {
    "charity_id": 1, 
    "description": "Pencils of Promise (\\\"PoP\\\") is a 501(c)(3) nonprofit organization that believes every child deserves access to quality education. We create schools, programs and global communities around the common goal of education for all.", 
    "category": "Education & Youth", 
    "year": "2008", 
    "location": "Philadelphia, PA", 
    "name": "Pencils of Promise"
    },
    
    {
    "location": "Virginia Beach, VA", 
    "year": "1982", 
    "name": "Operation Smile", 
    "description": "Vision We envision a future where health and dignity are improved through safe surgery. Mission Through our expertise in treating cleft lip and cleft palate, we create solutions that deliver safe surgery to people where it's needed most.", 
    "category": "International", 
    "charity_id": 2
    }
]
```

---

### api/set_charity
Method = POST.
Allows a user to change their chosen charity to another charity, based on the available charities.
User must be authenticated (i.e. logged in) to access this endpoint.

Example JSON input:
```
{
    "charity_name": "My New Charity"
}
```
---

### api/is_user_logged_in
Method = GET.
Returns a JSON containing a boolean value indicating whether the user is logged in or not.

Example JSON output:
```
{
    "logged_in": true
}
```

---
### api/logout
Method = GET.
Allows a user to logout on the frontend platfrorm. Revokes all refresh tokens.

---
### api/get_user_league_games
Method = GET.
Gets the 5 most recent matches for this user from the Riot League of Legends API. Updates the user's charity points for any new games that are pulled. JSON input must be provided to indicate which game the user is requesting.

The endpoint communicates with the Riot API, providing the user's gamer handle and region, which are stored in Firestore. The Riot API responds with the player's unique puid. From there, using the puid and the given region, the 5 most games can be requested, as well as the stats associated with each time.

User must be authenticated (i.e. logged in) to access this endpoint.

Example JSON output:
```
{
"NA1_4257964296":  {
                    "kills": 11, 
                    "deaths": 11, 
                    "assists": 13, 
                    "win": false
                    }, 
"NA1_4256184672":  {
                    "kills": 1, 
                    "deaths": 2, 
                    "assists": 8, 
                    "win": true
                    }
}
```

---

### api/get_leaderboard
Method = GET.
Returns the top donaters for the specified game, based on charity points

Example JSON output:
```
[{"topo": 692}, {"topo": 0}, {"My Handle": 0}, {"topo": 0}, {"topo": 0}]
```

---
### api/get_user_data
Method = GET.
Returns the top logged in user's data.

User must be authenticated (i.e. logged in) to access this endpoint.

Example JSON output:
```
{
    "user_region": "North America", 
    "charity": "Mary's Place Seattle", 
    "created_at": "03/27/2022 20:01:47",
    "charity_points": 0, 
    "gamer_handle": "My Handle",
    "display_name": "Goku"
}
```
