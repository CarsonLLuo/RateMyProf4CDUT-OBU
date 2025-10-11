from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class Teacher(models.Model):
    name = models.CharField('姓名', max_length=200)
    bio = models.TextField('简介', blank=True)
    image = models.ImageField('头像', upload_to='teacher_photos/', blank=True, null=True)
    detail_url = models.URLField('详情页面', blank=True)
    original_image_url = models.URLField('原始头像链接', blank=True)
    
    # 统计字段
    total_reviews = models.IntegerField('评价总数', default=0)
    average_rating = models.DecimalField('平均评分', max_digits=3, decimal_places=2, default=0.00)
    difficulty_rating = models.DecimalField('难度评分', max_digits=3, decimal_places=2, default=0.00)
    would_take_again = models.DecimalField('再次选择率', max_digits=5, decimal_places=2, default=0.00)
    
    # 学科标签
    subjects = models.CharField('教授科目', max_length=500, blank=True, help_text='用逗号分隔多个科目')
    department = models.CharField('系别', max_length=200, default='计算机与软件工程')
    
    created_at = models.DateTimeField('创建时间', auto_now_add=True)
    updated_at = models.DateTimeField('更新时间', auto_now=True)

    class Meta:
        verbose_name = '教师'
        verbose_name_plural = '教师'
        ordering = ['-average_rating', '-total_reviews']

    def __str__(self):
        return self.name

    def update_ratings(self):
        """更新教师的评分统计"""
        from reviews.models import Review
        reviews = Review.objects.filter(teacher=self)
        
        if reviews.exists():
            self.total_reviews = reviews.count()
            self.average_rating = reviews.aggregate(
                avg=models.Avg('overall_rating')
            )['avg'] or 0
            self.difficulty_rating = reviews.aggregate(
                avg=models.Avg('difficulty_rating')
            )['avg'] or 0
            
            # 计算再次选择率
            would_take_again_count = reviews.filter(would_take_again=True).count()
            self.would_take_again = (would_take_again_count / self.total_reviews * 100) if self.total_reviews > 0 else 0
        else:
            self.total_reviews = 0
            self.average_rating = 0
            self.difficulty_rating = 0
            self.would_take_again = 0
            
        self.save()
