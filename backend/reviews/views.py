from django.db import models
from rest_framework import generics, status, viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django_filters import rest_framework as filters
from rest_framework import filters as rest_filters

from .models import Review, ReviewHelpful
from .serializers import ReviewSerializer, ReviewCreateSerializer


class ReviewFilter(filters.FilterSet):
    """评价过滤器"""
    teacher = filters.NumberFilter(field_name='teacher__id')
    course = filters.CharFilter()
    semester = filters.CharFilter()
    min_rating = filters.NumberFilter(field_name='overall_rating', lookup_expr='gte')
    max_difficulty = filters.NumberFilter(field_name='difficulty_rating', lookup_expr='lte')
    would_take_again = filters.BooleanFilter()
    
    class Meta:
        model = Review
        fields = ['teacher', 'course', 'semester', 'min_rating', 'max_difficulty', 'would_take_again']


class ReviewListView(generics.ListAPIView):
    """评价列表视图"""
    queryset = Review.objects.select_related('teacher').all()
    serializer_class = ReviewSerializer
    filter_backends = [DjangoFilterBackend, rest_filters.SearchFilter, rest_filters.OrderingFilter]
    filterset_class = ReviewFilter
    search_fields = ['title', 'content', 'teacher__name']
    ordering_fields = ['created_at', 'overall_rating', 'difficulty_rating', 'helpful_count']
    ordering = ['-created_at']


class ReviewViewSet(viewsets.ModelViewSet):
    """评价管理视图集 - 支持完整CRUD操作"""
    queryset = Review.objects.select_related('teacher').all()
    filter_backends = [DjangoFilterBackend, rest_filters.SearchFilter, rest_filters.OrderingFilter]
    filterset_class = ReviewFilter
    search_fields = ['title', 'content', 'teacher__name', 'reviewer_name']
    ordering_fields = ['created_at', 'overall_rating', 'difficulty_rating', 'helpful_count']
    ordering = ['-created_at']
    
    # 临时禁用认证要求（开发阶段）
    authentication_classes = []
    permission_classes = []
    
    def get_serializer_class(self):
        """根据操作类型选择序列化器"""
        if self.action == 'create':
            return ReviewCreateSerializer
        return ReviewSerializer
    
    def perform_destroy(self, instance):
        """删除评价时更新教师统计"""
        teacher = instance.teacher
        super().perform_destroy(instance)
        # 删除后重新计算教师统计
        teacher.update_ratings()


class ReviewCreateView(generics.CreateAPIView):
    """创建评价视图 - 向后兼容"""
    queryset = Review.objects.all()
    serializer_class = ReviewCreateSerializer
    
    # 临时禁用认证要求（开发阶段）
    authentication_classes = []
    permission_classes = []


class ReviewDetailView(generics.RetrieveAPIView):
    """评价详情视图"""
    queryset = Review.objects.select_related('teacher').all()
    serializer_class = ReviewSerializer


@api_view(['POST'])
def mark_helpful(request, review_id):
    """标记评价为有用"""
    try:
        review = Review.objects.get(id=review_id)
        ip_address = request.META.get('REMOTE_ADDR')
        
        # 检查是否已经投过票
        if ReviewHelpful.objects.filter(review=review, ip_address=ip_address).exists():
            return Response({'error': '您已经投过票了'}, status=status.HTTP_400_BAD_REQUEST)
        
        # 创建投票记录
        ReviewHelpful.objects.create(review=review, ip_address=ip_address)
        
        # 更新有用投票数
        review.helpful_count = ReviewHelpful.objects.filter(review=review).count()
        review.save()
        
        return Response({'helpful_count': review.helpful_count})
        
    except Review.DoesNotExist:
        return Response({'error': '评价不存在'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def review_stats(request):
    """评价统计信息"""
    total_reviews = Review.objects.count()
    
    # 按评分统计
    rating_stats = {}
    for rating in range(1, 6):
        rating_stats[f'rating_{rating}'] = Review.objects.filter(overall_rating=rating).count()
    
    # 按课程统计
    course_stats = {}
    for course_code, course_name in Review.COURSE_CHOICES:
        course_stats[course_code] = {
            'name': course_name,
            'count': Review.objects.filter(course=course_code).count()
        }
    
    # 最新评价
    recent_reviews = Review.objects.select_related('teacher').order_by('-created_at')[:10]
    recent_reviews_data = ReviewSerializer(recent_reviews, many=True).data
    
    return Response({
        'total_reviews': total_reviews,
        'rating_stats': rating_stats,
        'course_stats': course_stats,
        'recent_reviews': recent_reviews_data
    })
