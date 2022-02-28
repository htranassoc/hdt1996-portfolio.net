
from django.urls import path
from .views import *

app_name='spotify'
urlpatterns=[
    path('get_auth_url/',GetAuthURL.as_view()),
    path('redirect/',Redirect_Callback.as_view()),
    path('is_authenticated/',IsAuthenticated.as_view()),
    path('current_song/',CurrentSong.as_view()),
    path('pause/',PauseSong.as_view()),
    path('play/',PlaySong.as_view()),
    path('skip/',SkipSong.as_view()),
    path('postHostData/',HostDataUpdate.as_view()),
    path('getHostData/',GetHostData.as_view())]