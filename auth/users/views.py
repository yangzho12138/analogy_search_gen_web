from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

# from django.contrib.auth.models import User
from .models import CustomUser as User

# Create your views here.
class SignUpView(APIView):  
    # sign up
    def post(self, request):
        data = request.POST
        username = data.get("username", "").strip()
        email = data.get("email", "").strip()
        password = data.get("password", "").strip()
        confirmedPassword = data.get("confirmedPassword", "").strip()
        if not username or not password or not confirmedPassword or not email:
            return Response({
                'status': 400,
                'message': 'please fill all the fields'
            })
        if password != confirmedPassword:
            return Response({
                'status': 400,
                'message': 'the password entered twice must be the same'
            })
        if User.objects.filter(email=email).exists():
            return Response({
                'status': 400,
                'message': 'the email already exists'
            })
        if User.objects.filter(username=username).exists():
            return Response({
                'status': 400,
                'message': 'the username already exists'
            })
        user = User(username=username, email=email)
        user.set_password(password)
        user.save()
        return Response({
            'status': 201,
            'message': 'register success',
            'data': {
                'username': username,
                'email': email
            }
        })
    
class InfoView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        return Response({
            'status': 200,
            'message': 'success',
            'data': {
                'username': user.username,
                'email': user.email
            }
        })