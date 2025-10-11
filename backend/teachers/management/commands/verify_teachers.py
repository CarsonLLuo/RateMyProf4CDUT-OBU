"""
验证当前数据库中的教师数据是否与参考 JSON 文件一致
用于确保团队成员之间的数据库数据同步
"""
import json
import os
from django.core.management.base import BaseCommand
from django.conf import settings
from teachers.models import Teacher


class Command(BaseCommand):
    help = '验证数据库中的教师数据是否与 JSON 文件一致'

    def add_arguments(self, parser):
        parser.add_argument(
            '--json-file',
            type=str,
            default='teachers_data_final.json',
            help='参考 JSON 文件路径'
        )
        parser.add_argument(
            '--strict',
            action='store_true',
            help='严格模式：数据必须完全一致（包括顺序）'
        )

    def handle(self, *args, **options):
        json_file = options['json_file']
        strict = options['strict']
        
        # 如果是相对路径，从项目根目录读取
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
        
        self.stdout.write(f'📋 验证教师数据: {json_file}')
        self.stdout.write('━' * 60)
        
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
        
        # 获取数据库中的教师
        db_teachers = list(Teacher.objects.all().order_by('name'))
        
        # 基本统计
        json_count = len(json_teachers)
        db_count = len(db_teachers)
        
        self.stdout.write(f'\n📊 数据统计:')
        self.stdout.write(f'   JSON 文件: {json_count} 位教师')
        self.stdout.write(f'   数据库:   {db_count} 位教师')
        
        # 检查数量是否一致
        if json_count != db_count:
            self.stdout.write(
                self.style.WARNING(
                    f'\n⚠️  数量不一致: JSON({json_count}) vs 数据库({db_count})'
                )
            )
        
        # 创建名称到教师的映射
        json_teachers_map = {t['name']: t for t in json_teachers}
        db_teachers_map = {t.name: t for t in db_teachers}
        
        # 检查差异
        json_names = set(json_teachers_map.keys())
        db_names = set(db_teachers_map.keys())
        
        missing_in_db = json_names - db_names
        extra_in_db = db_names - json_names
        common_names = json_names & db_names
        
        # 报告缺失的教师
        if missing_in_db:
            self.stdout.write(
                self.style.ERROR(
                    f'\n❌ 数据库中缺失的教师 ({len(missing_in_db)}):'
                )
            )
            for name in sorted(missing_in_db):
                self.stdout.write(f'   - {name}')
        
        # 报告额外的教师
        if extra_in_db:
            self.stdout.write(
                self.style.WARNING(
                    f'\n⚠️  数据库中额外的教师 ({len(extra_in_db)}):'
                )
            )
            for name in sorted(extra_in_db):
                self.stdout.write(f'   - {name}')
        
        # 检查共同教师的详细信息
        mismatches = []
        for name in sorted(common_names):
            json_teacher = json_teachers_map[name]
            db_teacher = db_teachers_map[name]
            
            differences = []
            
            # 检查简介
            if json_teacher.get('bio', '') != db_teacher.bio:
                differences.append('简介不同')
            
            # 检查详情 URL
            if json_teacher.get('detail_url', '') != db_teacher.detail_url:
                differences.append('详情URL不同')
            
            if differences:
                mismatches.append((name, differences))
        
        if mismatches:
            self.stdout.write(
                self.style.WARNING(
                    f'\n⚠️  数据内容不一致的教师 ({len(mismatches)}):'
                )
            )
            for name, diffs in mismatches:
                self.stdout.write(f'   • {name}:')
                for diff in diffs:
                    self.stdout.write(f'     - {diff}')
        
        # 最终结果
        self.stdout.write('\n' + '━' * 60)
        
        if not missing_in_db and not extra_in_db and not mismatches:
            self.stdout.write(
                self.style.SUCCESS(
                    '✅ 完美！数据库与 JSON 文件完全一致'
                )
            )
            self.stdout.write(
                self.style.SUCCESS(
                    f'   共有 {len(common_names)} 位教师，数据完全匹配'
                )
            )
        else:
            self.stdout.write(
                self.style.WARNING('⚠️  数据库与 JSON 文件存在差异')
            )
            self.stdout.write('\n💡 建议操作:')
            
            if missing_in_db:
                self.stdout.write(
                    '   1. 重新导入数据: python manage.py import_teachers'
                )
            
            if extra_in_db:
                self.stdout.write(
                    '   2. 导出当前数据: python manage.py export_teachers --output current_data.json'
                )
                self.stdout.write(
                    '   3. 与团队确认哪个是正确的数据源'
                )
            
            if mismatches:
                self.stdout.write(
                    '   4. 检查数据是否被手动修改'
                )
                self.stdout.write(
                    '   5. 确定是保留数据库版本还是重新导入'
                )
        
        # 生成详细报告（可选）
        self.stdout.write(f'\n📝 详细信息:')
        self.stdout.write(f'   - 匹配的教师: {len(common_names)}')
        self.stdout.write(f'   - 缺失的教师: {len(missing_in_db)}')
        self.stdout.write(f'   - 额外的教师: {len(extra_in_db)}')
        self.stdout.write(f'   - 内容不一致: {len(mismatches)}')

