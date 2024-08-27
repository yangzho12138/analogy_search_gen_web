from openai import OpenAI
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
import redis
from redis import Redis
from redis.connection import ConnectionPool
from django.utils import timezone
import json
from .tasks import generate_log
from rest_framework import status
from .models import CustomUser as User

from .authentication import CookieJWTAuthentication

# Create your views here.
pool = ConnectionPool(host='localhost', port=6379, db=1, max_connections=10)

def  get_response(prompt,temp,max_length,top_p,freq_penalty,pres_penalty,client,model,grade):
    #print(prompt, flush=True)	
    system = "You are a helpful and knowledgeable tutor who helps {}students understand concepts.".format(grade+' ')
    completion = client.chat.completions.create(
        model=model,
        messages=[{"role": "system", "content": system},{"role": "user", "content": prompt}],
        temperature=temp,
        max_tokens=max_length,
        top_p=top_p,
        frequency_penalty=freq_penalty,
        presence_penalty=pres_penalty
    )
    print(completion.choices, flush=True)
    return completion.choices[0].message.content

class GenerationView(APIView):
    authentication_classes = (CookieJWTAuthentication,)
    permission_classes = [IsAuthenticated]
    # generate the analogy
    def post(self, request):
        user = User.objects.get(username=request.user.username)
        print(user.free_openai_api_key)
        api_key = request.data.get('api_key', '')
        if api_key == '' and user.free_openai_api_key > 0:
            client = OpenAI(api_key='DEFAULT API KEY') 
        prompt = request.data.get('prompt', '')
        model = request.data.get('model', 'gpt-3')
        target = request.data.get('target', '')
        #print(target, flush=True)
        src = request.data.get('src', '')
        temp = float(request.data.get('temp', 0))
        freq_penalty = float(request.data.get('freq_penalty', 0))
        pres_penalty = float(request.data.get('pres_penalty', 0))
        max_length = int(request.data.get('max_length', 800))
        top_p = float(request.data.get('top_p', 1))
        best_of = int(request.data.get('best_of', 1))
        grade = request.data.get('grade', '')

        if api_key == '' and target == '':
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data = {
                    'errors': ['Please provide all the required fields']
                }
            )

        prompt = prompt.replace('<target>',target)
        prompt = prompt.replace('<src>',src)

        try:
            resp = get_response(prompt,temp,max_length,top_p,freq_penalty,pres_penalty,client,model).strip()
        except Exception as e:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data = {
                    'errors': [str(e)]
                }
            )
        
        user.free_openai_api_key -= 1
        user.save()
        
        generationLog = {
            'username': request.user.username,
            'created_at': timezone.now().strftime("%Y-%m-%d %H:%M:%S"),
            'prompt': prompt,
            'model': model,
            'target': target,
            'src': src,
            'temp': temp,
            'freq_penalty': freq_penalty,
            'pres_penalty': pres_penalty,
            'max_length': max_length,
            'top_p': top_p,
            'best_of': best_of,
            'analogy': resp,
            'grade': grade
        }

        # send generation log to auth system
        generate_log.delay(generationLog)

        return Response(
            status = status.HTTP_200_OK,
            data = {
                'resp': resp
            }
        )
    
    # add new generation
    def put(self, request):
        prompt = request.data.get('prompt', '')
        model = request.data.get('model', 'gpt-3')
        pid = prompt
        target = request.data.get('target', '')
        src = request.data.get('src', '')
        temp = float(request.data.get('temp', 0))
        freq_penalty = float(request.data.get('freq_penalty', 0))
        pres_penalty = float(request.data.get('pres_penalty', 0))
        max_length = int(request.data.get('max_length', 800))
        top_p = float(request.data.get('top_p', 1))
        best_of = int(request.data.get('best_of', 1))
        analogy = request.data.get('analogy', '')
        role = request.data.get('role', 'STUDENT')
        grade = request.data.get('grade', '')

        prompt = prompt.replace('<target>',target)
        prompt = prompt.replace('<src>',src)

        # store data into cache
        # r = redis.Redis(host='localhost', port=6379, db=1)
        r = Redis(connection_pool=pool)
        generationAnalogy = {
            'username': request.user.username,
            'prompt': prompt,
            'model': model,
            'pid': pid,
            'target': target,
            'src': src,
            'temp': temp,
            'freq_penalty': freq_penalty,
            'pres_penalty': pres_penalty,
            'max_length': max_length,
            'top_p': top_p,
            'best_of': best_of,
            'analogy': analogy,
            'generatorRole': role,
            'grade': grade
        }
        r.rpush('generationAnalogy', json.dumps(generationAnalogy))
        return Response(
            status = status.HTTP_200_OK,
            data = {
                'message': 'Analogy added successfully'
            }
        )
