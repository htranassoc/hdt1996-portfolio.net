from lib2to3.pgen2 import token
from .models import SpotifyToken
from django.utils import timezone
from datetime import datetime
from .SpotifyConfig import *
from requests import post, put, get


def get_tokens(session_id): 
    '''
    Find token using current session_id. Having a token means there is an authorized URL that Spotify allocates towards a session.
    '''
    tokens=SpotifyToken.objects.filter(user=session_id)
    if tokens.exists():
        return tokens[0]
        
    else:
        return None

def update_or_create_tokens(session_id,access_token,token_type,expiration,refresh_token): #Should always check token since expiration may be reached at any random time in the future
    tokens = get_tokens(session_id)
    expiration = timezone.now() + timezone.timedelta(seconds=expiration)

    if tokens:
        tokens.access_token=access_token
        tokens.refresh_token=refresh_token
        tokens.expiration=expiration
        tokens.token_type=token_type
        tokens.save(update_fields=['access_token','refresh_token','expiration','token_type'])
    else:
        tokens = SpotifyToken(user = session_id, access_token=access_token, refresh_token=refresh_token,token_type=token_type,expiration=expiration)
        tokens.save()


def check_spotify_auth(session_id): 
    '''
    Called in IsAuthenticated View
    '''
    tokens = get_tokens(session_id) #Get value of token by checking object with keyword arg
    print('\n\n\n', tokens, '\n\n')
    if tokens:
        expiration= tokens.expiration

        if expiration <= timezone.now(): #Check if token is expired yet. If it is, refresh_token called.
            print('\n\n What is Expired compared to now',expiration,timezone.now(),'\n\n')
            refresh_token(session_id)

        return True # Return that authorization is valid in main Is_Authorized view

    return False #Means need to get a new AUTH_URL using the unstored session_key

def refresh_token(session_id):
    refresh_token=get_tokens(session_id).refresh_token
    response = post('https://accounts.spotify.com/api/token', data = {
        'grant_type':'refresh_token',
        'refresh_token':refresh_token,
        'client_id':CLIENT_ID,
        'client_secret':CLIENT_SECRET}).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    expiration = response.get('expires_in')
    
    update_or_create_tokens(session_id, access_token, token_type, expiration, refresh_token)

def request_data(session_id,endpoint, post_=False,put_=False):
    BASE_URL='https://api.spotify.com/v1/me/'
    tokens = get_tokens(session_id)
    header = {'Content-Type':'application/json','Authorization': "Bearer " + tokens.access_token}

    url=[]
    url.append(BASE_URL)
    url.append(endpoint)
    url=''.join(url)

    if post_:
        post(url,headers=header)
    if put_:
        post(url,headers=header)
    

    response = get(url,{},headers=header)

    try: 
        return(response.json())
    except:
        return {'Error': 'Bad Request'}

def play_song(session_id):
    return request_data(session_id, "player/play/",put_=True)

def pause_song(session_id):
    return request_data(session_id, "player/pause/",put_=True)

def skip_song(session_id):
    return request_data(session_id, "player/next/",post_=True)