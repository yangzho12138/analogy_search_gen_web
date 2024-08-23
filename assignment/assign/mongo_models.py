from mongoengine import Document, StringField, ListField, IntField

class User(Document):
    username = StringField(max_length=50, unique=True)
    collected_analogies = ListField(StringField(), default=list)
    generated_questions = ListField(StringField(), default=list)
    generated_questionnaires = ListField(StringField(), default=list)

class Analogy(Document):
    target = StringField(max_length=100)
    prompt = StringField(max_length=1000)
    analogy = StringField()
    id = StringField(max_length=10, primary_key=True)
    temp = StringField(max_length=10)
    src = StringField(max_length=100)
    model = StringField(max_length=20)
    generatorRole = StringField(max_length=10)

class Question(Document):
    title = StringField()
    choices = ListField(StringField(), default=list)

class Questionnaire(Document):
    questions = ListField(IntField(), default=list)