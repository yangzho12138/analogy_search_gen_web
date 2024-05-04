from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class CustomUser(AbstractUser):
    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(max_length=254, unique=True)
    password = models.CharField(max_length=100)
    free_openai_api_key = models.IntegerField(default=50)
    notification = models.BooleanField(default=False)
    
    def __str__(self):
        return self.email
    
    class Meta:
        db_table = 'auth_customer'