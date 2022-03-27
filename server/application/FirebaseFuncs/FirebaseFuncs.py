"""
Contains functionality for authenticating a user through Google Auth and Firebase, and CRUD operations 
through the Google FireStore.
For most of the functionality, a user needs to be authenticated, ideally on login to the website.

To use these, import the FirebaseFuncs class. 

Create a new instance of the FirebaseFuncs class to create a connection to the FireStore services. 
This only needs to be performed once.

Login and registration are assumed to occur using a user's email and password. 
Additionally, on first registration, a user provides their player handles for the specified games. 
An example of this would look like this:

	fbase = FirebaseFuncs()
	fbase.add_new_user_email_and_password("bob@example.com", "password")
	fbase.authenticate_user("bob@example.com", "password")
	fbase.set_user_player_id("my_gamer_handle", game_name="League of Legends")
	fbase.add_charity("My Charity")
	fbase.set_user_charity("My Charity")

A User's token that is provided on authentication with Firebase does expire (default after 1 hr, or 3600 seconds).
Any method that requires the user to be authenticated will verify that the user's token has not yet expired.

Check the FirebaseFuncs class's documentation for  additional functionality.

Credentials for the Firebase project are required in a file called 'key.json' that should be stored in the same dir as this file.
The API key for the Google Authentication service (the WebAPI) must be stored in a .env file in the same dir as this file.
"""
import firebase_admin
from firebase_admin import firestore, auth
from firebase_admin._auth_utils import InvalidIdTokenError, UserDisabledError
from firebase_admin._token_gen import ExpiredIdTokenError, RevokedIdTokenError, CertificateFetchError
from firebase_admin import exceptions as db_exceptions
from datetime import datetime
from functools import wraps
import requests
from dotenv import load_dotenv
from os import environ, path
import copy

basedir = path.abspath(path.dirname(__file__))
load_dotenv(path.join(basedir, ".env"))

API_KEY = environ.get('API_KEY')

class CurrentUserNotSet(Exception):
	"""
	Exception that occurs solely in the FireStoreDB objects. 
	Occurs when the current_username field is not set.
	This effectively means that a user has not been logged in.
	"""
	def __init__(self, message):
		super().__init__(message)

class UserAuthenticationError(Exception):
	"""
	Occurs when the google auth API receives an invalid response from the API.
	"""
	def __init__(self, message):
		super().__init__(message)

class UserTokenError(Exception):
	"""
	Raised if the current user's token cannot be verified.
	"""
	pass

def _is_current_user_set_or_expired(func):
	"""
	Checks if the current user id is set (i.e. logged in).
	Checks if the current user's token is still valid. 
	If still valid, performs the wrapped function.
	Used to wrap functions that require authentication within the FirebaseFuncs instances.
	"""
	@wraps(func)
	def wrapper(self, *args, **kwargs):
		if self._current_user_uid is None:
			raise CurrentUserNotSet("Please set current user.")
		
		else:
			try:
				self._auth.verify_id_token(self._current_user_idToken)

			except ValueError as e:
				raise UserTokenError("Id token not a string or is not empty.") from e

			except InvalidIdTokenError as e:
				raise UserTokenError("ID Token invalid.") from e

			except ExpiredIdTokenError as e:
				raise UserTokenError("ID Token has expired.") from e
			
			except RevokedIdTokenError as e:
				raise UserTokenError("ID Token has been revoked.") from e

			except CertificateFetchError as e:
				raise UserTokenError("Error occured while fetching public key certificates.") from e

			except UserDisabledError as e:
				raise UserTokenError("User has been disabled.") from e

			else:
				return func(self, *args, **kwargs)

	return wrapper

