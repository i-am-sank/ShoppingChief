from django.shortcuts import render,redirect,reverse
from django.views.decorators.csrf import csrf_exempt
# Create your views here.

@csrf_exempt
def buy_products(request):
    products = []
    if request.method == "POST":
        items = request.POST
        i=0
        res = 'cart['+str(i)+'][title]'
        while(i<int(items['size'])):
            products.append(items[res])
            print(products)
            i+=1
            res = 'cart['+str(i)+'][title]'   
    return render(request,'products/buy_products.html',{'products':products})  

