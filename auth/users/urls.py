from django.urls import re_path as url
from django.urls import path
from users.views import SignUpView
from users.views import LogOutView
from users.views import InfoView
from users.views import GenLogView
from users.views import SearchLogView
from users.views import PasswordResetView
# from rest_framework_simplejwt.views import (
#     TokenObtainPairView,
#     TokenRefreshView,
# )
from users.views import CustomTokenObtainPairView

urlpatterns = [
    url(r'^api/users/signup', SignUpView.as_view()),
    url(r'^api/users/info', InfoView.as_view()),
    url(r'^api/users/logout', LogOutView.as_view()),
    url(r'^api/users/genLogs', GenLogView.as_view()),
    url(r'^api/users/searchLogs', SearchLogView.as_view()),
    url(r'^api/users/passwordReset', PasswordResetView.as_view()),
    # path('api/users/token', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('api/users/token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/users/token', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
]