from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework.authentication import BaseAuthentication
from rest_framework import exceptions
from rest_framework_simplejwt.state import token_backend
from .models import CustomUser as User

class CookieJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        token = request.COOKIES.get('access_token')
        print("token",token)
        if not token:
            return None

        try:
            decoded_data = token_backend.decode(token, verify=True)
            print("decoded_data",decoded_data)
            username = decoded_data.get('username')
            print("username", username)
            if not username:
                raise exceptions.AuthenticationFailed('Invalid token - username missing')
            user = User.objects.get(username=username)
        except (InvalidToken, TokenError) as e:
            raise exceptions.AuthenticationFailed('Invalid token')

        return (user, token)