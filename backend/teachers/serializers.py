from rest_framework import serializers
from .models import Teacher


class TeacherAdminSerializer(serializers.ModelSerializer):
    """教师管理序列化器 - 支持创建和更新"""
    subjects_list = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Teacher
        fields = [
            'id', 'name', 'bio', 'image', 'department', 'subjects',
            'detail_url', 'total_reviews', 'average_rating', 
            'difficulty_rating', 'would_take_again', 'subjects_list',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'total_reviews', 'average_rating', 'difficulty_rating', 
            'would_take_again', 'created_at', 'updated_at'
        ]
    
    def get_subjects_list(self, obj):
        if obj.subjects:
            return [subject.strip() for subject in obj.subjects.split(',')]
        return []
    
    def validate_subjects(self, value):
        """验证科目字段"""
        if value:
            # 清理和验证科目列表
            subjects = [subject.strip() for subject in value.split(',') if subject.strip()]
            if len(subjects) > 10:
                raise serializers.ValidationError("最多只能添加10个科目")
            return ','.join(subjects)
        return value
    
    def validate_name(self, value):
        """验证教师姓名"""
        if not value or not value.strip():
            raise serializers.ValidationError("教师姓名不能为空")
        if len(value.strip()) > 200:
            raise serializers.ValidationError("教师姓名不能超过200个字符")
        return value.strip()


class TeacherListSerializer(serializers.ModelSerializer):
    """教师列表序列化器"""
    subjects_list = serializers.SerializerMethodField()
    
    class Meta:
        model = Teacher
        fields = [
            'id', 'name', 'image', 'department', 'subjects_list',
            'total_reviews', 'average_rating', 'difficulty_rating', 
            'would_take_again'
        ]
    
    def get_subjects_list(self, obj):
        if obj.subjects:
            return [subject.strip() for subject in obj.subjects.split(',')]
        return []


class TeacherDetailSerializer(serializers.ModelSerializer):
    """教师详情序列化器"""
    subjects_list = serializers.SerializerMethodField()
    recent_reviews = serializers.SerializerMethodField()
    
    class Meta:
        model = Teacher
        fields = [
            'id', 'name', 'bio', 'image', 'department', 'subjects_list',
            'total_reviews', 'average_rating', 'difficulty_rating', 
            'would_take_again', 'detail_url', 'recent_reviews',
            'created_at', 'updated_at'
        ]
    
    def get_subjects_list(self, obj):
        if obj.subjects:
            return [subject.strip() for subject in obj.subjects.split(',')]
        return []
    
    def get_recent_reviews(self, obj):
        from reviews.serializers import ReviewSerializer
        recent_reviews = obj.review_set.all()[:5]  # 获取最近5条评价
        return ReviewSerializer(recent_reviews, many=True).data
