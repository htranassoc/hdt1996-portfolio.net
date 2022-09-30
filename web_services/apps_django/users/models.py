from django.db import models
from django.contrib.auth.models import User
from django.forms import BooleanField
from django.utils import timezone
from datetime import datetime
import string, random

import os
def user_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
    return f'media/user_data/{instance.user.id}_{instance.user.username}/{filename}'

def generate_unique_code():
    length=6
    while True:
        code = ''.join(random.choices(string.ascii_uppercase,k=length))
        if React_Room.objects.filter(code=code).count() == 0:
            break
    return code


class React_User_Data(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE)
    first = models.CharField(max_length=50,null=True,blank=True)
    middle = models.CharField(max_length=50,null=True,blank=True)
    last = models.CharField(max_length=50,null=True,blank=True)
    email = models.CharField(max_length = 150,blank=True,null=True)
    age = models.IntegerField(null=True,blank=True)
    country = models.CharField(max_length = 50,blank=True,null=True)
    state = models.CharField(max_length = 50,blank=True,null=True)
    city = models.CharField(max_length = 50,blank=True,null=True)
    zipcode = models.IntegerField(null=True,blank=True)
    occupation = models.CharField(max_length = 150,blank=True,null=True)

    status = models.BooleanField(default=True)
    description = models.CharField(max_length=200,blank=True,null=True)
    security = models.BooleanField(default=False)
    sec_q1 = models.CharField(max_length=200,blank=True,null=True)
    sec_a1 = models.CharField(max_length=200,blank=True,null=True)
    sec_q2 = models.CharField(max_length=200,blank=True,null=True)
    sec_a2 = models.CharField(max_length=200,blank=True,null=True)
    logged_in = models.BooleanField(default=False)
    profile_pic = models.ImageField(null=True, blank=True, upload_to=user_directory_path)

    def __str__(self):
        return str(self.user.username)

    def profile_pic_URL(self):
        try:
            url=str(self.profile_pic.url)
        except:
            url=None
        return url

    class Meta:
        verbose_name = 'React User'
        verbose_name_plural = 'React Users'
        app_label = 'users'

class React_Note(models.Model):
    title = models.TextField(null = True, blank = True)
    body = models.TextField(null=True, blank=True)
    updated = models.DateTimeField(auto_now=True) #auto now means everytime saved, will get timestamp of when saved
    created = models.DateTimeField(auto_now_add=True) # auto now means everytime model created, will get timestamp of when created
    def __str__(self):
        return str(self.title)
    class Meta:
        verbose_name = 'React Note'
        verbose_name_plural = 'React Notes'
        app_label = 'users'

class React_Room(models.Model):
    code = models.CharField(max_length=50,default=generate_unique_code,unique=True)
    host = models.CharField(max_length=200,unique=True,null=False)
    user = models.ForeignKey(React_User_Data,on_delete=models.CASCADE,blank=True,null=True)
    guest_can_pause=models.BooleanField(null=False,default=False)
    category = models.CharField(max_length=100,default="General")
    title = models.CharField(max_length=250,null=True, blank=False)
    votes_to_skip=models.IntegerField(null=False,default=1)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at =models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'React Room'
        verbose_name_plural = 'React Rooms'
        app_label = 'users'
    def convert_created_time(self):
        return self.created_at.strftime("%m/%d/%Y %I:%M:%S %p") #UTC timezone

    def convert_updated_time(self):
        return self.updated_at.strftime("%m/%d/%Y %I:%M:%S %p") #UTC timezone


class React_Room_History(models.Model):
    room = models.ForeignKey(React_Room,on_delete=models.CASCADE,blank=True,null=True)
    messages = models.JSONField()
    class Meta:
        verbose_name = 'React Room History'
        verbose_name_plural = 'React Room History'
        app_label = 'users'

class Videos(models.Model):
    media=models.FileField(upload_to='videos/',null=True,verbose_name="")
    class Meta:
        verbose_name = 'Video'
        verbose_name_plural = 'Videos'