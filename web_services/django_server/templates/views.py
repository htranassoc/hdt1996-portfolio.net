from django.shortcuts import render
from django_apps.store.models import *
from django_server.utils import cartData
from django.views import View
import os
""" def home(request):

    data=cartData(request)
    cartItems=data['cartItems']
    cartItemsCk=data['cartItemsCk']
    order=data['order']
    items=data['items']
    itemsCk=data['itemsCk']
    print('pass')
    try:
        newcookie=data['newcookie']
    except:
        None
    products=Product.objects.all()
    try:
        context={'products':products, 'items':items, 'order':order,'cartItems':cartItems,'cartItemsCk':cartItemsCk,'itemsCk':itemsCk,'newcookie':newcookie}
    except:
        context={'products':products, 'items':items, 'order':order,'cartItems':cartItems,'cartItemsCk':cartItemsCk}
    return render(request, 'home.html' , context)

def login(request):

    data=cartData(request)
    cartItems=data['cartItems']
    cartItemsCk=data['cartItemsCk']
    order=data['order']
    items=data['items']
    itemsCk=data['itemsCk']
    print('pass')
    try:
        newcookie=data['newcookie']
    except:
        None
    products=Product.objects.all()
    try:
        context={'products':products, 'items':items, 'order':order,'cartItems':cartItems,'cartItemsCk':cartItemsCk,'itemsCk':itemsCk,'newcookie':newcookie}
    except:
        context={'products':products, 'items':items, 'order':order,'cartItems':cartItems,'cartItemsCk':cartItemsCk}
    return render(request, 'login.html' , context) """



class HomeView(View):
    def get(self,request):
        rooturl=str(request.build_absolute_uri('/'))
        url=str(request.build_absolute_uri())
        slug=url.replace(rooturl,'')

        context={}
        react_src = {}
        for f in os.walk(".././frontend/build/static"):
            fpath = f.path
            print(fpath)
        
        

        if slug == '':
            html_template='home.html'

        elif slug == 'login/':
            html_template='login.html'

        elif slug == 'react/notes_app/':
            html_template='react_notes.html'

        return render(request, html_template , context)








