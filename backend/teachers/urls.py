from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TeacherViewSet, TeacherListView, TeacherDetailView, teacher_stats

# 创建DRF路由器用于CRUD操作
router = DefaultRouter()
router.register(r'', TeacherViewSet, basename='teacher')

urlpatterns = [
    # 保持原有API结构
    path('stats/', teacher_stats, name='teacher-stats'),
    
    # 包含完整CRUD功能的API
    path('', include(router.urls)),
]
