# 🚀 快速参考手册

## 常用命令速查表

### 📊 数据验证
```bash
# 检查数据库与标准数据集是否一致
python manage.py verify_teachers

# 使用自定义 JSON 文件验证
python manage.py verify_teachers --json-file custom_data.json
```

**何时使用：** 每天开发前、拉取代码后、提交代码前

### 🔄 数据同步
```bash
# 更新模式（推荐）- 更新现有，添加缺失
python manage.py sync_teachers --mode update --backup

# 重置模式 - 完全匹配标准数据集
python manage.py sync_teachers --mode reset --backup

# 合并模式 - 保留额外的教师
python manage.py sync_teachers --mode merge --backup
```

**何时使用：** verify_teachers 发现差异后

### 📤 数据导出
```bash
# 导出当前数据库数据
python manage.py export_teachers --output my_backup.json

# 更新标准数据集
python manage.py export_teachers --output teachers_data_final.json --overwrite
```

**何时使用：** 分享测试数据、备份数据、更新标准数据集

### 📥 数据导入
```bash
# 从标准数据集导入
python manage.py import_teachers

# 从自定义文件导入
python manage.py import_teachers --json-file custom_data.json
```

**何时使用：** 首次设置（setup_database.py 会自动执行）

## 🔥 常见场景快速解决

### 场景 1：刚拉取代码，不确定数据是否同步
```bash
git pull
python manage.py migrate
python manage.py verify_teachers
# 如果有差异：
python manage.py sync_teachers --mode update --backup
```

### 场景 2：在管理端添加了测试教师，想分享给团队
```bash
# 导出当前数据
python manage.py export_teachers --output team_test_data.json

# 提交到版本控制
git add team_test_data.json
git commit -m "Add test teachers: XXX, YYY"
git push

# 通知团队成员运行：
# python manage.py import_teachers --json-file team_test_data.json
```

### 场景 3：数据混乱了，想重置为标准状态
```bash
# 先备份（以防万一）
python manage.py export_teachers --output my_backup.json

# 完全重置
python manage.py sync_teachers --mode reset --backup

# 验证
python manage.py verify_teachers
```

### 场景 4：更新标准数据集
```bash
# 导出当前数据库为新的标准数据集
python manage.py export_teachers --output teachers_data_final.json --overwrite

# 提交更新
git add teachers_data_final.json
git commit -m "Update standard dataset: Add 2 new teachers"
git push
```

### 场景 5：新成员首次设置
```bash
# 1. 克隆和设置
git clone <repo-url>
cd RateMyProf_OBU/backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 2. 初始化数据库（会自动导入数据）
python setup_database.py

# 3. 验证数据
python manage.py verify_teachers
# 应该看到：✅ 完美！数据库与 JSON 文件完全一致
```

## 🎨 命令输出解读

### ✅ 绿色 - 一切正常
```
✅ 完美！数据库与 JSON 文件完全一致
```
**含义：** 无需任何操作

### ⚠️ 黄色 - 有差异但不严重
```
⚠️ 数据库中额外的教师 (2):
   - 张三
   - 李四
```
**含义：** 你添加了一些教师，决定是保留还是重置

### ❌ 红色 - 严重不一致
```
❌ 数据库中缺失的教师 (10):
   - ...
```
**含义：** 需要立即同步数据

## 📊 模式选择指南

| 情况 | 推荐模式 | 命令 |
|------|---------|------|
| 数据库缺少教师 | `update` | `sync_teachers --mode update` |
| 数据内容不一致 | `update` | `sync_teachers --mode update` |
| 有意添加了测试教师 | `merge` | `sync_teachers --mode merge` |
| 想完全匹配标准数据集 | `reset` | `sync_teachers --mode reset` |
| 数据严重混乱 | `reset` | `sync_teachers --mode reset` |

## ⚡ 每日工作流

### 开始开发前（2分钟）
```bash
cd RateMyProf_OBU/backend
source venv/bin/activate
git pull
python manage.py migrate
python manage.py verify_teachers
# 如有需要：python manage.py sync_teachers --mode update
python manage.py runserver
```

### 提交代码前（1分钟）
```bash
python manage.py verify_teachers
# 如果有意修改了数据：
# python manage.py export_teachers --output teachers_data_final.json --overwrite
# git add teachers_data_final.json
git status
git add .
git commit -m "..."
git push
```

## 🔔 记住这些原则

1. **经常验证** - `verify_teachers` 应该是你的好朋友
2. **总是备份** - 使用 `--backup` 标志，安全第一
3. **沟通变更** - 修改标准数据集前通知团队
4. **测试隔离** - 临时测试数据不提交到版本控制
5. **数据库优先** - 数据库是真相，JSON 是快照

## 💡 快捷命令别名（可选）

在 `~/.zshrc` 或 `~/.bashrc` 中添加：

```bash
# RateMyProf 快捷命令
alias rmp-verify='python manage.py verify_teachers'
alias rmp-sync='python manage.py sync_teachers --mode update --backup'
alias rmp-reset='python manage.py sync_teachers --mode reset --backup'
alias rmp-export='python manage.py export_teachers'
alias rmp-backup='python manage.py export_teachers --output backup_$(date +%Y%m%d).json'
```

使用方式：
```bash
cd backend
source venv/bin/activate
rmp-verify    # 验证
rmp-sync      # 同步
rmp-backup    # 备份
```

## 📚 更多信息

- 完整工作流程：查看 `TEAM_WORKFLOW.md`
- 数据管理原理：查看 `DATA_MANAGEMENT_GUIDE.md`
- 系统架构：查看 `ARCHITECTURE.md`
- 项目说明：查看 `README.md`

## 🆘 紧急救援

**数据全乱了怎么办？**
```bash
# 1. 不要慌！先停止服务器
# Ctrl+C

# 2. 尝试恢复到标准状态
python manage.py sync_teachers --mode reset --backup

# 3. 如果还是不行，重建数据库
python manage.py flush --noinput
python manage.py migrate
python setup_database.py

# 4. 寻求帮助
# 联系团队或查看文档
```

**不小心删除了重要教师怎么办？**
```bash
# 1. 检查是否有备份文件
ls -la teachers_backup_*.json

# 2. 从最近的备份恢复
python manage.py import_teachers --json-file teachers_backup_YYYYMMDD_HHMMSS.json

# 3. 如果没有备份，从 Git 历史恢复
git log teachers_data_final.json
git checkout <commit-hash> -- teachers_data_final.json
python manage.py sync_teachers --mode reset
```

---

**提示：** 将此文件添加到浏览器书签或打印出来，随时查阅！

