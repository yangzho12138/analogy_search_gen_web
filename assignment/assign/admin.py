from django.contrib import admin
from .models import User, Analogy, Question, Questionnaire

# Register your models here.
admin.site.register(User)
admin.site.register(Analogy)
admin.site.register(Question)
admin.site.register(Questionnaire)