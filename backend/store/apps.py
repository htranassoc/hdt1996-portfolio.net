from django.apps import AppConfig

class StoreConfig(AppConfig):
    name = 'backend.store'

    def ready(self):
        import backend.store.signals