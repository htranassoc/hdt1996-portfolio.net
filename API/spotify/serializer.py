#to turn python object into JSON format
from rest_framework.serializers import ModelSerializer
import rest_framework.serializers as serializers
from .models import *

class HostSongData_Serializer(ModelSerializer):
    code=serializers.CharField(validators=[])
    class Meta:
        model = HostSongData
        fields = ('title','artist','code','duration','time','image_url','is_playing','votes') #means serialize all attributes, if want specific, use keyword and in list
