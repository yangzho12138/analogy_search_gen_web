from django.db import models

# Create your models here.
class Space(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    creator = models.ForeignKey('auth.User', related_name='spaces', on_delete=models.CASCADE)
    code = models.CharField(max_length=10) # 6 digit code for joining space

    def __str__(self):
        return self.name

class Assignment(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    due_date = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    space = models.ForeignKey(Space, related_name='assignments', on_delete=models.CASCADE)

    def __str__(self):
        return self.name