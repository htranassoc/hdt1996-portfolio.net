from .models import HostSongData 
from .serializer import HostSongData_Serializer
from .SpotifyConfig import *
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from requests import Request,post
from .util import *
from django.shortcuts import render, redirect
from frontend.dj_frontend.models import React_Room
class GetAuthURL(APIView):
    def get (self, request):
        scopes = 'user-read-playback-state user-modify-playback-state user-read-currently-playing'
        url = Request('GET','https://accounts.spotify.com/authorize',params = {'scope':scopes, 'response_type':'code','redirect_uri':REDIRECT_URI,'client_id':CLIENT_ID}).prepare().url #code is authentication token
        return Response({'url':url},status = status.HTTP_200_OK)

class Redirect_Callback(APIView): 
    def get(self,request):
        code = request.GET['code']

        response = post('https://accounts.spotify.com/api/token',data={
            'grant_type':'authorization_code',
            'code':code,
            'redirect_uri':REDIRECT_URI,
            'client_id':CLIENT_ID,
            'client_secret':CLIENT_SECRET
            }).json()
        access_token=response.get('access_token')
        token_type=response.get('token_type')
        refresh_token=response.get('refresh_token')
        expiration=response.get('expires_in')
        
        if not request.session.exists(request.session.session_key):
            request.session.create()

        update_or_create_tokens(request.session.session_key,access_token,token_type,expiration,refresh_token)

        return redirect('http://192.168.0.37:8001/react/ContentSharing/')


class IsAuthenticated(APIView): 
    '''
    Called First to Check Authentication
    '''
    def get (self, request):
        auth_status=check_spotify_auth(request.session.session_key) #in utils
        return Response({'status': auth_status}, status = status.HTTP_200_OK)

class CurrentSong(APIView):
    def get(self, request):
        room_code = request.session.get('JoinCode') #will only get JoinCode in active Django request, not debug React
        room = React_Room.objects.filter(code=room_code)
        if room.exists():
            room = room[0]
        else:
            return Response({}, status = status.HTTP_404_NOT_FOUND)
        
        host = room.host
        endpoint = "player/currently-playing/"
        response = request_data(host,endpoint)

        if  response.get('error') != None or response.get('item')== None:
            return Response({'No Content':'No Active Songs in Spotify Selection'}, status=status.HTTP_202_ACCEPTED)
        
        item = response['item']
        duration = item['duration_ms']
        song_id=item['id']
        album_cover = item['album']['images'][0]['url']
        progress= response['progress_ms']
        is_playing=response['is_playing']
        
        artist_string=[]
        for i, artist in enumerate(item['artists']):
            artist_string.append(artist['name'])

        artist_string = ', '.join(artist_string)
        song={
            'title': item['name'],
            'artist':artist_string,
            'duration':duration,
            'time':progress,
            'image_url':album_cover,
            'is_playing':is_playing,
            'votes':0,
            'id':song_id
        }

        return Response(song,status=status.HTTP_200_OK)

class SkipSong(APIView):
    def post(self,response):
        room_code=self.request.session.get('JoinCode')
        room = React_Room.objects.filter(code=room_code)
        if len(room)>0:
            room = room[0]

        if self.request.session.session_key == room.host:
            skip_song(room.host)
        else:
            pass
        return Response({'Song_Update:Skip'},status.HTTP_200_OK)

class PauseSong(APIView):
    def put(self, response):
        room_code=self.request.session.get('JoinCode')
        room = React_Room.objects.filter(code=room_code)
        if len(room)>0:
            room = room[0]
        if self.request.session.session_key == room.host or room.guest_can_pause:
            pause_song(room.host)
            return Response({},status=status.HTTP_200_OK)
        return Response({},status=status.HTTP_403_FORBIDDEN)

class PlaySong(APIView):
    def put(self, response):
        room_code=self.request.session.get('JoinCode')
        room = React_Room.objects.filter(code=room_code)
        if len(room)>0:
            room = room[0]
        else:
            return Response({'Error':f'Room {room_code} does not exist'},status=status.HTTP_404_NOT_FOUND)
        if self.request.session.session_key == room.host or room.guest_can_pause:
            play_song(room.host)
            return Response({},status=status.HTTP_200_OK)
        return Response({},status=status.HTTP_403_FORBIDDEN)

class GetHostData(APIView):
    def get(self, request):
        room_code=request.session.get('JoinCode')
        hostdata = HostSongData.objects.filter(code=room_code)
        if len(hostdata)>0:
            hostdata = hostdata[0]
        else:
            return Response({'Error':f'Host Data from {room_code} does not exist'},status=status.HTTP_404_NOT_FOUND)

        if request.session.session_key != hostdata.host:
            title=hostdata.title
            artist=hostdata.artist
            code = hostdata.code
            votes=hostdata.votes
            duration=hostdata.duration
            time = hostdata.time
            image_url=hostdata.image_url
            is_playing=hostdata.is_playing

            data={
                'title':title,
                'artist':artist,
                'code':code,
                'votes':votes,
                'duration':duration,
                'time':time,
                'image_url':image_url,
                'is_playing':is_playing
            }
            return Response(data,status=status.HTTP_200_OK)

class HostDataUpdate(APIView):
    serializer_class=HostSongData_Serializer
    def post(self,request):
        room_code=request.session.get('JoinCode')
        hostdata = HostSongData.objects.filter(code=room_code)
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            title=serializer.data['title']
            artist=serializer.data['artist']
            code = serializer.data['code']
            votes=serializer.data['votes']
            duration=serializer.data['duration']
            time = serializer.data['time']
            image_url=serializer.data['image_url']
            is_playing=serializer.data['is_playing']
        else:
            return Response({'Error':'Fetch data submitted is not valid'},status=status.HTTP_403_FORBIDDEN)

        data={
            'title':title,
            'artist':artist,
            'code':code,
            'votes':votes,
            'duration':duration,
            'time':time,
            'image_url':image_url,
            'is_playing':is_playing}

        if len(hostdata)>0:

            hostdata = hostdata[0]
            hostdata.title=title
            hostdata.artist=artist
            hostdata.code=code
            hostdata.votes=votes
            hostdata.duration=duration
            hostdata.time=time
            hostdata.image_url=image_url
            hostdata.is_playing=is_playing
            hostdata.save(update_fields=['title','artist','code','votes','duration','time','image_url','is_playing'])
            
        else:
            hostdata=HostSongData.objects.create(\
            title=title,
            artist=artist,
            code=code,
            votes=votes,
            duration=duration,
            time=time,
            image_url=image_url,
            is_playing=is_playing)
            hostdata.save()


            return Response(data,status=status.HTTP_200_OK)

        return Response(data,status=status.HTTP_200_OK)
        
