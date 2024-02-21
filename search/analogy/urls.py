from django.urls import path
from analogy.views import SearchView, LikeView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('api/search', SearchView.as_view(),name='search'),
    path('api/like', LikeView.as_view(), name='like'),
    path('api/users/token', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/users/token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
]