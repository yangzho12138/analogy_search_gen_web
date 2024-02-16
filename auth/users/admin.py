from django.contrib import admin

# Register your models here.
from .models import CustomUser, GenLog, SearchLog, Issue
import redis
import json

r = redis.Redis(host='localhost', port=6379, db=1)

class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email')
    search_fields = ('username', 'email')

class GenLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at', 'prompt', 'target', 'src', 'temp', 'freq_penalty', 'pres_penalty', 'max_length', 'top_p', 'best_of', 'analogy')
    search_fields = ('user__email', 'user__username', 'created_at', 'prompt', 'target', 'src', 'temp', 'freq_penalty', 'pres_penalty', 'max_length', 'top_p', 'best_of', 'analogy')

class SearchLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at', 'query', 'analogies')
    search_fields = ('user__email', 'user__username', 'created_at', 'query', 'analogies')

def delete_analogy(self, request, queryset):
    for obj in queryset:
        r.push('deleteAnalogy', json.dumps({
            'id': obj.id,
            'pid': obj.pid
        }))

def update_analogy(self, request, queryset):
    for obj in queryset:
        r.push('updateAnalogy', json.dumps({
            'id': obj.id,
            'pid': obj.pid,
            'analogy': obj.analogy
        }))

class IssueAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'created_at', 'issue', 'comment', 'solved', 'pid', 'target', 'prompt', 'analogy', 'admin_comment')
    search_fields = ('id', 'user__email', 'user__username', 'created_at', 'issue', 'target', 'prompt', 'analogy', 'pid')
    list_editable = ('solved', 'admin_comment', 'analogy')
    list_filter = ('solved',)
    actions = [delete_analogy, update_analogy]


admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(GenLog, GenLogAdmin)
admin.site.register(SearchLog, SearchLogAdmin)
admin.site.register(Issue, IssueAdmin)

