from django.http import HttpResponse
from django.shortcuts import render
from products.models import Products
from django.contrib.auth.models import User
from json import dumps

def homepage(request):
    user = request.user
    if user.is_authenticated:
        items =  user.products_set.all()
        data = []
        for item in items:
            s = 'item.id'+str(item.id)
            data.append([s,[item.id,item.amount]])    
        data = dumps(data)
        return render(request,'index.html',{'data':data})    
    else:
        return render(request,'index.html')