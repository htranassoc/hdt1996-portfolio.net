from django.apps import AppConfig

class StoreConfig(AppConfig):
    name = 'stockserver.store'

    def ready(self):
        import stockserver.store.signals