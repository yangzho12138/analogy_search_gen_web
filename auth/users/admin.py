from django.contrib import admin

# Register your models here.
from .models import CustomUser, GenLog, SearchLog

class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email')
    search_fields = ('username', 'email')

class GenLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at', 'prompt', 'target', 'src', 'temp', 'freq_penalty', 'pres_penalty', 'max_length', 'top_p', 'best_of', 'analogy')
    search_fields = ('user__email', 'user__username', 'created_at', 'prompt', 'target', 'src', 'temp', 'freq_penalty', 'pres_penalty', 'max_length', 'top_p', 'best_of', 'analogy')

class SearchLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at', 'query', 'analogies')
    search_fields = ('user__email', 'user__username', 'created_at', 'query', 'analogies')

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(GenLog, GenLogAdmin)
admin.site.register(SearchLog, SearchLogAdmin)

