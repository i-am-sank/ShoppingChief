from django.db import models
from django.contrib.auth.models import User
# Create your models here.

# class Customer(models.Model):
#     first_name = models.CharField(max_length=30)
#     last_name = models.CharField(max_length=30)
#     email = models.EmailField()

#     def __str__(self):
#         return "%s %s" % (self.first_name, self.last_name)


class ItemsToBuy(models.Model):
    customer = models.ForeignKey(User,on_delete=models.CASCADE)
    title = models.CharField(max_length=20)
    amount = models.IntegerField(default=1)
    price = models.FloatField(default=0)
    image = models.ImageField()
    
    def __str__(self):
        return item_title


