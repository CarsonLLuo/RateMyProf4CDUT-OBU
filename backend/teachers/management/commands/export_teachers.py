import json
import os
from django.core.management.base import BaseCommand
from django.conf import settings
from teachers.models import Teacher


class Command(BaseCommand):
    help = '导出教师数据到JSON文件'

    def add_arguments(self, parser):
        parser.add_argument(
            '--output',
            type=str,
            default='teachers_data_export.json',
            help='输出的JSON文件路径（相对于项目根目录）'
        )
        parser.add_argument(
            '--overwrite',
            action='store_true',
            help='如果文件已存在，是否覆盖'
        )

    def handle(self, *args, **options):
        output_file = options['output']
        overwrite = options['overwrite']
        
        # 确定输出路径（相对于项目根目录，而不是backend目录）
        project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
        output_path = os.path.join(project_root, output_file)
        
        # 检查文件是否已存在
        if os.path.exists(output_path) and not overwrite:
            self.stdout.write(
                self.style.WARNING(f'文件已存在: {output_path}')
            )
            self.stdout.write(
                self.style.WARNING('使用 --overwrite 参数来覆盖现有文件')
            )
            return
        
        try:
            # 获取所有教师数据
            teachers = Teacher.objects.all().order_by('created_at')
            teachers_data = []
            
            for teacher in teachers:
                # 获取图片的相对路径
                image_path = ''
                if teacher.image:
                    # 从 'teacher_photos/xxx.jpg' 格式提取文件名
                    image_filename = os.path.basename(str(teacher.image))
                    image_path = f'teacher_photos/{image_filename}'
                
                teacher_dict = {
                    'name': teacher.name,
                    'bio': teacher.bio,
                    'detail_url': teacher.detail_url,
                    'local_image_path': image_path,
                }
                
                # 如果有原始图片URL，也导出
                if hasattr(teacher, 'original_image_url') and teacher.original_image_url:
                    teacher_dict['image_url'] = teacher.original_image_url
                
                teachers_data.append(teacher_dict)
            
            # 写入JSON文件
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(teachers_data, f, ensure_ascii=False, indent=2)
            
            self.stdout.write(
                self.style.SUCCESS(
                    f'✅ 成功导出 {len(teachers_data)} 位教师数据到: {output_path}'
                )
            )
            self.stdout.write(
                self.style.SUCCESS(
                    f'📊 导出数据统计:'
                )
            )
            self.stdout.write(f'   - 总教师数: {len(teachers_data)}')
            self.stdout.write(f'   - 输出文件: {output_path}')
            
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'❌ 导出过程中发生错误: {e}')
            )
            import traceback
            traceback.print_exc()

