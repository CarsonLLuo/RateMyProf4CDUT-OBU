"""
同步教师数据：确保数据库与标准数据集一致
支持选择性更新或完全重置
"""
import json
import os
import shutil
from django.core.management.base import BaseCommand
from django.conf import settings
from django.db import transaction
from teachers.models import Teacher


class Command(BaseCommand):
    help = '同步教师数据，确保与团队标准数据集一致'

    def add_arguments(self, parser):
        parser.add_argument(
            '--json-file',
            type=str,
            default='teachers_data_final.json',
            help='标准数据 JSON 文件路径'
        )
        parser.add_argument(
            '--photos-dir',
            type=str,
            default='teacher_photos',
            help='教师照片目录路径'
        )
        parser.add_argument(
            '--mode',
            type=str,
            choices=['reset', 'update', 'merge'],
            default='update',
            help='同步模式: reset(完全重置), update(更新现有), merge(合并新旧)'
        )
        parser.add_argument(
            '--backup',
            action='store_true',
            help='同步前先备份当前数据'
        )

    def handle(self, *args, **options):
        json_file = options['json_file']
        photos_dir = options['photos_dir']
        mode = options['mode']
        backup = options['backup']
        
        # 处理文件路径
        if not os.path.isabs(json_file):
            # backend/teachers/management/commands/ -> backend/ (向上4级) -> project_root (再向上1级)
            project_root = os.path.dirname(
                os.path.dirname(
                    os.path.dirname(
                        os.path.dirname(
                            os.path.dirname(os.path.abspath(__file__))
                        )
                    )
                )
            )
            json_file = os.path.join(project_root, json_file)
            photos_dir = os.path.join(project_root, photos_dir)
        
        self.stdout.write('🔄 开始同步教师数据')
        self.stdout.write(f'   模式: {mode}')
        self.stdout.write(f'   数据源: {json_file}')
        self.stdout.write('━' * 60)
        
        # 备份当前数据
        if backup:
            from datetime import datetime
            backup_file = f'teachers_backup_{datetime.now().strftime("%Y%m%d_%H%M%S")}.json'
            self.stdout.write(f'\n📦 备份当前数据到: {backup_file}')
            self._export_current_data(backup_file)
        
        # 读取 JSON 文件
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                json_teachers = json.load(f)
        except FileNotFoundError:
            self.stdout.write(
                self.style.ERROR(f'❌ 文件未找到: {json_file}')
            )
            return
        except json.JSONDecodeError as e:
            self.stdout.write(
                self.style.ERROR(f'❌ JSON 格式错误: {e}')
            )
            return
        
        # 根据模式执行同步
        if mode == 'reset':
            self._sync_reset(json_teachers, photos_dir)
        elif mode == 'update':
            self._sync_update(json_teachers, photos_dir)
        elif mode == 'merge':
            self._sync_merge(json_teachers, photos_dir)
        
        self.stdout.write('\n' + '━' * 60)
        self.stdout.write(
            self.style.SUCCESS('✅ 同步完成！')
        )

    def _sync_reset(self, json_teachers, photos_dir):
        """完全重置：删除所有现有数据，重新导入"""
        self.stdout.write(
            self.style.WARNING('\n⚠️  Reset 模式：将删除所有现有教师数据')
        )
        
        with transaction.atomic():
            # 删除所有教师
            deleted_count = Teacher.objects.all().delete()[0]
            self.stdout.write(f'   删除了 {deleted_count} 位教师')
            
            # 重新导入
            self._import_teachers(json_teachers, photos_dir)

    def _sync_update(self, json_teachers, photos_dir):
        """更新模式：更新现有教师，添加缺失的"""
        self.stdout.write('\n🔄 Update 模式：更新现有并添加新教师')
        
        updated = 0
        created = 0
        
        with transaction.atomic():
            for teacher_data in json_teachers:
                name = teacher_data.get('name', '')
                if not name:
                    continue
                
                # 准备数据
                data = self._prepare_teacher_data(teacher_data, photos_dir)
                
                # 更新或创建
                teacher, created_flag = Teacher.objects.update_or_create(
                    name=name,
                    defaults=data
                )
                
                if created_flag:
                    created += 1
                else:
                    updated += 1
        
        self.stdout.write(f'   ✓ 更新: {updated} 位')
        self.stdout.write(f'   ✓ 创建: {created} 位')

    def _sync_merge(self, json_teachers, photos_dir):
        """合并模式：保留数据库额外的教师，更新重复的"""
        self.stdout.write('\n🔀 Merge 模式：合并 JSON 数据到现有数据库')
        
        updated = 0
        created = 0
        skipped = 0
        
        json_names = {t['name'] for t in json_teachers if t.get('name')}
        db_names = set(Teacher.objects.values_list('name', flat=True))
        
        kept = len(db_names - json_names)
        
        with transaction.atomic():
            for teacher_data in json_teachers:
                name = teacher_data.get('name', '')
                if not name:
                    continue
                
                data = self._prepare_teacher_data(teacher_data, photos_dir)
                
                try:
                    teacher = Teacher.objects.get(name=name)
                    # 只更新基本字段，保留评分等数据
                    teacher.bio = data['bio']
                    teacher.detail_url = data['detail_url']
                    if data.get('image'):
                        teacher.image = data['image']
                    teacher.save()
                    updated += 1
                except Teacher.DoesNotExist:
                    Teacher.objects.create(name=name, **data)
                    created += 1
        
        self.stdout.write(f'   ✓ 更新: {updated} 位')
        self.stdout.write(f'   ✓ 创建: {created} 位')
        self.stdout.write(f'   ✓ 保留: {kept} 位 (仅存在于数据库)')

    def _prepare_teacher_data(self, teacher_data, photos_dir):
        """准备教师数据"""
        # 处理图片
        local_image_path = teacher_data.get('local_image_path', '')
        image_filename = None
        
        if local_image_path:
            source_image_path = os.path.join(photos_dir, os.path.basename(local_image_path))
            if os.path.exists(source_image_path):
                image_filename = f'teacher_photos/{os.path.basename(local_image_path)}'
                
                # 确保目标目录存在
                media_teacher_photos = os.path.join(settings.MEDIA_ROOT, 'teacher_photos')
                os.makedirs(media_teacher_photos, exist_ok=True)
                
                dest_image_path = os.path.join(settings.MEDIA_ROOT, image_filename)
                try:
                    shutil.copy2(source_image_path, dest_image_path)
                except Exception as e:
                    self.stdout.write(
                        self.style.WARNING(f'⚠️  复制图片失败 {source_image_path}: {e}')
                    )
                    image_filename = None
        
        return {
            'bio': teacher_data.get('bio', ''),
            'image': image_filename if image_filename else '',
            'detail_url': teacher_data.get('detail_url', ''),
            'original_image_url': teacher_data.get('image_url', ''),
            'department': '计算机科学与技术&软件工程',
        }

    def _import_teachers(self, json_teachers, photos_dir):
        """导入教师数据"""
        created = 0
        
        for teacher_data in json_teachers:
            name = teacher_data.get('name', '')
            if not name:
                continue
            
            data = self._prepare_teacher_data(teacher_data, photos_dir)
            Teacher.objects.create(name=name, **data)
            created += 1
        
        self.stdout.write(f'   ✓ 创建: {created} 位教师')

    def _export_current_data(self, output_file):
        """导出当前数据作为备份"""
        teachers = Teacher.objects.all()
        teachers_data = []
        
        for teacher in teachers:
            image_path = ''
            if teacher.image:
                image_filename = os.path.basename(str(teacher.image))
                image_path = f'teacher_photos/{image_filename}'
            
            teachers_data.append({
                'name': teacher.name,
                'bio': teacher.bio,
                'detail_url': teacher.detail_url,
                'local_image_path': image_path,
                'image_url': teacher.original_image_url if hasattr(teacher, 'original_image_url') else '',
            })
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(teachers_data, f, ensure_ascii=False, indent=2)
        
        self.stdout.write(f'   ✓ 已备份 {len(teachers_data)} 位教师')

