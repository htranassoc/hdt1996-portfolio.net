#to turn python object into JSON format
from rest_framework.serializers import ModelSerializer
import rest_framework.serializers as serializers
from rest_framework import serializers
from .models import *

class Note_Serializer(ModelSerializer):
    class Meta:
        model = React_Note
        fields = '__all__' #means serialize all attributes, if want specific, use keyword and in list

class Room_Serializer(ModelSerializer):
    class Meta:
        model = React_Room
        fields = '__all__' #means serialize all attributes, if want specific, use keyword and in list

class CreateRoomSerializer(ModelSerializer):
    class Meta:
        model = React_Room
        fields = ('title','category','guest_can_pause','votes_to_skip')

class UpdateRoomSerializer(ModelSerializer):
    code = serializers.CharField(validators=[])
    class Meta:
        model = React_Room
        fields = '__all__'


class UpdateRoomHistorySerializer(ModelSerializer):
    class Meta:
        model = React_Room_History
        fields = '__all__'

class UserDataSerializer(ModelSerializer):
    class Meta:
        model = React_User_Data
        exclude= ('user',)

class VideoSerializer(ModelSerializer):
    class Meta:
        model = Videos
        fields='__all__'