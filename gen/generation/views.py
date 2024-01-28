import openai
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
import redis
from django.utils import timezone
import json
from .tasks import generate_log

# Create your views here.

def  get_response(prompt,temp,max_length,top_p,freq_penalty,pres_penalty):
    response = response = openai.ChatCompletion.create(
        model='gpt-3.5-turbo',
        messages=[
            {"role": "user", "content": prompt},
        ],
        temperature=temp,
        max_tokens=max_length,
        top_p=top_p,
        frequency_penalty=freq_penalty,
        presence_penalty=pres_penalty
    )
    return response['choices'][0]['message']['content']

class GenerationView(APIView):
    permission_classes = [IsAuthenticated]
    # generate the analogy
    def post(self, request):
        data = request.POST
        openai.api_key = data.get('api_key', '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')
        prompt = data.get('prompt', '')
        target = data.get('target', '')
        src = data.get('src', '')
        temp = float(data.get('temp', 0))
        freq_penalty = float(data.get('freq_penalty', 0))
        pres_penalty = float(data.get('pres_penalty', 0))
        max_length = int(data.get('max_length', 800))
        top_p = float(data.get('top_p', 1))
        best_of = int(data.get('best_of', 1))

        prompt = prompt.replace('<target>',target)
        prompt = prompt.replace('<src>',src)

        try:
            resp = get_response(prompt,temp,max_length,top_p,freq_penalty,pres_penalty).strip()
        except Exception as e:
            return Response({
                'status': 400,
                'message': 'generate failed',
                'data': {
                    'error': str(e)
                }
            })
        
        # store data into cache
        r = redis.Redis(host='localhost', port=6379, db=1)
        generationLog = {
            'username': request.user.username,
            'created_at': timezone.now().strftime("%Y-%m-%d %H:%M:%S"),
            'prompt': prompt,
            'target': target,
            'src': src,
            'temp': temp,
            'freq_penalty': freq_penalty,
            'pres_penalty': pres_penalty,
            'max_length': max_length,
            'top_p': top_p,
            'best_of': best_of,
            'analogy': resp
        }
        r.rpush('generationLog', json.dumps(generationLog))

        # send generation log to auth system
        generate_log.delay(generationLog)

        return Response({
            'status': 201,
            'message': 'generate success',
            'data': {
                'resp': resp
            }
        })
