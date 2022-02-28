from django.db import models
from django.contrib.auth.models import User



class Customer(models.Model):
    user=models.OneToOneField(User, on_delete=models.CASCADE, null=True,blank=True)
    name=models.CharField(max_length=100, null=True)
    email=models.CharField(max_length=100, null=True)
    class Meta:
        app_label = 'store'
    def __str__(self):
        return str(self.user)


class Product(models.Model):
    name=models.CharField(max_length=200, null=True)
    price=models.DecimalField(decimal_places=2,max_digits=5)
    digital=models.BooleanField(default="False", null=True, blank=False) # can use upload_to argument to specify subdirectory in media
    image=models.ImageField(null=True, blank=True)

    class Meta:
        app_label = 'store'
    def __str__(self): #changes how displayed on admin site
        return self.name + ' ' + str(self.price)
    @property
    def imageURL(self):
        try:
            url=str(self.image.url)

        except:
            url='127.0.0.1:8000/static/images/imagenotfound.png'
        return url


class Order(models.Model):
    customer=models.ForeignKey(Customer, on_delete=models.SET_NULL, blank=True, null=True)
    date_ordered=models.DateTimeField(auto_now_add=True)
    complete=models.BooleanField(default=False, blank=False)
    transaction_id=models.CharField(max_length=200, null=True)
    total_amount= models.DecimalField(decimal_places=2,max_digits=5,default=0)
    class Meta:
        app_label = 'store'
    def __str__(self):
        return str(self.id)

    @property
    def shipping(self):
        shipping=False
        orderitems = self.orderitem_set.all()
        for i in orderitems:
            try:
                if i.product.digital == False:
                    shipping = True
            except:
                None
        return shipping

    @property
    def get_cart_total(self):
        orderitems=self.orderitem_set.all()
        total= sum([item.total_price() for item in orderitems])
        return total
    @property
    def get_cart_items(self):
        orderitems=self.orderitem_set.all()
        total=sum([item.quantity for item in orderitems])
        return total


class OrderItem(models.Model):
    product=models.ForeignKey(Product, on_delete=models.SET_NULL, blank=True, null=True)
    order=models.ForeignKey(Order, on_delete=models.SET_NULL, blank=True, null=True)
    quantity=models.IntegerField(default=0, null=True, blank=False)
    date_added=models.DateTimeField(auto_now_add=True)
    def total_price(self):
        try:
            total= (self.product.price * self.quantity)
        except:
            total=0
        return total

    class Meta:
        verbose_name = 'Order Item'
        verbose_name_plural = 'Order Items'
        app_label = 'store'


class ShippingAddress(models.Model):
    customer=models.ForeignKey(Customer, on_delete=models.SET_NULL, blank=True, null=True)
    order=models.ForeignKey(Order, on_delete=models.SET_NULL, blank=True, null=True)
    address=models.CharField(max_length=200, null=True)
    city=models.CharField(max_length=200, null=True)
    state=models.CharField(max_length=200, null=True)
    zipcode=models.CharField(max_length=200, null=True)

    date_added=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.address
    class Meta:
        verbose_name = 'Shipping Address'
        verbose_name_plural = 'Shipping Addresses'
        app_label = 'store'



class Profile(models.Model):
    user=models.OneToOneField(User, on_delete=models.CASCADE, null=True,blank=True)
    first_name = models.CharField(max_length=200, null=True, blank=True)
    last_name = models.CharField(max_length=200, null=True, blank=True)
    phone = models.CharField(max_length=200,null=True,blank=True)
    email=models.CharField(max_length=100, null=True)

    def __str__(self):
        return str(self.user)
    class Meta:
        app_label = 'store'

