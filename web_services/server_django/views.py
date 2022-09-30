from django.shortcuts import render
from apps_django.store.models import *
from .utils import cartData
from django.views.generic import View
import os
from Utils.py.file_manager import FileManager
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect, csrf_exempt
from rest_framework import status, permissions
from apps_django.store.models import *
FS = FileManager()

class HomeView(View):
    model = None
    permission_classes = (permissions.AllowAny,)

    @method_decorator(csrf_exempt,name="get")
    def get(self, request, *args, **kwargs):
        rooturl=str(self.request.build_absolute_uri('/'))
        url=str(self.request.build_absolute_uri())
        slug=url.replace(rooturl,'')


        js_files=FS.findFilesbyExt(file_type=".js",location="frontend_django/build/static")
        css_files=FS.findFilesbyExt(file_type=".css",location="frontend_django/build/static")
        for index, i in enumerate(js_files):
            print(i)
            js_files[index] = i.replace("frontend_django/build",'react')

        for index, i in enumerate(css_files):
            print(i)
            css_files[index] = i.replace("frontend_django/build",'react')

        if slug == '':
            html_template='home.html'

        elif slug == 'login/':
            html_template='login.html'

        elif slug == 'react/notes_app/':
            html_template='react_notes.html'
        
        print("\n\n",js_files,"\n\n",css_files)
        context={"main_js":js_files[0],"main_css":css_files[0]}
        
        return render(request,html_template,context)








