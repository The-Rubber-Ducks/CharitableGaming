"""
get_puuid(user: str, region: str)
    Get puuid by summoner name

    parameters: user (string) -- The summoner name of the user
                region (string) -- The full name of the region (e.g., "North America")

    returns:    string 

get_matchlist(user: str, region: str, num_matches: int)
    Get the match IDs for a specified number of games

    parameters: user (string) -- The summoner name of the user
                region (string) -- The full name of the region (e.g., "North America")

    parameters (optional): num_matches -- number of matches for which to get stats (default is 1)

    returns:    list

get_player_match_stats(puuid: str, matches: list, region: str, [stats]: list):
    Get the stats for a list of matches for any given player

    parameters: user (string) -- The summoner name of the user
                matches (list) -- List of match IDs
                region (string) -- The full name of the region (e.g., "North America")
                

    parameters (optional): stats (list[string]) -- List of stats (ParticipantDTO properties listed in the Riot API docs: https://developer.riotgames.com/apis#match-v5/GET_getMatch)

    returns:    dictionary

platform_to_regional(region: str)
    Helper function thatconverts platform routing values to regional routing values (check the Riot API docs for more info)

    parameters: region (string) -- The full name of the region (e.g., "North America")

    returns: string


Example usage:

    puuid = get_puuid("Topo", "North America") # Get the puuid of the player 

    last_five_matches = get_matchlist(puuid, "North America", 5) # Get the IDs of last 5 matches

    stats = get_player_match_stats(puuid, "North America", last_five_matches, "kills", "deaths", "assists") # Get the player's kills, deaths, and assists for the last 5 matches

    stats_2 = get_player_match_stats(puuid, "North America", last_five_matches, "champLevel", "damageDealtToTurrets") # You can get other stats as well

    print(stats) 

"""

from riotwatcher import LolWatcher, ApiError
from datetime import datetime
from dotenv import load_dotenv
import os

load_dotenv()
YOUR_RIOT_API_KEY = os.environ['YOUR_RIOT_API_KEY']
lol_watcher = LolWatcher(YOUR_RIOT_API_KEY)


def get_puuid(user, region):
    regions = {
        'North America': 'NA1',
        'Europe West': 'EUW1',
        'Europe Nordic & East': 'EUN1',
        'Brazil': 'BR1',
        'Korea': 'KR',
        'Japan': 'JP1',
        'Latin America North': 'LA1',
        'Latin America South': 'LA2',
        'Oceania': 'OC1',
        'Russia': 'RU',
        'Turkey': 'TR1'
    }
    try:
        player = lol_watcher.summoner.by_name(regions[region], user)
    except ApiError as err:
        if err.response.status_code == 429:
            print('Too many requests. Try again later.')
        elif err.response.status_code == 404:
            print('Summoner not found. Check username and region.')
        else:
            raise
    return player['puuid']


def get_matchlist(puuid, region, num_matches=1):    
    region = platform_to_regional(region)
    return lol_watcher.match.matchlist_by_puuid(region, puuid, count=num_matches)


def get_player_match_stats(puuid, region, matches, *args):
    region = platform_to_regional(region)
    all_player_match_stats = {}

    for match in matches:
        player_match_stats = {}
        match_dto = lol_watcher.match.by_id(region, match)

        # convert unix timestamp to datetime
        # ts = match_dto['info']['gameEndTimestamp']/1000
        # match_date = datetime.utcfromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')

        participants = match_dto['info']['participants']
        player = list(filter(lambda item: item['puuid'] == puuid, participants))[0] # filters the list of participant objects to find our player
        for arg in args:
            if not player[arg]:
                player[arg] = 0
            player_match_stats[arg] = player[arg]
        all_player_match_stats[match] = player_match_stats
        # all_player_match_stats[match_date] = player_match_stats
    return all_player_match_stats


def platform_to_regional(region):
    americas = ['North America', 'Latin America North', 'Latin America South',
                'Brazil']
    asia = ['Japan', 'Korea']

    if region in americas: 
        return 'AMERICAS'
    elif region in asia:
        return 'ASIA'
    else:
        return 'EUROPE'
