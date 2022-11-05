from django.apps import AppConfig

class StoreConfig(AppConfig):
    name = 'apps_django.store'

    def ready(self):
        import apps_django.store.signals