from django.db.models import Q, Avg
from django.db import models
from rest_framework import generics, filters, viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django_filters.rest_framework import DjangoFilterBackend
from django_filters import rest_framework as filters_rest

from .models import Teacher
from .serializers import TeacherListSerializer, TeacherDetailSerializer, TeacherAdminSerializer


class TeacherFilter(filters_rest.FilterSet):
    """教师过滤器"""
    name = filters_rest.CharFilter(lookup_expr='icontains')
    department = filters_rest.CharFilter(lookup_expr='icontains')
    subjects = filters_rest.CharFilter(method='filter_subjects')
    min_rating = filters_rest.NumberFilter(field_name='average_rating', lookup_expr='gte')
    max_difficulty = filters_rest.NumberFilter(field_name='difficulty_rating', lookup_expr='lte')
    
    class Meta:
        model = Teacher
        fields = ['name', 'department', 'subjects', 'min_rating', 'max_difficulty']
    
    def filter_subjects(self, queryset, name, value):
        return queryset.filter(subjects__icontains=value)


class TeacherViewSet(viewsets.ModelViewSet):
    """教师管理视图集 - 支持完整CRUD操作"""
    queryset = Teacher.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = TeacherFilter
    search_fields = ['name', 'bio', 'subjects']
    ordering_fields = ['average_rating', 'difficulty_rating', 'total_reviews', 'name']
    ordering = ['-average_rating']
    
    # 临时禁用认证要求（开发阶段）
    authentication_classes = []
    permission_classes = []
    
    def get_serializer_class(self):
        """根据操作类型选择序列化器"""
        if self.action == 'list':
            return TeacherListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return TeacherAdminSerializer
        return TeacherDetailSerializer
    
    def perform_create(self, serializer):
        """创建教师时的额外处理"""
        teacher = serializer.save()
        # 如果需要，在这里可以添加创建后的逻辑
        return teacher
    
    def perform_update(self, serializer):
        """更新教师时的额外处理"""
        teacher = serializer.save()
        # 更新统计信息
        teacher.update_ratings()
        return teacher
    
    def destroy(self, request, *args, **kwargs):
        """删除教师"""
        instance = self.get_object()
        # 检查是否有相关评价
        if instance.total_reviews > 0:
            return Response(
                {'detail': f'无法删除该教师，因为存在 {instance.total_reviews} 条评价'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class TeacherListView(generics.ListAPIView):
    """教师列表视图 - 向后兼容"""
    queryset = Teacher.objects.all()
    serializer_class = TeacherListSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = TeacherFilter
    search_fields = ['name', 'bio', 'subjects']
    ordering_fields = ['average_rating', 'difficulty_rating', 'total_reviews', 'name']
    ordering = ['-average_rating']


class TeacherDetailView(generics.RetrieveAPIView):
    """教师详情视图 - 向后兼容"""
    queryset = Teacher.objects.all()
    serializer_class = TeacherDetailSerializer


@api_view(['GET'])
def teacher_stats(request):
    """教师统计信息"""
    total_teachers = Teacher.objects.count()
    total_reviews = sum(teacher.total_reviews for teacher in Teacher.objects.all())
    
    # 按系别统计
    departments = Teacher.objects.values('department').distinct()
    department_stats = []
    for dept in departments:
        dept_teachers = Teacher.objects.filter(department=dept['department'])
        department_stats.append({
            'department': dept['department'],
            'teacher_count': dept_teachers.count(),
            'avg_rating': dept_teachers.aggregate(
                avg=models.Avg('average_rating')
            )['avg'] or 0
        })
    
    return Response({
        'total_teachers': total_teachers,
        'total_reviews': total_reviews,
        'department_stats': department_stats
    })
