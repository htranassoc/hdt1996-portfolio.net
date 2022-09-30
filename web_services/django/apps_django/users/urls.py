from django.urls import path, include
from . import views
from django.views.generic import TemplateView

# BACKEND CRUD

app_name='api_react'
urlpatterns=[
path('react/notes/', views.getNotes,name="notes"),
path('react/notes/<str:pk>/', views.getNote,name="note"),
path('react/rooms/',views.AllRoomView.as_view(),name="rooms"),  #Shows all rooms
path('react/rooms/create/',views.CreateRoomView.as_view(),name="rooms_create"),
path('react/rooms/join/',views.JoinRoomView.as_view(),name="rooms_create"),
path('react/rooms/user_sessions/',views.UserSessionView.as_view(),name="rooms_user_sessions"),
path('react/rooms/update/',views.UpdateView.as_view(),name="rooms_update"),
path('react/rooms/<str:roomCode>/',views.GetRoomView.as_view(),name="rooms_get"),
path('react/Videos/',views.VideosView.as_view()),
path('react/Videos/<str:vid>/',views.GetVideoView.as_view()),
path('login/',views.LoginView.as_view()),
path('signup/',views.SignUpView.as_view()),
path('csrf_token/',views.GetCSRFToken.as_view()),
path('authenticated/',views.CheckAuth.as_view()),
path('getUserData/',views.GetUserData.as_view()),
path('api-auth/',include('rest_framework.urls')),
]

#Manual URL Mapping
#path('react/notes/create', views.createNote,name="createNote"),
#path('react/notes/<str:pk>/update/', views.updateNote,name="updateNote"),
#path('react/notes/<str:pk>/delete/', views.deleteNote,name="deleteNote"),
#path('react/function_based_rooms/',views.React_Room_Get,name="function_based_rooms"),