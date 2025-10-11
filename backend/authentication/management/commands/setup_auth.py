from django.core.management.base import BaseCommand
from django.contrib.auth.models import User, Group
from authentication.models import UserProfile

class Command(BaseCommand):
    help = '设置认证系统的初始数据'

    def handle(self, *args, **options):
        # 创建管理员组
        admin_group, created = Group.objects.get_or_create(name='管理员')
        if created:
            self.stdout.write(self.style.SUCCESS('已创建管理员组'))
        else:
            self.stdout.write('管理员组已存在')

        # 创建测试管理员用户
        admin_user, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@cdut-obu.edu.cn',
                'first_name': '管理员',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        
        if created:
            admin_user.set_password('admin123')
            admin_user.save()
            admin_user.groups.add(admin_group)
            
            # 创建用户资料
            UserProfile.objects.create(
                user=admin_user,
                plain_password='admin123'
            )
            
            self.stdout.write(self.style.SUCCESS('已创建管理员用户: admin (密码: admin123)'))
        else:
            # 确保已存在的管理员用户在管理员组中
            if not admin_user.groups.filter(name='管理员').exists():
                admin_user.groups.add(admin_group)
            self.stdout.write('管理员用户已存在')

        # 创建测试学生用户
        student_user, created = User.objects.get_or_create(
            username='student',
            defaults={
                'email': 'student@cdut-obu.edu.cn',
                'first_name': '学生',
            }
        )
        
        if created:
            student_user.set_password('student123')
            student_user.save()
            
            # 创建用户资料
            UserProfile.objects.create(
                user=student_user,
                student_id='2023001',
                plain_password='student123'
            )
            
            self.stdout.write(self.style.SUCCESS('已创建学生用户: student (密码: student123, 学号: 2023001)'))
        else:
            self.stdout.write('学生用户已存在')

        self.stdout.write(
            self.style.SUCCESS('\n认证系统设置完成！\n'
                             '管理员: admin/admin123\n'
                             '学生: student/student123')
        )
