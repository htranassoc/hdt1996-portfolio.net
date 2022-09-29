"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
#from django.conf.urls.static import static
#from django.conf import settings

app_name='backend'
urlpatterns = [
    path('admin/', admin.site.urls),
    path('store/',include('django_apps.store.urls')),
    path('',include('django_server.templates.urls')),
    path('api/',include('django_apps.users.urls')),
    path('spotify/',include('django_apps.spotify.urls'))
    ]

    #path('react/', TemplateView.as_view(template_name='index.html'),name='react_home'),
#urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
#urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
"""
urlpatterns += static(settings.REACT_URL, document_root=settings.REACT_ROOT)
urlpatterns += static(settings.REACTSTATIC_URL, document_root=settings.REACTSTATIC_ROOT)
 """


""" urlpatterns += static(settings.REACTSRC_URL, document_root=settings.REACTSRC_ROOT) """
'''
if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(
        settings.STATIC_URL, document_root=settings.STATIC_ROOT)
elif getattr(settings, 'FORCE_SERVE_STATIC', False):
    settings.DEBUG = True
    urlpatterns += static(
        settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(
        settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    settings.DEBUG = False
    print(getattr(settings, 'FORCE_SERVE_STATIC', False))
'''
