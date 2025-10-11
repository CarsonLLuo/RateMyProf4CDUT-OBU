from django.contrib import admin
from .models import Review, ReviewHelpful


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['teacher', 'title', 'overall_rating', 'difficulty_rating', 
                   'course', 'semester', 'would_take_again', 'helpful_count', 'created_at']
    list_filter = ['overall_rating', 'difficulty_rating', 'course', 'semester', 
                  'would_take_again', 'created_at']
    search_fields = ['teacher__name', 'title', 'content', 'reviewer_name']
    readonly_fields = ['helpful_count', 'created_at', 'updated_at']
    
    fieldsets = (
        ('基本信息', {
            'fields': ('teacher', 'reviewer_name', 'title')
        }),
        ('评分信息', {
            'fields': ('overall_rating', 'difficulty_rating', 'would_take_again')
        }),
        ('课程信息', {
            'fields': ('course', 'semester')
        }),
        ('评价内容', {
            'fields': ('content', 'pros', 'cons', 'tags')
        }),
        ('统计信息', {
            'fields': ('helpful_count',),
            'classes': ('collapse',)
        }),
        ('时间信息', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(ReviewHelpful)
class ReviewHelpfulAdmin(admin.ModelAdmin):
    list_display = ['review', 'ip_address', 'created_at']
    list_filter = ['created_at']
    search_fields = ['review__title', 'ip_address']
