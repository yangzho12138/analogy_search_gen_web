from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class CustomUser(AbstractUser):
    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(max_length=254, unique=True)
    password = models.CharField(max_length=100)
    free_openai_api_key = models.IntegerField(default=50)
    notification = models.BooleanField(default=False)
    ADMIN = 'ADMIN'
    STUDENT = 'STUDENT'
    TEACHER = 'TEACHER'
    EXPERT = 'EXPERT'
    ROLE_CHOICES = [
        (ADMIN, 'ADMIN'),
        (STUDENT, 'STUDENT'),
        (TEACHER, 'TEACHER'),
        (EXPERT, 'EXPERT'),
    ]
    role=models.CharField(max_length=100, choices=ROLE_CHOICES, default=STUDENT)
    points = models.IntegerField(default=0)

    def __str__(self):
        return self.email
    class Meta:
        db_table = 'auth_customer'

class GenLog(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    prompt = models.CharField(max_length=1000)
    target = models.CharField(max_length=100)
    src = models.CharField(max_length=100)
    temp = models.FloatField()
    freq_penalty = models.FloatField()
    pres_penalty = models.FloatField()
    max_length = models.IntegerField()
    top_p = models.FloatField()
    best_of = models.IntegerField()
    analogy = models.CharField(max_length=1000)

    def __str__(self):
        return self.analogy

class SearchLog(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True)
    ip = models.CharField(max_length=100, default=None)
    created_at = models.DateTimeField(auto_now_add=True)
    query = models.CharField(max_length=1000)
    # remove stop words - words used to do search in ES
    # analogies = models.CharField(max_length=1000)
    prompt = models.CharField(max_length=1000)
    temp = models.CharField(max_length=10)

    def __str__(self):
        return self.query

class Issue(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    issue = models.CharField(max_length=100)
    detail = models.CharField(max_length=1000)
    target = models.CharField(max_length=100)
    prompt = models.CharField(max_length=100)
    analogy = models.CharField(max_length=10000)
    pid = models.CharField(max_length=100)
    solved = models.BooleanField(default=False)
    admin_comment = models.CharField(max_length=1000, blank=True)

    def __str__(self):
        return self.target

class Comment(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    comment = models.CharField(max_length=1000)
    admin_selected = models.BooleanField(default=True)
    admin_comment = models.CharField(max_length=1000, blank=True)
    target = models.CharField(max_length=100)
    prompt = models.CharField(max_length=100)
    analogy = models.CharField(max_length=10000)
    pid = models.CharField(max_length=100)
    replyTo = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')
    
    def __str__(self):
        return self.comment
