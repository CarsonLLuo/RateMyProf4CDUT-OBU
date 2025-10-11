from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ReviewViewSet, ReviewListView, ReviewCreateView, ReviewDetailView, mark_helpful, review_stats

# 创建DRF路由器用于CRUD操作
router = DefaultRouter()
router.register(r'', ReviewViewSet, basename='review-manage')

urlpatterns = [
    # 保持原有API结构的兼容性
    path('', ReviewListView.as_view(), name='review-list'),
    path('create/', ReviewCreateView.as_view(), name='review-create'),
    path('<int:pk>/', ReviewDetailView.as_view(), name='review-detail'),
    path('<int:review_id>/helpful/', mark_helpful, name='review-helpful'),
    path('stats/', review_stats, name='review-stats'),
    
    # 管理API (支持完整CRUD)
    path('manage/', include(router.urls)),
]
