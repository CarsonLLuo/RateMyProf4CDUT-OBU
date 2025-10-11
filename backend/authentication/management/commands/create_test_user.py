from django.core.management.base import BaseCommand
from django.contrib.auth.models import User, Group
from authentication.models import UserProfile

class Command(BaseCommand):
    help = '创建测试用户（包含明文密码）'

    def add_arguments(self, parser):
        parser.add_argument('username', type=str, help='用户名')
        parser.add_argument('password', type=str, help='密码')
        parser.add_argument('--admin', action='store_true', help='创建管理员用户')
        parser.add_argument('--student-id', type=str, help='学号（仅学生用户）')

    def handle(self, *args, **options):
        username = options['username']
        password = options['password']
        is_admin = options.get('admin', False)
        student_id = options.get('student_id')
        
        # 检查用户是否已存在
        if User.objects.filter(username=username).exists():
            self.stdout.write(
                self.style.ERROR(f'用户 {username} 已存在')
            )
            return
        
        # 创建用户
        user = User.objects.create_user(
            username=username,
            password=password,
            email=f'{username}@cdut-obu.edu.cn'
        )
        
        # 如果是管理员，添加到管理员组
        if is_admin:
            admin_group, _ = Group.objects.get_or_create(name='管理员')
            user.groups.add(admin_group)
            user.is_staff = True
            user.save()
        
        # 创建用户资料
        profile = UserProfile.objects.create(
            user=user,
            plain_password=password,
            student_id=student_id if not is_admin else None
        )
        
        user_type = '管理员' if is_admin else '学生'
        self.stdout.write(
            self.style.SUCCESS(
                f'已创建{user_type}用户: {username} (密码: {password})'
                + (f' 学号: {student_id}' if student_id else '')
            )
        )

