from django.shortcuts import render,redirect,reverse
from django.views.decorators.csrf import csrf_exempt
from .models import Products
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from json import dumps
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
    else:
        user = request.user
        items =  user.products_set.all()
        data = []
        for item in items:
            s = 'item.id'+str(item.id)
            data.append([s,[item.id,item.price,item.amount]])    
        data = dumps(data)
        return render(request,'products/buy_products.html',{'data':data})
    return render(request,'products/buy_products.html')  
