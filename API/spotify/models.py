from django.db import models

class SpotifyToken(models.Model):
    user = models.CharField(max_length=200,unique=True)
    created_at=models.DateTimeField(auto_now_add=True)
    refresh_token=models.CharField(max_length=500)
    access_token=models.CharField(max_length=500)
    expiration=models.DateTimeField()
    token_type=models.CharField(max_length=100)

class HostSongData(models.Model):
    code = models.CharField(max_length=100,null=True)
    host = models.CharField(max_length=200,null=True)
    title=models.CharField(max_length=50)
    artist=models.CharField(max_length=50)
    duration=models.DecimalField(max_digits=500,null=True,decimal_places=2)
    time = models.DecimalField(max_digits=500,null=True,decimal_places=2)
    image_url=models.CharField(max_length=500,null=True)
    is_playing=models.BooleanField(null=False,default=False)
    votes=models.IntegerField(null=False,default=0)
    submission_time=models.DateTimeField(auto_now_add=True)
