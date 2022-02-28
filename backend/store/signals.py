from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Customer, Profile




@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):    
    args=vars(Customer())
    kwargz={}
    for arg in args:
        kwargz.update({f"{arg}":None})

    customer= Customer.objects.get_or_create(email='hi@gmail.com',name=f'test',user_id=instance.id)
    print(vars(User))
    print(instance.__dict__)

 
 


def create_kwargs(model):
    args=vars(model)
    kwargs=[]
    for arg in args:
        kwargs.append(f'{arg}={args.get(arg,None)}')