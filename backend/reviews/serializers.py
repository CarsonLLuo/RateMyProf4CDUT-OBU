from rest_framework import serializers
from .models import Review, ReviewHelpful


class ReviewSerializer(serializers.ModelSerializer):
    """评价序列化器"""
    teacher_name = serializers.CharField(source='teacher.name', read_only=True)
    tags_list = serializers.SerializerMethodField()
    course_display = serializers.CharField(source='get_course_display', read_only=True)
    semester_display = serializers.CharField(source='get_semester_display', read_only=True)
    
    class Meta:
        model = Review
        fields = [
            'id', 'teacher', 'teacher_name', 'reviewer_name',
            'overall_rating', 'difficulty_rating', 'would_take_again',
            'course', 'course_display', 'semester', 'semester_display',
            'title', 'content', 'pros', 'cons', 'tags', 'tags_list',
            'helpful_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['helpful_count', 'created_at', 'updated_at']
    
    def get_tags_list(self, obj):
        return obj.get_tags_list()


class ReviewCreateSerializer(serializers.ModelSerializer):
    """创建评价序列化器"""
    
    class Meta:
        model = Review
        fields = [
            'teacher', 'reviewer_name', 'overall_rating', 'difficulty_rating',
            'would_take_again', 'course', 'semester', 'title', 'content',
            'pros', 'cons', 'tags'
        ]
    
    def validate_overall_rating(self, value):
        if not 1 <= value <= 5:
            raise serializers.ValidationError("总体评分必须在1-5之间")
        return value
    
    def validate_difficulty_rating(self, value):
        if not 1 <= value <= 5:
            raise serializers.ValidationError("难度评分必须在1-5之间")
        return value
