from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.core.mail import send_mail
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView

# from django.contrib.auth.models import User
from .models import CustomUser as User, Issue, Comment

from .authentication import CookieJWTAuthentication

admin_email = []

# Create your views here.
class SignUpView(APIView):  
    # sign up
    def post(self, request):
        username = request.data.get("username", "").strip()
        email = request.data.get("email", "").strip()
        password = request.data.get("password", "").strip()
        confirmedPassword = request.data.get("confirmedPassword", "").strip()
        role = request.data.get("role", "STUDENT")
        errors = []
        if not username or not password or not confirmedPassword or not email:
            errors.append('please fill all the fields')
        if password != confirmedPassword:
            errors.append('the password entered twice must be the same')
        if User.objects.filter(email=email).exists():
            errors.append('the email already exists')
        if User.objects.filter(username=username).exists():
            errors.append('the username already exists')
        
        if len(errors) > 0:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={
                    'errors': errors
                }
            )
        user = User(username=username, email=email, role=role)
        user.set_password(password)
        user.save()

        return Response(
            status=status.HTTP_201_CREATED,
            data={
                'message': 'success',
                'data': {
                    'username': username,
                    'email': email
                }
            }
        )
    
    # change/update info
    def put(self, request):
        email = request.data.get("email", "").strip()
        password = request.data.get("password", "").strip()
        newPassword = request.data.get("newPassword", "").strip()
        user = User.objects.get(email=email)
        if not user.exists():
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={
                    'errors': ['the user does not exist']
                }
            )
        if not user.check_password(password):
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={
                    'errors': ['the old password is incorrect']
                }
            )
        user.set_password(newPassword)
        user.save()
        return Response(
            status=status.HTTP_200_OK,
            data={
                'message': 'change password success'
            }
        )

class LogOutView(APIView):
    authentication_classes = (CookieJWTAuthentication,)
    permission_classes = [IsAuthenticated]
    def post(self, request):
        response = Response(
            status=status.HTTP_200_OK,
            data={
                'message': 'success'
            }
        )
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        return response

class PasswordResetView(APIView):
    def post(self, request):
        email = request.data.get("email", "").strip()
        # generate in the frontend
        newPassword = request.data.get("newPassword", "").strip()
        if not email:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={
                    'errors': ['please fill all the fields']
                }
            )
        if not User.objects.filter(email=email).exists():
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={
                    'errors': ['the email does not exist']
                }
            )
        user = User.objects.get(email=email)
        # send email
        send_mail(
            'Password Reset for Analego',  # subject
            'Your password reset was successful, the new password is: ' + newPassword + '. For the security of your account, please go to the user profile as soon as possible to change your password.',  # message
            'Analego',  # sender
            [email],  # receiver
            fail_silently=False,
        )

        user.set_password(newPassword)
        user.save()

        return Response(
            status=status.HTTP_200_OK,
            data={
                'message': 'send email success'
            }
        )
    
class InfoView(APIView):
    authentication_classes = (CookieJWTAuthentication,)
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        return Response(
            status=status.HTTP_200_OK,
            data={
                'message': 'success',
                'data': {
                    'username': user.username,
                    'email': user.email,
                    'notification': user.notification,
                    'free_openai_api_key': user.free_openai_api_key,
                    'role': user.role,
                    'points': user.points
                }
            }
        )
    
    # change notification status
    def put(self, request):
        user = request.user
        user.notification = not user.notification
        user.save()
        return Response(
            status=status.HTTP_200_OK,
            data={
                'message': 'success'
            }
        )
    
class GenLogView(APIView):
    authentication_classes = (CookieJWTAuthentication,)
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        logs = user.genlog_set.all()
        logs = sorted(logs, key=lambda log: log.created_at, reverse=True)
        logs = [{
            'created_at': log.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            'prompt': log.prompt,
            'target': log.target,
            'src': log.src,
            'temp': log.temp,
            'model' : log.model,
            'freq_penalty': log.freq_penalty,
            'pres_penalty': log.pres_penalty,
            'max_length': log.max_length,
            'top_p': log.top_p,
            'best_of': log.best_of,
            'analogy': log.analogy
        } for log in logs]
        return Response(
            status=status.HTTP_200_OK,
            data={
                'message': 'success',
                'data': {
                    'logs': logs
                }
            }
        )

class SearchLogView(APIView):
    authentication_classes = (CookieJWTAuthentication,)
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        logs = user.searchlog_set.all()
        logs = sorted(logs, key=lambda log: log.created_at, reverse=True)
        logs = [{
            'created_at': log.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            'query': log.query,
            'prompt': log.prompt,
            'temp': log.temp
        } for log in logs]
        return Response(
            status=status.HTTP_200_OK,
            data={
                'message': 'success',
                'data': {
                    'logs': logs
                }
            }
        )

