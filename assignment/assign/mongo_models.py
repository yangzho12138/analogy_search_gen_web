from mongoengine import Document, StringField, ListField, IntField, DateTimeField, EmbeddedDocument, EmbeddedDocumentField, BooleanField
import datetime

class User(Document):
    username = StringField(max_length=50, unique=True)
    collected_analogies = ListField(StringField(), default=list)

class Analogy(Document):
    target = StringField(max_length=100)
    prompt = StringField(max_length=1000)
    analogy = StringField()
    id = StringField(primary_key=True, max_length=100)
    temp = StringField(max_length=10)
    src = StringField(max_length=1000)
    model = StringField(max_length=20)
    generatorRole = StringField(max_length=10)

class Choice(EmbeddedDocument):
    text = StringField(required=True)
    is_correct = BooleanField(default=False)

class Question(Document):
    name = StringField(required=True)
    created_at = DateTimeField(default=datetime.datetime.now)
    created_by = StringField(required=True)
    type = IntField()
    title = StringField(required=True)
    note = StringField()
    choices = ListField(EmbeddedDocumentField(Choice), default=list)

class Questionnaire(Document):
    name = StringField()
    created_at = DateTimeField(default=datetime.datetime.now)
    created_by = StringField(required=True)
    questions = ListField(StringField(), default=list)