from django.shortcuts import render
from apps_django.store.models import *
import json


def cookiecart(request):
    try:
        cart=json.loads(request.COOKIES['cart'])
    except:
        cart={}

    order={'get_cart_total':0,'get_cart_items':0, 'shipping':False}

    items=[]
    cartItems=order['get_cart_items']
    newdict={}
    listi=[]
    lista=[]
    toremove=[]
    z=0

    for i in cart:
        
        try:
            listi.append(i)
            lista.append(z)

            cartItems += cart[i]['quantity']
            product=Product.objects.get(id=i)
            total = product.price * cart[i]['quantity']

            order['get_cart_total'] += total
            order['get_cart_items'] += cart[i]["quantity"]
            item=\
                {
                'product':{
                    'id':product.id,
                    'name':product.name,
                    'price':product.price,
                    'imageURL':product.imageURL,
                    },
                'quantity':cart[i]['quantity'],
                'total_price':total
                }
            items.append(item)

            if product.digital == False:
                order['shipping']=True

        except:
            listi.append(i)
            lista.append(z)
            product={}
            cartItems += 0

            item=\
                {
                'product':\
                    {
                    'id':'00',
                    'name':'Out of Stock',
                    'productindex':z,
                    'price':0,
                    'imageURL':'http://127.0.0.1:8000/MEDIA/outofstock.png',
                    },

                'quantity':0,
                'total_price':0,

                }
            items.append(item)
            newdict=dict((cart))
            toremove+=str(i)
        z=z+1

    if toremove==[]:
        newdict=cart
    else:
        for r in toremove:
            newdict.pop(r)

    return {'cartItems':cartItems, 'items':items, 'order':order,'cart':cart,'newdict':newdict}

def cartData(request):

    if request.user.is_authenticated:
        try:
            customer=request.user.customer
            print(customer)
        except:
            print('No Customer Object for User. Please create to move to views page.')
        order, created = Order.objects.get_or_create(customer=customer, complete=False)
        items=order.orderitem_set.all()
        newcookie=cookieupdater(items)

        cartItems=order.get_cart_items
        
        cookieData=cookiecart(request)
        cartItemsCk=cookieData['cartItems']
        itemsCk=cookieData['items']
        cart=cookieData['cart']
        newdict=cookieData['newdict']

        setcart=set(cart)
        setnewdict=set(newdict)
        newvsold=setcart.symmetric_difference(setnewdict)

        return {'cartItems':cartItems, 'items':items, 'order':order,'cartItemsCk':cartItemsCk,'itemsCk':itemsCk,'newcookie':newcookie,'newvsold':newvsold}
        
    else:
        cookieData=cookiecart(request)
        items=cookieData['items']
        order=cookieData['order']
        cartItems=cookieData['cartItems']
        itemsCk=cookieData['items']
        cartItemsCk=cartItems
        cart=cookieData['cart']
        newdict=cookieData['newdict']
        setcart=set(cart)
        if newdict =={}:
            setnewdict={}
        else:
            setnewdict=set(newdict)
        newvsold=setcart.symmetric_difference(setnewdict)

        if newvsold==set():
            newvsold=[]
        
        try:
            newvsold=list(map(int, newvsold))
        except:
            newvsold=list((newvsold))

        return {'cartItems':cartItems, 'items':items, 'order':order,'cartItemsCk':cartItemsCk,'itemsCk':itemsCk,'newvsold':newvsold,'cart':cart,'newdict':newdict}


def guestOrder(request,transaction_id,data):

    if request.user.is_authenticated:
        customer = request.user.customer
        order, created = Order.objects.get_or_create(customer=customer, complete=False)

    else:

        name=data['form']['name']
        email=data['form']['email']
        cookieData=cookiecart(request)
        items=cookieData['items']
        customer, created = Customer.objects.get_or_create\
            (
                email=email,
            )
            #for accessing customer object (recorded in database) by searching for information used such as email input through guest checkout.
            #email used above instead of only name because emails are unique and cannot be replicated. name can be used also but may change more frequently
        customer.name=name
        customer.save()

        order=Order.objects.create\
        (
            customer=customer,
            complete=False
        )

        for item in items:
            if(item['product']['id'] != '00'):
                product=Product.objects.get(id=item['product']['id'])
                # to attach items to database in guest transaction
                orderItem = OrderItem.objects.create\
                    (
                        product=product,
                        order=order,
                        quantity=item['quantity']
                    )


    return {'order':order,'customer':customer}


def cookieupdater(items):
    updatecookie={}
    pid={}
    qdict={}
    for item in items:
        itemkv=((item.__dict__))

        qdict={"quantity":itemkv['quantity']}

        pid={f"{itemkv['product_id']}":qdict}

        updatecookie.update(pid)
    
    return updatecookie

def strdifference(*args):
    params=[]
    for arg in args:
        params.append(set(arg))
    print(params)
"""     i=0
    differences=[]
    for i in range(len(params)):
        x=i+1
        differences.append(params[i].symmetric_difference(params[x]))
        if x==len(params):
            return differences """
