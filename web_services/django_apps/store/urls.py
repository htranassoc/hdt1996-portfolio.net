from django.urls import path
from . import views

urlpatterns=\
[
path('',views.StoreView.as_view(), name="store"),
path('cart/', views.StoreView.as_view(), name="cart"),
path('checkout/', views.StoreView.as_view(), name="checkout"),
path('update_item/', views.updateitem, name="update_item"),
path('process_order/', views.processOrder, name="process_order"),
path('test/', views.StoreView.as_view(), name="test"),
]