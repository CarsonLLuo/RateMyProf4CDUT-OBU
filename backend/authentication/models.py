from django.contrib.auth.models import User
from django.db import models

class UserProfile(models.Model):
    """用户扩展信息"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, verbose_name='用户')
    student_id = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        verbose_name='学号'
    )
    plain_password = models.CharField(
        max_length=128,
        blank=True,
        null=True,
        verbose_name='明文密码'
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新时间')
    
    class Meta:
        db_table = 'user_profile'
        verbose_name = '用户资料'
        verbose_name_plural = '用户资料'
    
    def __str__(self):
        return f"{self.user.username}的资料"
    
    @property
    def user_type(self):
        """根据用户组判断用户类型"""
        if self.user.groups.filter(name='管理员').exists():
            return 'admin'
        return 'student'