from rest_framework.views import APIView
from rest_framework.response import Response
from .mongo_models import User, Analogy, Question, Questionnaire, Choice
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .authentication import CookieJWTAuthentication
import json
from mongoengine.errors import DoesNotExist, ValidationError
from mongoengine.queryset.visitor import Q
from mongoengine.connection import get_connection
from bson import ObjectId

# Create your views here.
class AnalogyView(APIView):
    authentication_classes = (CookieJWTAuthentication,)
    permission_classes = [IsAuthenticated]
    # get all collected analogies for a user
    def get(self, request):
        analogies_ids = User.objects.get(username=request.user.username).collected_analogies
        analogies = json.loads(Analogy.objects.filter(id__in=analogies_ids).to_json())
        for analogy in analogies:
            if '_id' in analogy:
                analogy['pid'] = analogy.pop('_id')

        return Response(
            status=status.HTTP_200_OK,
            data={
                'analogies': analogies
            }
        )
    # user collect an analogy
    def put(self, request):
        analogy_id = request.data.get("analogy_id", "").strip()
        user = User.objects.get(username=request.user.username)
        if analogy_id in user.collected_analogies:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={
                    'errors': ['Analogies already collected']
                }
            )
        user.collected_analogies.append(analogy_id)
        user.save()
        return Response(
            status=status.HTTP_200_OK,
            data={
                'message': 'Analogies collected successfully'
            }
        )
    # user remove an collected analogy
    def delete(self, request):
        analogy_id = request.data.get("analogy_id", "").strip()
        user = User.objects.get(username=request.user.username)
        try:
            user.collected_analogies.remove(analogy_id)
        except ValueError:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={
                    'errors': ['Analogy is not in your collection']
                }
            )
        user.save()
        return Response(
            status=status.HTTP_200_OK,
            data={
                'message': 'Analogies updated successfully'
            }
        )

class QuestionView(APIView):
    authentication_classes = (CookieJWTAuthentication,)
    permission_classes = [IsAuthenticated]
    # get all/a question(s) for a user
    def get(self, request, id=None):
        username=request.user.username
       
        if id:
            question = json.loads(Question.objects.get(id=id).to_json())
            question['id'] = str((question['_id']['$oid']))
            return Response(
                status=status.HTTP_200_OK,
                data={
                    'question': question
                }
            )
        questions = json.loads(Question.objects.filter(created_by=username).to_json())
        return Response(
            status=status.HTTP_200_OK,
            data={
                'questions': [{
                    'id': str(question['_id']['$oid']),
                    'name': question['name']
                } for question in questions]
            }
        )
    # user update a question
    def post(self, request):
        try:
            question_id = request.data.get("id", "").strip()
            question = Question.objects.get(id=question_id)

            question.name = request.data.get("name", "")
            question.title = request.data.get("title", "")
            
            choices_data = request.data.get("choices", [])
            question.choices = [Choice(**choice) for choice in choices_data]

            question.type = request.data.get("type", 0)
            question.note = request.data.get("note", "")
            question.save()

            return Response(
                status=status.HTTP_200_OK,
                data={
                    'message': 'Questions updated successfully',
                    'question': {
                        'id': str(question.id),
                        'name': question.name,
                    }
                }
            )

        except DoesNotExist:
            return Response(
                status=status.HTTP_404_NOT_FOUND,
                data={'errors': ['Question not found']}
            )
        except ValidationError as e:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={'errors': [str(e)]}
            )
    # user generate a question
    def put(self, request):
        question = Question.objects.create(
            name=request.data.get("name", ""),
            title=request.data.get("title", ""),
            choices=request.data.get("choices", []),
            type=request.data.get("type", 0),
            note=request.data.get("note", ""),
            created_by=request.user.username
        )
        return Response(
            status=status.HTTP_200_OK,
            data={
                'message': 'Questions created successfully',
                'question': {
                    'id': str(question.id),
                    'name': question.name,
                }
            }
        )
    # user remove an generated question
    def delete(self, request):
        question_id = request.data.get("id", "").strip()
        print("id", question_id)
        # only pymongo supports transactions
        question_obj_id = ObjectId(question_id)

        connection = get_connection()

        try:
            with connection.start_session() as session:
                with session.start_transaction():
                    question_collection = Question._get_collection()
                    result = question_collection.delete_one({"_id": question_obj_id}, session=session)
                    if result.deleted_count == 0:
                        raise Question.DoesNotExist
                    
                    questionnaire_collection = Questionnaire._get_collection()
                    questionnaire_collection.update_many(
                        {"questions": question_id},
                        {"$pull": {"questions": question_id}},
                        session=session
                    )

            return Response(
                status=status.HTTP_200_OK,
                data={
                    'message': 'Question and related entries in Questionnaires have been successfully deleted.',
                    "id": question_id
                }
            )
        
        except Question.DoesNotExist:
            return Response(
                status=status.HTTP_404_NOT_FOUND,
                data={'errors': ['Question not found']}
            )

class QuestionnaireView(APIView):
    authentication_classes = (CookieJWTAuthentication,)
    permission_classes = [IsAuthenticated]
    # get a/all generated questionnaire(s)
    def get(self, request, id=None):
        username=request.user.username

        if id:
            questionnaire = json.loads(Questionnaire.objects.get(id=id).to_json())
            questions = json.loads(Question.objects.filter(id__in=questionnaire['questions']).to_json())
            return Response(
                status=status.HTTP_200_OK,
                data={
                    'questionnaire': {
                        'id': str(questionnaire['_id']['$oid']),
                        'name': questionnaire['name'],
                        'questions': [{
                            'id': str(question['_id']['$oid']),
                            'name': question['name']
                        } for question in questions]
                    }
                }
            )
        questionnaires = json.loads(Questionnaire.objects.filter(created_by=username).to_json())
        return Response(
            status=status.HTTP_200_OK,
            data={
                'questionnaires': [{
                    'id': str(questionnaire['_id']['$oid']),
                    'name': questionnaire['name']
                } for questionnaire in questionnaires]
            }
        )
    # user update a questionnaire
    def post(self, request):
        try:
            questionnaire_id = request.data.get("id", "").strip()
            questionnaire = Questionnaire.objects.get(id=questionnaire_id)

            questionnaire.name = request.data.get("name", "")
            questionnaire.questions = request.data.get("questions", questionnaire.questions)
            questionnaire.save()

            return Response(
                status=status.HTTP_200_OK,
                data={
                    'message': 'Questionnaires updated successfully',
                    'questionnaire': {
                        'id': str(questionnaire.id),
                        'name': questionnaire.name,
                    }
                }
            )

        except DoesNotExist:
            return Response(
                status=status.HTTP_404_NOT_FOUND,
                data={'errors': ['Questionnaire not found']}
            )
        except ValidationError as e:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={'errors': [str(e)]}
            )
    # user generate a questionnaire
    def put(self, request):
        questionnaire = Questionnaire.objects.create(
            name=request.data.get("name", ""),
            questions=request.data.get("questions", []),
            created_by=request.user.username
        )
        return Response(
            status=status.HTTP_200_OK,
            data={
                'message': 'Questionnaires updated successfully',
                'questionnaire': {
                    'id': str(questionnaire.id),
                    'name': questionnaire.name,
                }
            }
        )
    # user delete an generated questionnaire
    def delete (self, request):
        questionnaire_id = request.data.get("id", "").strip()
        Questionnaire.objects.get(id=questionnaire_id).delete()
        return Response(
            status=status.HTTP_200_OK,
            data={
                'message': 'Questionnaires updated successfully',
                'id': questionnaire_id
            }
        )