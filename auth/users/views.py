from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.core.mail import send_mail

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

        # synchronize user info to gen system
        # create_user.delay({
        #     'username': username,
        #     'email': email
        # })

        return Response({
            'status': 201,
            'message': 'register success',
            'data': {
                'username': username,
                'email': email
            }
        })
    
    # change/update info
    def put(self, request):
        data = request.PUT
        email = data.get("email", "").strip()
        password = data.get("password", "").strip()
        newPassword = data.get("newPassword", "").strip()
        user = User.objects.get(email=email)
        if not user.exists():
            return Response({
                'status': 400,
                'message': 'the user does not exist'
            })
        if not user.check_password(password):
            return Response({
                'status': 400,
                'message': 'the old password is incorrect'
            })
        user.set_password(newPassword)
        user.save()
        return Response({
            'status': 200,
            'message': 'change password success'
        })

class PasswordResetView(APIView):
    def post(self, request):
        data = request.POST
        email = data.get("email", "").strip()
        # generate in the frontend
        newPassword = data.get("newPassword", "").strip()
        if not email:
            return Response({
                'status': 400,
                'message': 'please fill all the fields'
            })
        if not User.objects.filter(email=email).exists():
            return Response({
                'status': 400,
                'message': 'the email does not exist'
            })
        user = User.objects.get(email=email)
        # send email
        send_mail(
            'Password Reset for Analego',  # subject
            'Your password reset was successful, the new password is: ' + newPassword + '. For the security of your account, please go to the user profile as soon as possible to change your password.',  # message
            'Analego',  # sender
            [email],  # receiver
            fail_silently=False,
        )
        return Response({
            'status': 200,
            'message': 'send email success'
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
    
class GenLogView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        logs = user.genlog_set.all()
        logs = [{
            'created_at': log.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            'prompt': log.prompt,
            'target': log.target,
            'src': log.src,
            'temp': log.temp,
            'freq_penalty': log.freq_penalty,
            'pres_penalty': log.pres_penalty,
            'max_length': log.max_length,
            'top_p': log.top_p,
            'best_of': log.best_of,
            'analogy': log.analogy
        } for log in logs]
        return Response({
            'status': 200,
            'message': 'success',
            'data': {
                'logs': logs
            }
        })