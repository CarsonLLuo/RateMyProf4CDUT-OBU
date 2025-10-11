from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from authentication.models import UserProfile

class Command(BaseCommand):
    help = '更新现有用户的明文密码'

    def handle(self, *args, **options):
        # 更新现有用户的明文密码
        updated_count = 0
        
        # 查找所有用户
        for user in User.objects.all():
            try:
                profile = UserProfile.objects.get(user=user)
                if not profile.plain_password:
                    # 为已知的测试用户设置明文密码
                    if user.username == 'admin':
                        profile.plain_password = 'admin123'
                        profile.save()
                        updated_count += 1
                        self.stdout.write(f'已更新管理员用户 {user.username} 的明文密码')
                    elif user.username == 'student':
                        profile.plain_password = 'student123'
                        profile.save()
                        updated_count += 1
                        self.stdout.write(f'已更新学生用户 {user.username} 的明文密码')
                    else:
                        # 对于其他用户，可以设置默认密码或跳过
                        self.stdout.write(f'跳过用户 {user.username}，无法确定原始密码')
            except UserProfile.DoesNotExist:
                # 为没有用户资料的用户创建资料
                if user.username == 'admin':
                    UserProfile.objects.create(
                        user=user,
                        plain_password='admin123'
                    )
                    updated_count += 1
                    self.stdout.write(f'为管理员用户 {user.username} 创建了用户资料')
                elif user.username == 'student':
                    UserProfile.objects.create(
                        user=user,
                        student_id='2023001',
                        plain_password='student123'
                    )
                    updated_count += 1
                    self.stdout.write(f'为学生用户 {user.username} 创建了用户资料')
                else:
                    # 为其他用户创建空资料
                    UserProfile.objects.create(user=user)
                    self.stdout.write(f'为用户 {user.username} 创建了空用户资料')
        
        self.stdout.write(
            self.style.SUCCESS(f'\n完成！共更新了 {updated_count} 个用户的明文密码')
        )

