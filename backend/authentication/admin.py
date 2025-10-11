from django.contrib import admin
from .models import UserProfile

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    """用户资料管理"""
    list_display = ['user', 'student_id', 'plain_password', 'user_type', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__username', 'student_id']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('基本信息', {
            'fields': ('user', 'student_id')
        }),
        ('密码信息', {
            'fields': ('plain_password',),
            'description': '注意：这里显示的是明文密码，请谨慎处理'
        }),
        ('时间信息', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def user_type(self, obj):
        return '管理员' if obj.user.groups.filter(name='管理员').exists() else '学生'
    user_type.short_description = '用户类型'
    
    def get_queryset(self, request):
        """优化查询"""
        return super().get_queryset(request).select_related('user')