"""
Contains functionality for CRUD operations through the FireStore database.
For most of the functionality, a user needs to be set, ideally on login to the website.

To use these, import the FireStoreDB class. 
To catch any exceptions where the user might not be logged in, import the CurrentUserNotSet exception.

Create a new instance of the FireStoreDB class to have access to the FireStoreDB. This only needs to be performed once.
When a new user is registered, call the FireStoreDB object's add_user class. Following is an example:

db = FireStormDB()
user_added = db.add_user("MyUsername", "MyPassword)

add_user checks if the username has already been taken or not.

If, for instance, a user wants to log in, you would call the check_for_user method to verify that user's username exist,
and that the password hash matches for the given user.

Once a user is logged, it is imperative to call the set_current_user function, as all other functionality
included in the class requires the current user's data.

Check the FireStoreDB class's documentation for the additional functionality.
"""

import firebase_admin
from firebase_admin import firestore
from firebase_admin import exceptions as db_exceptions
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from functools import wraps

class CurrentUserNotSet(Exception):
	"""
	Exception that occurs solely in the FireStoreDB objects. 
	Occurs when the current_username field is not set.
	This effectively means that a user has not been logged in.
	"""
	def __init__(self, message):
		super().__init__(message)

def is_current_user_set(func):
	"""
	Checks if the current user is set (i.e. logged in) before performing the wrapped function.
	Used in FireStoreDB objects.
	"""
	@wraps(func)
	def wrapper(*args, **kwargs):
		if args[0].current_username is None:
			raise CurrentUserNotSet("Please set current user.")
		
		else:
			return func(*args, **kwargs)

	return wrapper

class FirestoreDB:
	"""
	Class represents a connection to the FireStore database for the CharitableGaming project.
	Contains method to:
		Set the current user, whoever is logged in
		Add a user
		Verify a user is in the database
		Add points to a user's CharityPoints
		Set a player's ID for LeagueOfLegends
		Get the player's ID for LeagueOfLegends
		Set a user's charity
		Add a Charity	
		Add LeagueOfLegends matches

	Credentials for the database are required in a file called 'key.json' that should be stored in the same dir as this file.
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
		self.current_username = None
		self._current_user_object = None

	def set_current_user(self, username: str):
		"""
		Stores the current user's username and the user's FireStore object.
		Should be called on login to the website to set the current user.

		Args:
			username (str): Current user's username.
		"""
		self.current_username = username
		self._current_user_object = self._db.collection('users').document(f'{self.current_username}').get()

	def add_user(self, username: str, password: str) -> bool:
		"""
		Adds a user to the database.
		First verifies that a user with that username does not already exist.

		Encrypts and salts the given password string.
		Defaults user region to 'North America'.
		Defaults user's charity to an empty string.
		Defaults charity points to 0.

		Args:
			username (str): Given user's username
			password (str): Users raw string password

		Raises:
			firebase_admin.exceptions.NotFoundError: User was not found.

		Returns:
			True (bool): If user successfully created
		"""
		previous_user = self._db.collection('users').document(f'{username}').get()

		if previous_user.exists:
			# User does not exist
			raise db_exceptions.NotFoundError('User not found.')

		new_user = self._db.collection('users').document(f'{username}')
		hashed_password = generate_password_hash(password)
		current_time = datetime.utcnow()

		new_user.set({
			'username': f'{username}',
			'password': f'{hashed_password}',
			'user_region': 'North America',
			'charity_points': 0,
			'created_at': current_time.strftime("%m/%d/%Y %H:%M:%S"),
			'charity': ''
		})

		return True

	def check_for_user(self, username: str, password: str) -> bool:
		"""
		Checks if the given user exists in the database.

		Args:
			username (str): Username of the user to check for
			password (str): Password of the user to check for

		Raises:
			firebase_admin.exceptions.NotFoundError: User was not found.

		Returns:
			bool: True if password matches, False if not
		"""
		user = self._db.collection('users').document(f'{username}').get()
		
		if user.exists:
			user_dict = user.to_dict()

			if check_password_hash(user_dict['password'], password):
				return True
			else:
				return False

		else:
			raise db_exceptions.NotFoundError('User not found.')

	@is_current_user_set
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

	@is_current_user_set
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

	@is_current_user_set
	def get_user_player_id(self, game_name: str="League of Legends") -> str:
		"""
		Gets the user's player ID for the requested game. Access to the game API is available through the player's ID.
		The player's ID differs from their username.

		Args:
			game_name (str, optional): The game's name. Defaults to "League of Legends".

		Returns:
			str: The user's player id.
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

		return player_id[0].to_dict()['playerID']

	@is_current_user_set	
	def set_user_charity(self, charity_name: str) -> bool:
		"""
		Checks if charity exists.
		If so, then sets the current user's charity to the given charity.
		For consistency, all charity names are set to lowercase, and all spaces are removed.

		Args:
			charity_name (str): The Charity to set to

		Raises:
			firebase_admin.exceptions.NotFoundError: The charity does not exist

		Returns:
			bool: True if success
		"""

		# All charity names have no spaces and are set to lowercase
		charity_name = charity_name.replace(' ','').lower()
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

	@is_current_user_set
	def add_charity(self, charity_name: str) -> bool:
		"""
		Adds a charity with the given name to the database, as long as it doesn't already exist.
		For consistency, all charity names are set to lowercase, and all spaces are removed.

		Args:
			charity_name (str): Charity to add

		Raises:
			firebase_admin.exceptions.AlreadyExistsError: Charity already exists.

		Returns:
			bool: True if success, False if already exists
		"""
		# All charity names have no spaces and are set to lowercase
		new_charity_name = charity_name.replace(' ','').lower()
		charity_with_same_name = self._db.collection('charity').where('name','==',f'{new_charity_name}').get()

		if not charity_with_same_name:
			# Charity does not exist
			new_charity = self._db.collection('charity').document(f'{charity_name}')
			
			new_charity.set({
				'name': new_charity_name
			})

			return True

		else:
			raise db_exceptions.AlreadyExistsError('Charity already exists.')

	@is_current_user_set
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

		for match in match_data:
			current_match = match_data[match]
			new_match_id_for_db = self._db.collection('leaguestats').document()
			batch.set(new_match_id_for_db, {
				'match_id': f'{match}',
				'kills': current_match['kills'],
				'assists': current_match['assists'],
				'deaths': current_match['deaths'],
				'win_loss': current_match['win'],
				'playerID': player_id_obj.reference,
				'added_at': current_time.strftime("%m/%d/%Y %H:%M:%S")
			})

			# Can add to user's charity points here
		
		batch.commit()

		return True
