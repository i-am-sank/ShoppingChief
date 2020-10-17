from django.shortcuts import render,redirect,reverse
from django.views.decorators.csrf import csrf_exempt
from .models import Products
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
# Create your views here.

@csrf_exempt
@login_required(login_url="/accounts/login/")
def buy_products(request):
    if request.method == "POST":
        items = request.POST
        i=0
        user = request.user
        user.products_set.clear()
        pid = 'cart['+str(i)+'][id]'
        pamount = 'cart['+str(i)+'][amount]'
        while(i<int(items['size'])):
            p = Products.objects.get(pk=items[pid])
            p.amount = int(items[pamount])
            p.customer = user
            p.save()
            i+=1
            pid = 'cart['+str(i)+'][id]'
            pamount = 'cart['+str(i)+'][amount]'  
    return render(request,'products/buy_products.html')  