class FirebaseFuncs:
	"""
	Class represents a connection to the FireStore database for the CharitableGaming project.
	Contains methods to:
		Set the current user, whoever is logged in
		Add a new user
		Authenticate and login a user
		Add points to a user's CharityPoints
		Set a player's ID (default for LeagueOfLegends)
		Get the player's ID (default for LeagueOfLegends)
		Set a user's charity
		Add a Charity	
		Add LeagueOfLegends matches

	Credentials for the Firebase project are required in a file called 'key.json' that should be stored in the same dir as this file.
	The API key for the Google Authentication service (the WebAPI) must be stored in a .env file in the same dir as this file.
	"""

	def __init__(self) -> None:
		"""
		Instantiates a FireStoreDB object that represents a connection to the FireStore DB.
		Initializes a connection to the database when this object is created.
		Initializes the current user to None.
		"""
		self._cred = firebase_admin.credentials.Certificate('key.json')
		self._db_app = firebase_admin.initialize_app(self._cred)
		self._db = firestore.client()
		self._auth = auth
		self._current_user_uid = None
		self._current_user_object = None
		self._current_user_logged_in_time = None
		self._seconds_until_user_expires = None
		self._current_user_idToken = None

		
	def _set_current_user(self, user_id: str):
		"""
		Stores the current user's username and the user's FireStore object.
		Should be called on login to the website to set the current user.

		Args:
			username (str): Current user's username.
		"""
		self._current_user_uid= user_id
		self._current_user_object = self._db.collection('users').document(f'{user_id}').get()


	def add_new_user_email_and_password(self, email: str, password: str) -> bool:
		"""
		Adds a user for authentication using their email and password.
		Once the user is authenticated, a User ID (uid) is given that is unique to that user.
		This creates a user specific document in FireStore by interacting with add_user_to_firestore method.

		Args:
			email (str): User's email to add to the authentication
			password (str): User's raw string password to add to Firebase authentication

		Raises:
			firebase_admin.auth.EmailAlreadyExistsError: If the given email already exists

		Returns:
			bool: True on success
		"""
		new_user_record = self._auth.create_user(
			email=email,
			password=password,
			email_verified=False
		)
		user_id = new_user_record.uid
		self._add_user_to_firestore(user_id)

		return True


	def authenticate_user(self, email: str, password: str) -> dict:
		"""
		Signs in a user using the Google auth API endpoint, with the user's email and password.
		If a successful response from the API, provides their Auth ID token, their refresh Token, and in how many seconds
		the ID token expires. 

		Args:
			email (str): User's email
			password (str): User's raw password

		Raises:
			UserAuthenticationError: Raised if the API response for Google Auth sign in fails. Includes message for
										what the error was. Possible failures include incorrect password or user not found.

		Returns:
			dict: Dictionary containing the following parameters:
				idToken (str): A Firebase Auth ID token for the authenticated user.
				refreshToken (str): A Firebase Auth refresh token for the authenticated user.
				expiresIn (int): The number of seconds in which the ID token expires
				currentTime (str): The current time as a datetime object
		"""
		LOGIN_ENDPOINT = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key="
		data = {
			"email": email,
            "password": password,
            "returnSecureToken": True
		}
		result = requests.post(LOGIN_ENDPOINT + API_KEY, json=data)

		if not result.ok:
			error = result.json()['error']
			raise UserAuthenticationError(message=f"{error['code']}: {error['message']}")

		response = result.json()
		uid = response['localId']
		self._set_current_user(uid)

		self._current_user_logged_in_time = datetime.utcnow()
		self._seconds_until_user_expires = int(response['expiresIn'])
		self._current_user_idToken = response['idToken']

		session_info = {
			'idToken': response['idToken'],
			'refreshToken': response['refreshToken'],
			'expiresIn': int(response['expiresIn']),
			'currentTime': self._current_user_logged_in_time
		}

		return session_info


	def logout_user(self):
		"""
		Logs out the user by dumping all of the current user's data stored in this object.
		Revokes all user's currently set refresh tokens so they'd have to reauthenticate to log in.
		Note - this does not invalidate the idToken provided by Firebase. Any instance of the
		token that is still available can be used for authentication still.

		No method currently to invalidate the tokens provided by Google.
		The token will just expire after the default of 3600 seconds from authorization.

		Raises:
			firebase_admin.exceptions.FirebaseError: If There is a FireBase error
		"""
		self._auth.revoke_refresh_tokens(self._current_user_uid)
		self._current_user_uid = None
		self._current_user_object = None
		self._current_user_logged_in_time = None
		self._seconds_until_user_expires = None
		self._current_user_idToken = None


	def _add_user_to_firestore(self, user_id: str):
		"""
		Adds a user document to firestore based on the unique authentication id.

		Defaults user region to 'North America'.
		Defaults user's charity to an empty string.
		Defaults charity points to 0.

		Args:
			user_id (str): Given user's user id from authentication.

		Raises:
			firebase_admin.exceptions.AlreadyExistsError: User document already exists.

		"""
		previous_user = self._db.collection('users').document(f'{user_id}').get()

		if previous_user.exists:
			# User document already exists for that ID.
			raise db_exceptions.AlreadyExistsError('User already exists with that unique id.')

		new_user = self._db.collection('users').document(f'{user_id}')
		current_time = datetime.utcnow()

		new_user.set({
			'user_region': 'North America',
			'charity_points': 0,
			'created_at': current_time.strftime("%m/%d/%Y %H:%M:%S"),
			'charity': ''
		})


	def verify_user(self) -> bool:
		"""Verifies the current user's ID token. True if verified, False if not."""
		try:
			self._auth.verify_id_token(self._current_user_idToken)

		except (ValueError, InvalidIdTokenError, ExpiredIdTokenError, 
				RevokedIdTokenError, CertificateFetchError, UserDisabledError):
			return False

		else:
			return True


	def get_all_charity_info(self) -> dict:
		"""
		Requests all the charity data from the database, and returns it as a dict.
		
		Returns:
			(dict): A dict, where the key is charities, and the values are a list of dicts. Each
						nested dict contains information on the charity, as follows:

						"name" (str): Name of charity,
						"description" (str): Description of charity,
						"category" (str): Category of the charity,
						"location" (str): Location of the charity,
						"year" (str): Year charity was created,
						"charity_id" (int): The charity id
		"""
		all_charities = self._db.collection_group('charity').order_by('charity_id').get()
		charities = {"charities": []}

		for charity in all_charities:
			charities["charities"].append(charity.to_dict())

		return charities

	def get_leaderboard(self, num_of_choices: str, game_name: str="League of Legends") -> dict:
		"""
		Requests the 3 highest players with the most charity points.

		Args:
			game_name (str): The game name for the leaderboard
			num_of_choices (str): How many choices requested, either 'mini' or 'complete'

		Returns:
			list: List of dicts containing 3 highest players.
		"""
		game = self._db.collection('games').where('name','==',f'{game_name}').get()

		if not game:
			raise db_exceptions.NotFoundError('Game not found.')

		# Since League of Legends is currently only game, there is only one item in the list
		game = game[0]

		all_leaders = self._db.collection_group('users').order_by('charity_points').get()
		leaders = []
		all_leaders.reverse()
		for leader in all_leaders:
			summoner_name = self._db.collection('userplayernames').where('game','==', game.reference).where('user','==', leader.reference).get()
			
			if not summoner_name:
				# Player doesn't play this game
				continue

			else:
				player_handle = summoner_name[0].to_dict()['playerID']
				charity_points = leader.to_dict()['charity_points']
				new_leader_dict = {player_handle: charity_points}
				leaders.append(new_leader_dict)
		
		if num_of_choices == 'mini':
			return leaders[:3]
		else:
			return leaders

	@_is_current_user_set_or_expired
	def get_logged_in_user_data(self, game_name: str="League of Legends") -> list:
		"""
		Returns the currently logged in user's data. User must be authenticated.

		Args:
			game_name: Current game name

		Returns:
			(dict): Containing current user's data, with the following key value pairs:
						'charity_points' (int): Charity points for the player,
						'user_region' (str): The current user's region,
						'created_at' (str): String format for time user was added,
						'gamer_handle' (str): Returns the gamer handle
		"""
		game = self._db.collection('games').where('name','==',f'{game_name}').get()

		if not game:
			raise db_exceptions.NotFoundError('Game not found.')

		# Since League of Legends is currently only game, there is only one item in the list
		game = game[0]

		current_user_dict = self._current_user_object.to_dict()
		summoner_name = self._db.collection('userplayernames').where('game','==', game.reference).where('user','==', self._current_user_object.reference).get()
		if current_user_dict['charity']:
			# User charity  set
			current_user_dict['charity'] = current_user_dict['charity'].get().to_dict()['name']

		user_handle = summoner_name[0].to_dict()['playerID']
		current_user_dict["gamer_handle"] = user_handle
		return current_user_dict

	@_is_current_user_set_or_expired
	def add_points_to_current_user(self, points_to_add: int) -> bool:
		"""
		Adds points to the current user's Charity Points.

		Args:
			points_to_add (int): The number of points to add.

		Returns:
			bool: True if successful adding of points to user, False if points are below zero
		"""
		if points_to_add < 0:
			return False

		user_dict = self._current_user_object.to_dict()
		user_dict['charity_points'] += points_to_add

		self._current_user_object.reference.update({
			'charity_points': user_dict['charity_points']
			})

		return True


	@_is_current_user_set_or_expired
	def set_user_player_id(self, player_id: str, game_name: str="League of Legends") -> bool:
		"""
		Sets a user's player id for a game. This field can be updated as many times as the user sees fit
		for a specified game.

		Args:
			player_id (str): The player's id for the specific game
			game_name (str, optional): The game's name. Defaults to "League of Legends".

		Raises:
			db_exceptions.NotFoundError: Game not found.

		Returns:
			bool: True if success
		"""

		game = self._db.collection('games').where('name','==',f'{game_name}').get()

		if not game:
			raise db_exceptions.NotFoundError('Game not found.')

		# Since League of Legends is currently only game, there is only one item in the list
		game = game[0]

		# If it already exists, update the current one. Else, create a new player id
		already_added_player_id = self._db.collection('userplayernames').where('game','==', game.reference).where('user','==', self._current_user_object.reference).get()
		
		if not already_added_player_id:
			# Create new player id since user hasn't created one yet
			new_player_id = self._db.collection('userplayernames').add({
				'game': game.reference,
				'playerID': f'{player_id}',
				'user': self._current_user_object.reference
			})

		else:
			# There can only be one player id associated with a specified game and user
			already_added_player_id = already_added_player_id[0]
			already_added_player_id.reference.update({
				'playerID': f'{player_id}'
			})

		return True


	@_is_current_user_set_or_expired
	def get_user_handle_and_region(self, game_name: str="League of Legends") -> tuple:
		"""
		Gets the user's player ID for the requested game. Access to the game API is available through the player's ID.
		The player's ID differs from their username.

		Args:
			game_name (str, optional): The game's name. Defaults to "League of Legends".

		Returns:
			tuple: Tuple of strings - (summoner_id, region)
		"""
		game = self._db.collection('games').where('name','==',f'{game_name}').get()

		if not game:
			raise db_exceptions.NotFoundError('Game not found.')

		# Since League of Legends is currently only game, there is only one item in the list
		game = game[0]

		player_id = self._db.collection('userplayernames').where('game','==', game.reference).where('user','==', self._current_user_object.reference).get()

		if not player_id:
			# No valid player ID available
			raise db_exceptions.NotFoundError('No player ID found. One must be set.')

		summoner_name = player_id[0].to_dict()['playerID']
		region = self._current_user_object.to_dict()['user_region']

		return summoner_name, region


	@_is_current_user_set_or_expired	
	def set_user_charity(self, charity_name: str) -> bool:
		"""
		Checks if charity exists.
		If so, then sets the current user's charity to the given charity.
		Args:
			charity_name (str): The Charity to set to

		Raises:
			firebase_admin.exceptions.NotFoundError: The charity does not exist

		Returns:
			bool: True if success
		"""

		try:
			charity = self._db.collection('charity').where('name','==',f'{charity_name}').get()[0]
			if charity.exists:
				self._current_user_object.reference.update({
					'charity': charity.reference
				})
				return True
		
		except IndexError:
			# Charity did not exist
			raise db_exceptions.NotFoundError('Charity not found.')


	@_is_current_user_set_or_expired
	def add_charity(self, charity_name: str) -> bool:
		"""
		Adds a charity with the given name to the database, as long as it doesn't already exist.

		Args:
			charity_name (str): Charity to add

		Raises:
			firebase_admin.exceptions.AlreadyExistsError: Charity already exists.

		Returns:
			bool: True if success, False if already exists
		"""
		# Make sure charity doesn't exist already
		charity_with_same_name = self._db.collection('charity').where('name','==',f'{charity_name}').get()

		if not charity_with_same_name:
			# Charity does not exist
			new_charity = self._db.collection('charity').document(f'{charity_name}')
			
			new_charity.set({
				'name': charity_name
			})

			return True

		else:
			raise db_exceptions.AlreadyExistsError('Charity already exists.')


	@_is_current_user_set_or_expired
	def add_league_matches(self, player_id: str, match_data: dict) -> bool:
		"""
		Adds match data to the database for the current user.
		As there can be multiple matches entered for a given user, this will be a batch upload.
		The player's ID that was used to access the match data from League needs to be given as well for reference.

		Match data is given in dict format in the following generalized method:
		{Match_ID: {'assists': numb_of_assists, 'deaths': numb_of_deaths', 'kills': numb_of_kills, 'win': boolean}}

		With the following types:
			Match_ID (str)
			numb_of_assists, numb_of_deaths, numb_of_kills (int)

		There can be multiple matches in the match data. Please see the example below.

		Example format of the input data:
			{   'NA1_4255177813': {'assists': 14, 'deaths': 5, 'kills': 4, 'win': True},
    			'NA1_4256115260': {'assists': 9, 'deaths': 5, 'kills': 1, 'win': False},
    			'NA1_4256140961': {'assists': 1, 'deaths': 6, 'kills': 2, 'win': False},
    			'NA1_4256149034': {'assists': 4, 'deaths': 2, 'kills': 1, 'win': True},
    			'NA1_4256184672': {'assists': 8, 'deaths': 2, 'kills': 1, 'win': True}
				}

		Args:
			player_id (str): The player's ID for League
			match_data (dict): Match data for league.

		Returns:
			bool: True for success
		"""
		player_id_obj = self._db.collection('userplayernames').where('playerID','==', player_id).get()

		if not player_id_obj:
			# No valid player ID available, and therefore an empty list
			raise db_exceptions.NotFoundError('No player ID found. One must be set.')

		# As there is only one player id per person per game, there should be only one value in this list
		player_id_obj = player_id_obj[0]

		batch = self._db.batch()
		current_time = datetime.utcnow()

		charity_points = 0

		for match in match_data:
			# Do not add a match to the database if it's already in there
			previous_match = self._db.collection('leaguestats').where('playerID','==', player_id_obj.reference).where('match_id','==',f'{match}').get()
			
			if previous_match:
				continue

			current_match = match_data[match]
			new_match_for_db = self._db.collection('leaguestats').document()
			batch.set(new_match_for_db, {
				'match_id': f'{match}',
				'kills': current_match['kills'],
				'assists': current_match['assists'],
				'deaths': current_match['deaths'],
				'win_loss': current_match['win'],
				'playerID': player_id_obj.reference,
				'added_at': current_time.strftime("%m/%d/%Y %H:%M:%S")
			})

			current_match_charity_points = 2 * current_match['kills'] + current_match['assists'] - 0.5 * current_match['deaths']

			if current_match['win']:
				current_match_charity_points *= 2
			
			charity_points += current_match_charity_points

		batch.commit()

		self.add_points_to_current_user(round(charity_points))

		return True
