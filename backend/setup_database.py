#!/usr/bin/env python
"""
数据库初始化脚本
运行此脚本来设置数据库和导入初始数据
"""
import os
import sys
import django
from django.core.management import execute_from_command_line

def setup_database():
    """设置数据库"""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ratemyprofessor.settings')
    django.setup()
    
    print("🚀 开始设置数据库...")
    
    # 1. 创建数据库迁移文件
    print("📝 创建数据库迁移文件...")
    execute_from_command_line(['manage.py', 'makemigrations'])
    
    # 2. 执行数据库迁移
    print("🗄️  执行数据库迁移...")
    execute_from_command_line(['manage.py', 'migrate'])
    
    # 3. 创建超级管理员用户
    print("👤 创建超级管理员用户...")
    try:
        execute_from_command_line(['manage.py', 'createsuperuser', '--noinput', '--username', 'admin', '--email', 'admin@example.com'])
        print("✅ 超级管理员用户创建成功!")
        print("   用户名: admin")
        print("   密码: 请在Django shell中设置密码")
    except Exception as e:
        print(f"⚠️  创建超级管理员时出错: {e}")
    
    # 4. 导入教师数据
    print("📚 导入教师数据...")
    try:
        execute_from_command_line(['manage.py', 'import_teachers'])
        print("✅ 教师数据导入成功!")
    except Exception as e:
        print(f"⚠️  导入教师数据时出错: {e}")
    
    # 5. 收集静态文件
    print("🎨 收集静态文件...")
    try:
        execute_from_command_line(['manage.py', 'collectstatic', '--noinput'])
        print("✅ 静态文件收集成功!")
    except Exception as e:
        print(f"⚠️  收集静态文件时出错: {e}")
    
    print("\n🎉 数据库设置完成!")
    print("📋 下一步:")
    print("   1. 启动开发服务器: python manage.py runserver")
    print("   2. 访问管理后台: http://127.0.0.1:8000/admin/")
    print("   3. 访问API: http://127.0.0.1:8000/api/teachers/")

if __name__ == '__main__':
    setup_database()
