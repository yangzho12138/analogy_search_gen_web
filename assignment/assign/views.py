from rest_framework.views import APIView
from rest_framework.response import Response
from .mongo_models import User, Analogy, Question, Questionnaire
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .authentication import CookieJWTAuthentication
import json

# Create your views here.
class AnalogyView(APIView):
    authentication_classes = (CookieJWTAuthentication,)
    permission_classes = [IsAuthenticated]
    # get all collected analogies for a user
    def get(self, request):
        analogies_ids = User.objects.get(username=request.user.username).collected_analogies
        analogies = Analogy.objects.filter(id__in=analogies_ids)
        
        analogies_json = analogies.to_json()  
        analogies_list = json.loads(analogies_json)

        return Response(
            status=status.HTTP_200_OK,
            data={
                'analogies': analogies_list
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
    # get all generated questions for a user
    def get(self, request):
        email = request.data.get("email", "").strip()
        if not User.objects.filter(email=email).exists():
            return Response(
                status=status.HTTP_404_NOT_FOUND,
                data={
                    'message': 'User not found'
                }
            )
        questions_ids = User.objects.get(email=email).generated_questions
        questions = Question.objects.filter(id__in=questions_ids)
        return Response(
            status=status.HTTP_200_OK,
            data={
                'questions': questions
            }
        )
    # user generate a question
    def put(self, request):
        
        question = Question.objects.create(
            title=request.data.get("title", ""),
            choices=request.data.get("choices", [])
        )
        user = User.objects.get(email=email)
        user.generated_questions.append(question.id)
        user.save()
        return Response(
            status=status.HTTP_200_OK,
            data={
                'message': 'Questions updated successfully'
            }
        )
    # user remove an generated question
    def delete(self, request):
        email = request.data.get("email", "").strip()
        if not User.objects.filter(email=email).exists():
            return Response(
                status=status.HTTP_404_NOT_FOUND,
                data={
                    'message': 'User not found'
                }
            )
        question_id = request.data.get("question_id", "").strip()
        user = User.objects.get(email=email)
        user.generated_questions.remove(question_id)
        user.save()
        Question.objects.get(id=question_id).delete()
        return Response(
            status=status.HTTP_200_OK,
            data={
                'message': 'Questions updated successfully'
            }
        )

class QuestionnaireView(APIView):
    authentication_classes = (CookieJWTAuthentication,)
    permission_classes = [IsAuthenticated]
    # get all generated questionnaires for a user
    def get(self, request):
        email = request.data.get("email", "").strip()
        if not User.objects.filter(email=email).exists():
            return Response(
                status=status.HTTP_404_NOT_FOUND,
                data={
                    'message': 'User not found'
                }
            )
        questionnaires_ids = User.objects.get(email=email).generated_questionnaires
        questionnaires = Questionnaire.objects.filter(id__in=questionnaires_ids)
        return Response(
            status=status.HTTP_200_OK,
            data={
                'questionnaires': questionnaires
            }
        )
    # user generate a questionnaire
    def put(self, request):
        email = request.data.get("email", "").strip()
        if not User.objects.filter(email=email).exists():
            return Response(
                status=status.HTTP_404_NOT_FOUND,
                data={
                    'message': 'User not found'
                }
            )
        questionnaire = Questionnaire.objects.create(
            questions=request.data.get("questions", [])
        )
        user = User.objects.get(email=email)
        user.generated_questionnaires.append(questionnaire.id)
        user.save()
        return Response(
            status=status.HTTP_200_OK,
            data={
                'message': 'Questionnaires updated successfully'
            }
        )
    # user delete an generated questionnaire
    def delete (self, request):
        email = request.data.get("email", "").strip()
        if not User.objects.filter(email=email).exists():
            return Response(
                status=status.HTTP_404_NOT_FOUND,
                data={
                    'message': 'User not found'
                }
            )
        questionnaire_id = request.data.get("questionnaire_id", "").strip()
        user = User.objects.get(email=email)
        user.generated_questionnaires.remove(questionnaire_id)
        user.save()
        Questionnaire.objects.get(id=questionnaire_id).delete()
        return Response(
            status=status.HTTP_200_OK,
            data={
                'message': 'Questionnaires updated successfully'
            }
        )