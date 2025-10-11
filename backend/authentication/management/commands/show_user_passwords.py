from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from authentication.models import UserProfile

class Command(BaseCommand):
    help = '显示所有用户的明文密码（用于测试）'

    def handle(self, *args, **options):
        self.stdout.write(
            self.style.SUCCESS('\n=== 用户密码信息 ===')
        )
        
        for user in User.objects.all():
            try:
                profile = UserProfile.objects.get(user=user)
                user_type = '管理员' if user.groups.filter(name='管理员').exists() else '学生'
                
                self.stdout.write(
                    f'用户名: {user.username} | 类型: {user_type} | '
                    f'学号: {profile.student_id or "无"} | '
                    f'明文密码: {profile.plain_password or "未设置"}'
                )
            except UserProfile.DoesNotExist:
                user_type = '管理员' if user.groups.filter(name='管理员').exists() else '学生'
                self.stdout.write(
                    f'用户名: {user.username} | 类型: {user_type} | '
                    f'明文密码: 无用户资料'
                )
        
        self.stdout.write(
            self.style.SUCCESS('\n=== 信息显示完成 ===')
        )

