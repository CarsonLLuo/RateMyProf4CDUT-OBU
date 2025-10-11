from django.urls import path
from . import views

urlpatterns = [
    path('student/login/', views.student_login, name='student_login'),
    path('admin/login/', views.admin_login, name='admin_login'),
    path('user/', views.get_current_user, name='get_current_user'),
    path('logout/', views.logout, name='logout'),
    path('refresh/', views.refresh_token, name='refresh_token'),
    
    # 用户管理API
    path('users/', views.user_management, name='user_management'),
    path('users/<int:user_id>/', views.user_detail, name='user_detail'),
    path('users/stats/', views.user_stats, name='user_stats'),
]
