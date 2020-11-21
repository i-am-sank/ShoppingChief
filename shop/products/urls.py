from django.urls import path
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from . import views

app_name = 'products'

urlpatterns = [
    path('buy/',views.buy_products,name="buy"),
    #detail by id  path('<slug:slug>',views.product_details,name="details")
]
urlpatterns += staticfiles_urlpatterns()