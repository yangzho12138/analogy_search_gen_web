from django.urls import re_path as url
from django.urls import path
from assign.views import AnalogyView, QuestionView, QuestionnaireView, DownloadView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    url(r'^api/assignment/analogy', AnalogyView.as_view()),
    path('api/assignment/questionnaire', QuestionnaireView.as_view()),
    path('api/assignment/questionnaire/<str:id>', QuestionnaireView.as_view()),
    path('api/assignment/download/<str:id>/<int:isStuVer>', DownloadView.as_view()),
    path('api/assignment/question', QuestionView.as_view()),
    path('api/assignment/question/<str:id>', QuestionView.as_view()),
    path('api/users/token', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/users/token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
]