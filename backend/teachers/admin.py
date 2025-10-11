from django.contrib import admin
from .models import Teacher


@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
    list_display = ['name', 'department', 'total_reviews', 'average_rating', 'difficulty_rating', 'created_at']
    list_filter = ['department', 'created_at']
    search_fields = ['name', 'bio', 'subjects']
    readonly_fields = ['total_reviews', 'average_rating', 'difficulty_rating', 'would_take_again', 'created_at', 'updated_at']
    
    fieldsets = (
        ('基本信息', {
            'fields': ('name', 'bio', 'image', 'department', 'subjects')
        }),
        ('外部链接', {
            'fields': ('detail_url', 'original_image_url'),
            'classes': ('collapse',)
        }),
        ('统计信息', {
            'fields': ('total_reviews', 'average_rating', 'difficulty_rating', 'would_take_again'),
            'classes': ('collapse',)
        }),
        ('时间信息', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
