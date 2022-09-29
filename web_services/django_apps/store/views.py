from django.shortcuts import render
from .models import *
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import JsonResponse
from django_server.utils import cartData,guestOrder
from decimal import Decimal
from django.views import View
import json
import datetime

def updateitem(request):
    data = json.loads(request.body)
    customer=request.user.customer
    action=data['action']

    if action =='clear':
        order, created = Order.objects.get_or_create(customer=customer, complete=False)
        items=order.orderitem_set.all()
        items.delete()

    else:
        productId=data['productId']
        product=Product.objects.get(id=productId)
        order, created = Order.objects.get_or_create(customer=customer, complete=False)
        orderItem, created = OrderItem.objects.get_or_create(order=order, product=product)

        if action == 'add':
            orderItem.quantity=orderItem.quantity + 1
        elif action == 'remove':
            orderItem.quantity=orderItem.quantity - 1
        orderItem.save()
        if orderItem.quantity <=0:
            orderItem.delete()

    return JsonResponse('Item was updated', safe=False)



def processOrder(request):
    transaction_id=datetime.datetime.now().timestamp()
    data=json.loads(request.body)
    checkout=guestOrder(request,transaction_id,data)
    #print(checkout)
    customer=checkout['customer']
    order=checkout['order']
    total=Decimal(data['form']['total'])
    order.transaction_id = transaction_id
    if total == order.get_cart_total:
        order.complete = True
        order.total_amount = total
    else:
        print('Website Cart Total and Python Total do not match.')
    order.save()
    if order.shipping == True:
        ShippingAddress.objects.create\
            (
            customer=customer,
            order=order,
            address=data['shipping']['address'],
            city=data['shipping']['city'],
            state=data['shipping']['state'],
            zipcode=data['shipping']['zipcode']
            )
    return JsonResponse('Payment Complete', safe=False)


class StoreView(View):
    def get(self,request):
        rooturl=str(request.build_absolute_uri('/'))
        url=str(request.build_absolute_uri())
        slug=url.replace(rooturl,'')
        data=cartData(request)
        cartItems=data['cartItems']
        cartItemsCk=data['cartItemsCk']
        order=data['order']
        items=data['items']
        itemsCk=data['itemsCk']

        context={'items':items,'order':order,'cartItems':cartItems,'cartItemsCk':cartItemsCk,'itemsCk':itemsCk}

        if slug == 'store/':
            products=Product.objects.all()
            context.update({'products':products})
            html_template='store.html'
        elif slug == 'store/cart/':
            newvsold=data['newvsold']
            context.update({'newvsold':newvsold})
            html_template='cart.html'
        elif slug == 'store/checkout/':
            html_template='checkout.html'
        if request.user.is_authenticated:
            newcookie=data['newcookie']
            context.update({'newcookie':newcookie})

        return render(request, html_template , context)



