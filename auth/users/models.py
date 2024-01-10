from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class CustomUser(AbstractUser):
    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(max_length=254, unique=True)
    password = models.CharField(max_length=100)

    def __str__(self):
        return self.email

# class Logs(models.Model):
#     user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
#     # search/generate
#     type = models.CharField(max_length=50)

#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return self.log
