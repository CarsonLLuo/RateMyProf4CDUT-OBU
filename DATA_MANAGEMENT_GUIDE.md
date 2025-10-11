# 数据管理指南

## 📚 概述

本项目采用**数据库优先**的设计理念。JSON 文件仅用于初始化和迁移，不作为运行时数据存储。

## 🎯 核心原则

### ✅ 推荐做法

1. **数据库是唯一真相源**
   - 所有 CRUD 操作通过管理端 → 直接修改数据库
   - 应用运行时只读取数据库数据

2. **JSON 文件的正确用途**
   - 项目初始化时导入示例数据
   - 团队间共享测试数据集
   - 数据迁移和版本回滚的参考

3. **协同开发**
   - 提交迁移文件（migrations）到版本控制
   - 不提交数据库文件（db.sqlite3）
   - 按需导出和导入测试数据

### ❌ 避免的做法

1. ❌ 期望管理端修改会自动更新 JSON 文件
2. ❌ 手动编辑 JSON 文件来"更新"数据
3. ❌ 将数据库文件提交到 Git
4. ❌ 在生产环境使用 JSON 文件作为数据源

## 🛠️ 常用命令

### 导入数据

```bash
# 使用默认路径导入（setup_database.py 中自动执行）
python manage.py import_teachers

# 从自定义路径导入
python manage.py import_teachers \
  --json-file /path/to/custom_teachers.json \
  --photos-dir /path/to/photos/
```

### 导出数据

```bash
# 导出到默认文件名（teachers_data_export.json）
python manage.py export_teachers

# 导出到自定义文件名
python manage.py export_teachers --output my_teachers.json

# 覆盖已存在的文件
python manage.py export_teachers \
  --output teachers_data_final.json \
  --overwrite
```

## 📋 典型工作流程

### 场景 1：新团队成员加入

```bash
# 1. 克隆项目
git clone <repository-url>
cd RateMyProf_OBU

# 2. 设置后端
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# 3. 初始化数据库（会自动导入 teachers_data_final.json）
python setup_database.py

# 4. 设置管理员密码
python manage.py changepassword admin

# 5. 启动服务器
python manage.py runserver
```

### 场景 2：开发者 A 添加了测试数据

```bash
# 开发者 A 在管理端添加了 5 个新教师
# 决定将这些数据分享给团队

# 1. 导出当前数据
python manage.py export_teachers --output team_test_data.json

# 2. 提交到版本控制
git add team_test_data.json
git commit -m "Add test data: 5 new teachers for testing"
git push
```

### 场景 3：开发者 B 使用测试数据

```bash
# 1. 拉取最新代码
git pull

# 2. 备份当前数据（可选）
python manage.py export_teachers --output my_backup.json

# 3. 重置并导入团队测试数据
python manage.py flush --noinput  # ⚠️ 谨慎：清空数据库
python manage.py migrate
python manage.py import_teachers --json-file team_test_data.json

# 4. 创建必要的用户
python manage.py createsuperuser
```

### 场景 4：准备生产环境部署

```bash
# 1. 导出种子数据（如果需要）
python manage.py export_teachers --output production_seed_data.json

# 2. 在生产服务器上
python manage.py migrate
python manage.py import_teachers --json-file production_seed_data.json
python manage.py createsuperuser

# 3. 设置定期备份
# 使用 mysqldump 或数据库提供商的备份工具
mysqldump -u user -p ratemyprofessor > backup_$(date +%Y%m%d).sql
```

### 场景 5：数据库损坏或需要回滚

```bash
# 1. 停止应用服务器

# 2. 恢复数据库到干净状态
python manage.py flush --noinput
python manage.py migrate

# 3. 从最近的导出文件恢复数据
python manage.py import_teachers --json-file teachers_data_final.json

# 4. 或从 SQL 备份恢复
mysql -u user -p ratemyprofessor < backup_20231015.sql
```

## 🔄 数据同步策略

### 开发环境

```mermaid
开发者 A                       Git                    开发者 B
    │                           │                          │
    │ 1. 修改数据库              │                          │
    │ 2. export_teachers         │                          │
    │ 3. git commit + push  ────→│                          │
    │                           │  4. git pull        ←────│
    │                           │  5. import_teachers      │
    │                           │  6. 数据同步完成          │
```

### 生产环境

```
生产数据库 → [定期备份] → 备份存储
     ↓
  [监控]
     ↓
 [异常恢复]
```

## 📝 最佳实践检查清单

开发阶段：
- [ ] .gitignore 包含 `db.sqlite3` 和备份文件
- [ ] 提交迁移文件到版本控制
- [ ] 不提交个人数据库文件
- [ ] 使用 `export_teachers` 分享测试数据

协同工作：
- [ ] 文档化自定义的测试数据集
- [ ] 在 README 中说明如何导入团队数据
- [ ] 定期同步数据库架构（migrations）
- [ ] 沟通数据库结构的重大变更

部署阶段：
- [ ] 使用环境变量配置数据库连接
- [ ] 设置自动备份策略
- [ ] 准备灾难恢复计划
- [ ] 使用专业的数据库管理工具（而非 JSON 文件）

## 🆘 常见问题

### Q: 为什么管理端添加教师后，JSON 文件没有更新？

**A:** 这是设计的行为，不是 bug。JSON 文件只是**种子数据**，不是运行时存储。如果需要导出最新数据，使用 `python manage.py export_teachers` 命令。

### Q: 如何与团队共享我添加的测试数据？

**A:** 
```bash
# 1. 导出数据
python manage.py export_teachers --output team_data.json

# 2. 提交到 Git
git add team_data.json
git commit -m "Add team test data"
git push
```

### Q: 新加入的开发者如何获得最新数据？

**A:**
```bash
# 方法 1: 使用团队共享的测试数据
git pull
python manage.py import_teachers --json-file team_data.json

# 方法 2: 使用数据库备份（推荐用于生产数据）
# 从团队获取数据库备份文件，然后恢复
```

### Q: 生产环境应该如何备份数据？

**A:** 不要依赖 JSON 文件！使用专业工具：
- MySQL: `mysqldump` 或云服务商的自动备份
- PostgreSQL: `pg_dump`
- 云数据库: 使用服务商提供的备份功能
- 设置定期自动备份任务（cron job）

### Q: 能否让管理端自动更新 JSON 文件？

**A:** 技术上可以，但**强烈不推荐**，原因：
- JSON 文件不适合高频写入
- 增加系统复杂度
- 可能导致数据冲突
- 违背"数据库为单一真相源"的原则

如果确实需要实时导出，建议：
1. 使用数据库的主从复制
2. 设置定时任务定期导出
3. 使用消息队列异步导出

## 📚 相关资源

- [Django 官方文档 - 数据迁移](https://docs.djangoproject.com/en/stable/topics/migrations/)
- [Django 官方文档 - Fixtures](https://docs.djangoproject.com/en/stable/howto/initial-data/)
- [数据库备份最佳实践](https://www.postgresql.org/docs/current/backup.html)

## 📞 获得帮助

如果遇到数据管理相关的问题：
1. 检查本指南的"常见问题"部分
2. 查看项目 README.md 的"数据管理与协同开发"章节
3. 提交 Issue 到项目仓库