class FlagAnalogyView(APIView):
    def post(self, request):
        # generate check log for admin
        analogy = request.data.get("analogy", None)
        issue = request.data.get("issue", "").strip()
        issueDetails = request.data.get("issueDetails", "").strip()
        username = request.data.get("username", None)
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            user = None
        issue = Issue(
            user = user,
            issue=issue,
            detail=issueDetails,
            pid = analogy['pid'],
            target = analogy['target'],
            prompt = analogy['prompt'],
            analogy = analogy['analogy']
        )
        issue.save()
        
        # send email to admin
        # send_mail(
        #     'Analogy Issue Reported',  # subject
        #     'There is an issue waiting for processing, id: ' + str(issue.id) + ', issue: ' + issue.issue,  # message
        #     'Analego',  # sender
        #     admin_email,  # receiver
        #     fail_silently=False,
        # )
        return Response(
            status=status.HTTP_201_CREATED,
            data={
                'message': 'success'
            }
        )

class CommentAnalogyView(APIView):
    def get(self, request):
        pid = request.query_params.get('pid', '')
        if pid == '':
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={
                    'errors': ['pid is required']
                }
            )
        comments = Comment.objects.filter(pid=pid, admin_selected=True) 
        return Response(
            status=status.HTTP_200_OK,
            data={
                'message': 'success',
                'data': {
                    'comments': [{
                        'id': comment.id,
                        'username': comment.user.username if comment.user else 'anonymous',
                        'created_at': comment.created_at.strftime("%Y-%m-%d %H:%M:%S"),
                        'comment': comment.comment,
                        'replyTo_username': comment.replyTo.user.username if comment.replyTo and comment.replyTo.user else "anonymous",
                        'replyTo_comment': comment.replyTo.comment if comment.replyTo else None
                    } for comment in comments]
                }
            }  
        )

    def post(self, request):
        comment = request.data.get("comment", "").strip()
        analogy = request.data.get("analogy", None)
        replyTo = request.data.get("replyTo", None)
        username = request.data.get("username", None)
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            user = None
        print(analogy)
        comment = Comment(
            user = user,
            comment = comment,
            pid = analogy['pid'],
            target = analogy['target'],
            prompt = analogy['prompt'],
            analogy = analogy['analogy'],
            replyTo = Comment.objects.get(id=replyTo) if replyTo else None
        )
        comment.save()

        if replyTo:
            replyComment = Comment.objects.get(id=replyTo)
            replyToUser = replyComment.user
            if replyToUser and replyToUser.notification == True:
                # send email
                send_mail(
                    'Your Comment Has Been Replied',  # subject
                    'Your comment has been replied, please go to the user profile to see the detail. Thank you for the contribution to our community!',  # message
                    'Analego',  # sender
                    [replyToUser.email],  # receiver
                    fail_silently=False,
                )

        return Response(
            status=status.HTTP_201_CREATED,
            data={
                'message': 'success'
            }
        )

class IssueLogView(APIView):
    authentication_classes = (CookieJWTAuthentication,)
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        issues = Issue.objects.filter(user=user)
        issues = [{
            'id': issue.id,
            'created_at': issue.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            'issue': issue.issue,
            'detail': issue.detail,
            'target': issue.target,
            'prompt': issue.prompt,
            'analogy': issue.analogy,
            'solved': issue.solved,
            'admin_comment': issue.admin_comment
        } for issue in issues]
        return Response(
            status=status.HTTP_200_OK,
            data={
                'message': 'success',
                'data': {
                    'issues': issues
                }
            }
        )
    
    def put(self, request):
        user = request.user
        issueId = request.data.get("issueId", "")
        updatedIssue = request.data.get("issue", "").strip()
        updatedIssueDetail = request.data.get("issueDetail", "").strip()
        issue = Issue.objects.get(id=issueId, user=user, solved=False)
        if not issue:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={
                    'errors': ['the issue does not exist or has been solved']
                }
            )
        issue.issue = updatedIssue
        issue.detail = updatedIssueDetail
        issue.save()
        return Response(
            status=status.HTTP_200_OK,
            data={
                'message': 'success'
            }
        )

class CommentReplyInfoView(APIView):
    authentication_classes = (CookieJWTAuthentication,)
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        comments = Comment.objects.filter(user=user)
        all_replies = []

        for comment in comments:
            replies = comment.replies.filter(admin_selected=True).order_by('-created_at')
            replies = [{
                'id': reply.id,
                'username': reply.user.username if reply.user else 'anonymous',
                'created_at': reply.created_at.strftime("%Y-%m-%d %H:%M:%S"),
                'pid': comment.pid,
                'target': comment.target,
                'prompt': comment.prompt,
                'analogy': comment.analogy,
                'comment_origin': comment.comment,
                'comment_reply': reply.comment,
            } for reply in replies]
            all_replies.extend(replies)
        # print(all_replies)
        return Response(
            status=status.HTTP_200_OK,
            data={
                'message': 'success',
                'data': {
                    'replies': all_replies
                }
            }
        )

# customize token framework to store token in cookie
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # print("checkpoint", user)
        token['username'] = user.username

        return token
    
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
            
        if response.status_code == 200:
            access_token = response.data['access']
            refresh_token = response.data['refresh']

            response.set_cookie(
                'access_token',
                access_token,
                httponly=True,  # can not be accessed by JavaScript
                samesite='Lax',  # CSRF
                # secure=True,  # HTTPS
                max_age=60 * 60 * 24,  # 1 day
            )
                
            response.set_cookie(
                'refresh_token',
                refresh_token,
                httponly=True,
                samesite='Lax',  # CSRF
                # secure=True,
                max_age=60 * 60 * 24,  # 1 day
            )
            
        return response
