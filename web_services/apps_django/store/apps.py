from django.apps import AppConfig

class StoreConfig(AppConfig):
    name = 'django_apps.store'

    def ready(self):
        import django_apps.store.signals