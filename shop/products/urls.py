from django.urls import path
from . import views

app_name = 'products'

urlpatterns = [
    path('buy/',views.buy_products,name="buy"),
    #detail by id  path('<slug:slug>',views.product_details,name="details")
]
