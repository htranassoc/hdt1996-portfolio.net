from unicodedata import decimal
from django.db import models
from django.contrib.auth.models import User
from rest_framework import generics
import string, random

def generate_unique_code():
    length=6
    while True:
        code = ''.join(random.choices(string.ascii_uppercase,k=length))
        if React_Room.objects.filter(code=code).count() == 0:
            break
    return code


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
        app_label = 'dj_frontend'

class React_Room(models.Model):
    code = models.CharField(max_length=8,default=generate_unique_code,unique=True)
    host = models.CharField(max_length=50,unique=True,null=False)
    guest_can_pause=models.BooleanField(null=False,default=False)
    votes_to_skip=models.IntegerField(null=False,default=1)
    created_at=models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'React Room'
        verbose_name_plural = 'React Room'
        app_label = 'dj_frontend'

class Videos(models.Model):
    media=models.FileField(upload_to='videos/',null=True,verbose_name="")

    class Meta:
        verbose_name = 'Video'
        verbose_name_plural = 'Videos'