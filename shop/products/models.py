from django.db import models
from django.contrib.auth.models import User
# Create your models here.

# class Customer(models.Model):
#     first_name = models.CharField(max_length=30)
#     last_name = models.CharField(max_length=30)
#     email = models.EmailField()

#     def __str__(self):
#         return "%s %s" % (self.first_name, self.last_name)


class Products(models.Model):
    title = models.CharField(max_length=30)
    amount = models.IntegerField(default=1,null=True)
    price = models.FloatField(default=0)
    image = models.ImageField(default='/static/images/furniture.jpeg/',blank=True)
    customer = models.ForeignKey(User,default=None,on_delete=models.CASCADE,null=True)

    def __str__(self):
        return self.title


