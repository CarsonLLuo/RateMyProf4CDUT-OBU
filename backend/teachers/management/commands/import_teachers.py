import json
import os
import shutil
from django.core.management.base import BaseCommand
from django.conf import settings
from teachers.models import Teacher


class Command(BaseCommand):
    help = '从JSON文件导入教师数据'

    def add_arguments(self, parser):
        parser.add_argument(
            '--json-file',
            type=str,
            default='/Users/carson/Desktop/code/爬虫/teachers_data_final.json',
            help='教师数据JSON文件路径'
        )
        parser.add_argument(
            '--photos-dir',
            type=str,
            default='/Users/carson/Desktop/code/爬虫/teacher_photos',
            help='教师照片目录路径'
        )

    def handle(self, *args, **options):
        json_file = options['json_file']
        photos_dir = options['photos_dir']
        
        self.stdout.write(f'开始导入教师数据从: {json_file}')
        
        # 确保媒体目录存在
        media_teacher_photos = os.path.join(settings.MEDIA_ROOT, 'teacher_photos')
        os.makedirs(media_teacher_photos, exist_ok=True)
        
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                teachers_data = json.load(f)
            
            created_count = 0
            updated_count = 0
            
            for teacher_data in teachers_data:
                name = teacher_data.get('name', '')
                if not name:
                    self.stdout.write(self.style.WARNING(f'跳过无名称的教师数据'))
                    continue
                
                # 处理图片文件
                local_image_path = teacher_data.get('local_image_path', '')
                image_filename = None
                
                if local_image_path:
                    source_image_path = os.path.join(photos_dir, os.path.basename(local_image_path))
                    if os.path.exists(source_image_path):
                        image_filename = f'teacher_photos/{os.path.basename(local_image_path)}'
                        dest_image_path = os.path.join(settings.MEDIA_ROOT, image_filename)
                        
                        # 复制图片文件
                        try:
                            shutil.copy2(source_image_path, dest_image_path)
                            self.stdout.write(f'复制图片: {image_filename}')
                        except Exception as e:
                            self.stdout.write(self.style.WARNING(f'复制图片失败 {source_image_path}: {e}'))
                            image_filename = None
                
                # 从简介中提取可能的科目信息
                bio = teacher_data.get('bio', '')
                subjects = self.extract_subjects_from_bio(bio)
                
                # 创建或更新教师记录
                teacher, created = Teacher.objects.get_or_create(
                    name=name,
                    defaults={
                        'bio': bio,
                        'image': image_filename if image_filename else '',
                        'detail_url': teacher_data.get('detail_url', ''),
                        'original_image_url': teacher_data.get('image_url', ''),
                        'subjects': subjects,
                        'department': '计算机科学与技术&软件工程',
                    }
                )
                
                if created:
                    created_count += 1
                    self.stdout.write(self.style.SUCCESS(f'创建教师: {name}'))
                else:
                    # 更新现有教师信息
                    teacher.bio = bio
                    if image_filename:
                        teacher.image = image_filename
                    teacher.detail_url = teacher_data.get('detail_url', '')
                    teacher.original_image_url = teacher_data.get('image_url', '')
                    teacher.subjects = subjects
                    teacher.save()
                    updated_count += 1
                    self.stdout.write(self.style.WARNING(f'更新教师: {name}'))
            
            self.stdout.write(
                self.style.SUCCESS(
                    f'导入完成! 创建: {created_count}, 更新: {updated_count}'
                )
            )
            
        except FileNotFoundError:
            self.stdout.write(
                self.style.ERROR(f'文件未找到: {json_file}')
            )
        except json.JSONDecodeError as e:
            self.stdout.write(
                self.style.ERROR(f'JSON文件格式错误: {e}')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'导入过程中发生错误: {e}')
            )
    
    def extract_subjects_from_bio(self, bio):
        """从简介中提取科目信息"""
        subjects = []
        subject_keywords = {
            '人机交互': 'HCI',
            '软件工程': 'SE',
            'DevOps': 'DevOps',
            '面向对象编程': 'OOP',
            '问题解决与编程': 'PSP',
            '软件分析与测试': 'SAaT',
            '创新产品开发': 'IPD',
            '计算数学': 'Mathematics',
            'C++': 'C++',
            'Java': 'Java',
            'Python': 'Python'
        }
        
        for keyword, subject in subject_keywords.items():
            if keyword in bio:
                subjects.append(keyword)
        
        return ', '.join(subjects) if subjects else '计算机相关课程'
