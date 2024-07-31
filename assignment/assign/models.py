from django.db import models

# Create your models here.
class User(models.Model):
    email = models.EmailField(max_length=254, unique=True)
    collected_analogies = models.ArrayField(
        model_container=int,
    )
    generated_questions = models.ArrayField(
        model_container=int,
    )
    generated_questionnaires = models.ArrayField(
        model_container=int,
    )

class Analogy(models.Model):
    target = models.CharField(max_length=100)
    prompt = models.CharField(max_length=1000)
    analogy = models.TextField()
    id = models.CharField(max_length=100)
    temp = models.CharField(max_length=10)

class Question(models.Model):
    title = models.TextField()
    choices = models.ArrayField(
        model_container=str,
    )

class Questionnaire(models.Model):
    questions = models.ArrayField(
        model_container=int,
    )

