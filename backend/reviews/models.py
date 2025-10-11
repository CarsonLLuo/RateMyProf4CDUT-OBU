from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from teachers.models import Teacher


class Review(models.Model):
    COURSE_CHOICES = [
        ('PSP', 'Problem Solving and Programming'),
        ('OOP', 'Object-Oriented Programming'),
        ('AOOP', 'Advanced Object-Oriented Programming'),
        ('SE', 'Software Engineering'),
        ('SAaT', 'Software Analysis and Testing'),
        ('HCI', 'Human-Computer Interaction'),
        ('DevOps', 'DevOps'),
        ('IPD', 'Innovative Product Development'),
        ('ML','Machine Learning'),
        ('SPM', 'Software Project Management'),
        ('DSA','Data Structures and Algorithms'),
        ('IS','Information Systems'),
        ('FCS','Fundamentals of Computing Science'),
        ('FOS','Foundations of Security'),
        ('SDCACPP','Software Development With C and C++'),
        ('SEE','Software Engineering Economics'),
        ('DB','Database'),
        ('WAD','Web Application Development'),
        ('MfC','Mathematics of Computing'),
        ('BCPCN','Basic Communications and PC Networking'),
        ('OTHER', '其他'),
    ]
    
    SEMESTER_CHOICES = [
        ('FALL_2024', '2024秋季学期'),
        ('SPRING_2024', '2024春季学期'),
        ('FALL_2023', '2023秋季学期'),
        ('SPRING_2023', '2023春季学期'),
        ('OTHER', '其他学期'),
    ]
    
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, verbose_name='教师')
    reviewer_name = models.CharField('评价者姓名', max_length=100, blank=True, default='匿名')
    
    # 评分字段
    overall_rating = models.IntegerField('总体评分', 
                                       validators=[MinValueValidator(1), MaxValueValidator(5)])
    difficulty_rating = models.IntegerField('难度评分', 
                                          validators=[MinValueValidator(1), MaxValueValidator(5)])
    would_take_again = models.BooleanField('是否愿意再次选择', default=False)
    
    # 课程信息
    course = models.CharField('课程', max_length=50, choices=COURSE_CHOICES, default='OTHER')
    semester = models.CharField('学期', max_length=50, choices=SEMESTER_CHOICES, default='OTHER')
    
    # 评价内容
    title = models.CharField('评价标题', max_length=200)
    content = models.TextField('评价内容')
    
    # 标签
    tags = models.CharField('标签', max_length=500, blank=True, 
                          help_text='用逗号分隔，如：认真负责,讲解清楚,作业适中')
    
    # 优缺点
    pros = models.TextField('优点', blank=True)
    cons = models.TextField('缺点', blank=True)
    
    # 统计字段
    helpful_count = models.IntegerField('有用投票数', default=0)
    
    # 时间字段
    created_at = models.DateTimeField('创建时间', auto_now_add=True)
    updated_at = models.DateTimeField('更新时间', auto_now=True)
    
    class Meta:
        verbose_name = '评价'
        verbose_name_plural = '评价'
        ordering = ['-created_at']
        
    def __str__(self):
        return f'{self.teacher.name} - {self.title}'
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # 更新教师的评分统计
        self.teacher.update_ratings()
    
    def get_tags_list(self):
        """获取标签列表"""
        if self.tags:
            return [tag.strip() for tag in self.tags.split(',')]
        return []


class ReviewHelpful(models.Model):
    """评价有用投票"""
    review = models.ForeignKey(Review, on_delete=models.CASCADE)
    ip_address = models.GenericIPAddressField('IP地址')
    created_at = models.DateTimeField('投票时间', auto_now_add=True)
    
    class Meta:
        verbose_name = '有用投票'
        verbose_name_plural = '有用投票'
        unique_together = ['review', 'ip_address']  # 防止重复投票
