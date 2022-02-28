from django.http import JsonResponse
from .models import *
from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from .serializer import Note_Serializer, Room_Serializer, CreateRoomSerializer, UpdateRoomSerializer, VideoSerializer
from django.views import View
from datetime import datetime
from backend.settings import DEBUG
import json

class UpdateView(APIView):
    serializer_class=UpdateRoomSerializer
    def put(self,request):
        if not request.session.exists(request.session.session_key): # if user has not been previously logged in
            request.session.create()
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            guest_can_pause=serializer.data.get('guest_can_pause')
            votes_to_skip=serializer.data.get('votes_to_skip')

            code=serializer.data.get('code')

            room = React_Room.objects.get(code=code)
            if room == None:
                return Response({'Message':'Room not Found'},status=status.HTTP_404_NOT_FOUND)
            user_id = self.request.session.session_key

            if room.host != user_id:
                return Response({'Message': 'You are not the host'}, status=status.HTTP_403_FORBIDDEN)

            room.guest_can_pause=guest_can_pause
            room.votes_to_skip=votes_to_skip
            room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
            print(room.guest_can_pause,room.votes_to_skip)
            return Response(Room_Serializer(room).data, status=status.HTTP_200_OK)
            
        return Response({'Bad Request': 'Invalid Data'}, status= status.HTTP_400_BAD_REQUEST)


class UserSessionView(APIView):
    def get(self,request):
        if not request.session.exists(request.session.session_key): # if user has not been previously logged in
            request.session.create()
        data={
            'code':request.session.get('JoinCode')
        }
        return JsonResponse(data, status=status.HTTP_200_OK)


class JoinRoomView(APIView):
    serializer_class=Room_Serializer
    def post(self, request):
        roomCode=request.data['code']
        if not request.session.exists(request.session.session_key): # if user has not been previously logged in
            request.session.create()
        try:
            if roomCode.isdigit():
                room=React_Room.objects.get(id=roomCode)
            else:
                room=React_Room.objects.get(code=roomCode)
        except:
            return Response({'Room Not Found': 'Invalid Room Code'}, status=status.HTTP_403_FORBIDDEN)
        request.session['JoinCode']=room.code
        print(request.session['JoinCode'])
        return Response({'message': f'Room was Joined by {request.user}','JoinCode':request.session['JoinCode']}, status=status.HTTP_202_ACCEPTED)


class AllRoomView(generics.ListAPIView): #Create API View allows html form submission, List removes that option
    queryset=React_Room.objects.all()
    serializer_class= Room_Serializer

class GetRoomView(APIView): #Create API View allows html form submission, List removes that option
    serializer_class= Room_Serializer
    def get(self, request, roomCode):

        try:
            if roomCode.isdigit():
                code=React_Room.objects.get(id=roomCode).code
            else:
                code=roomCode
            room=React_Room.objects.get(code=code)
        except:
            return Response({'Room Not Found': 'Invalid Room Code','errorcode':status.HTTP_403_FORBIDDEN}, status=status.HTTP_403_FORBIDDEN)
        if DEBUG==True:
            print('\n\n DEBUG \n\n')
        else:
            if request.session.get('JoinCode') == None or request.session.get('JoinCode') != code:
                return Response({'Room Found' : 'Need Join Code','errorcode':status.HTTP_401_UNAUTHORIZED},status=status.HTTP_401_UNAUTHORIZED)
            
        serializer=self.serializer_class(room,many=False)
        data = serializer.data
        data['user_is_host']= request.session.session_key == room.host
        return Response(data, status=status.HTTP_202_ACCEPTED)

    def delete(self,request,roomCode):
        if request.session.get('JoinCode') == roomCode:
            del request.session['JoinCode']
        else:
            print('No Room Code............................... 69')
            return Response({'Status':'JoinCode Already Deleted'},status=status.HTTP_200_OK)
        return Response({request.session.get('JoinCode')}, status=status.HTTP_200_OK)

class CreateRoomView(APIView):

    serializer_class= CreateRoomSerializer
    def post(self,request):

        if not request.session.exists(request.session.session_key): # if user has not been previously logged in
            request.session.create()
            print('Created..............................................................')

        serializer = self.serializer_class(data=request.data) # creates a new instance

        if serializer.is_valid():
            print(serializer)
            guest_can_pause = serializer.data['guest_can_pause']
            votes_to_skip=serializer.data['votes_to_skip']
            host = request.session.session_key
            print(host, 'host')
            queryset=React_Room.objects.filter(host=host) # filter is good for if there may be multiple objects with same host, but this is not allowed in models at the moment
            if queryset.exists():
                room=queryset[0]
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip=votes_to_skip
                room.created_at = datetime.now()
                room.save(update_fields=['guest_can_pause','votes_to_skip'])
                request.session['JoinCode']=room.code
            else:
                room = React_Room(host=host,guest_can_pause = guest_can_pause, votes_to_skip = votes_to_skip)
                room.save()
                request.session['JoinCode']=room.code
        return Response(Room_Serializer(room).data, status=status.HTTP_201_CREATED)

class VideosView(APIView):
    serializer_class=VideoSerializer
    def get(self,request):
        videos=Videos.objects.all() #returns queryset. Call index 0 if only one object. No index call if > 1 object
        if len (videos) == 1:
            serialized=self.serializer_class(videos[0],many=False)
        elif len (videos) > 1:
            serialized=self.serializer_class(videos,many=True)
        else:
            return Response({'Error': 'Video Data does not exist'},status=status.HTTP_404_NOT_FOUND)

        return Response(serialized.data,status=status.HTTP_200_OK)

class GetVideoView(APIView):
    serializer_class=VideoSerializer
    def get(self,request,vid):
        video=Videos.objects.filter(id=vid) # returns queryset
        if(len(video)>0):
            video=video[0]
            serializer=self.serializer_class(video,many=False) #is_valid should only be used for post and put since it requires input data
            return Response(serializer.data, status=status.HTTP_200_OK)

        else:
            Response({'Error':'Video Not Found'},status=status.HTTP_404_NOT_FOUND)
    

@api_view(['GET','POST']) #SERIALIZE: Convert PYTHON OBJECTS TO JSON FORMAT FOR REST API READING
def getNotes(request):
    if request.method =='GET':
        notes = React_Note.objects.all()
        serialized=Note_Serializer(notes, many=True) #serialize multiple objects or single object? --> return query set which is object
        return Response(serialized.data)
    elif request.method =='POST':
        data = request.data
        note = React_Note.objects.create()
        serialized=Note_Serializer(note, data) #serialize multiple objects or single object? --> return query set which is object

        if serialized.is_valid():
            serialized.save() #update current note with JSON data provided; 
        return Response(serialized.data)

@api_view(['GET','PUT','DELETE']) #SERIALIZE: Convert PYTHON OBJECTS TO JSON FORMAT FOR REST API READING
def getNote(request,pk):
    if request.method == 'GET':
        notes = React_Note.objects.get(id=pk)
        serialized=Note_Serializer(notes, many=False)
        return Response(serialized.data)
    elif request.method =='PUT':
        data = request.data
        note = React_Note.objects.get(id=pk)
        serialized=Note_Serializer(instance=note, data = data)
        if serialized.is_valid():
            serialized.save() #update current note with JSON data provided
        return Response(serialized.data)
    elif request.method =='DELETE':
        note = React_Note.objects.get(id=pk)
        note.delete()
        return Response('Note was Deleted')








