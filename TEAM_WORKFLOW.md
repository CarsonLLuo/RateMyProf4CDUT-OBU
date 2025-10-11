# 团队协作工作流程

## 🎯 核心目标

**确保所有团队成员的数据库中都有相同的教师数据**

## 📋 标准工作流程

### 1️⃣ 项目初始化（新成员加入）

```bash
# 1. 克隆项目
git clone <repository-url>
cd RateMyProf_OBU

# 2. 后端设置
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# 3. 初始化数据库（自动导入标准数据集）
python setup_database.py

# 4. 验证数据是否正确导入
python manage.py verify_teachers

# 5. 如果验证通过，看到：
# ✅ 完美！数据库与 JSON 文件完全一致
```

### 2️⃣ 日常开发流程

#### 场景 A：开发功能（不涉及数据修改）

```bash
# 1. 拉取最新代码
git pull

# 2. 应用数据库迁移（如果有）
python manage.py migrate

# 3. 验证数据完整性（可选但推荐）
python manage.py verify_teachers

# 4. 开始开发
python manage.py runserver
```

#### 场景 B：修改了教师数据（用于测试）

```bash
# 开发者 A 在管理端添加/修改了教师数据

# 1. 验证当前数据状态
python manage.py verify_teachers
# 会看到：⚠️ 数据库中额外的教师

# 2. 决策：
#    选项 1: 这是临时测试数据 → 不提交
#    选项 2: 这是团队需要的数据 → 导出并提交

# 选项 2 的操作：
# 3. 导出当前数据
python manage.py export_teachers --output team_standard_data.json

# 4. 更新标准数据集（如果需要）
python manage.py export_teachers --output teachers_data_final.json --overwrite

# 5. 提交到版本控制
git add teachers_data_final.json
git commit -m "Update: Add new teacher for XYZ course"
git push

# 6. 通知团队成员同步数据
```

#### 场景 C：获取团队的最新数据

```bash
# 开发者 B 需要同步开发者 A 添加的教师数据

# 1. 拉取最新代码
git pull

# 2. 检查数据差异
python manage.py verify_teachers

# 3. 如果看到差异，同步数据
python manage.py sync_teachers --mode update --backup

# 4. 再次验证
python manage.py verify_teachers
# 应该看到：✅ 完美！数据库与 JSON 文件完全一致
```

### 3️⃣ 数据冲突解决

#### 情况 1：数据库有额外的教师

```bash
# 检查差异
python manage.py verify_teachers

# 输出示例：
# ⚠️ 数据库中额外的教师 (2):
#    - 张三
#    - 李四

# 决策：
# 1. 如果是你自己添加的测试数据 → 删除或导出
# 2. 如果不确定来源 → 导出保存，然后重置

# 选项 1: 保留并分享
python manage.py export_teachers --output my_additions.json
# 与团队讨论是否合并到标准数据集

# 选项 2: 重置为标准数据集
python manage.py sync_teachers --mode reset --backup
```

#### 情况 2：数据库缺少教师

```bash
# 检查差异
python manage.py verify_teachers

# 输出示例：
# ❌ 数据库中缺失的教师 (3):
#    - Muhammad Yasir Mustafa
#    - Aymen Chebira
#    - Joojo Walker

# 解决方案：同步数据
python manage.py sync_teachers --mode update

# 这会添加缺失的教师，保留现有数据
```

#### 情况 3：教师存在但内容不一致

```bash
# 检查差异
python manage.py verify_teachers

# 输出示例：
# ⚠️ 数据内容不一致的教师 (1):
#    • James Blouin:
#      - 简介不同
#      - 详情URL不同

# 决策：
# 1. 如果数据库版本是正确的 → 导出更新标准数据集
# 2. 如果 JSON 版本是正确的 → 重新同步

# 选项 1: 保留数据库版本
python manage.py export_teachers --output teachers_data_final.json --overwrite
git add teachers_data_final.json
git commit -m "Update: Correct bio for James Blouin"

# 选项 2: 使用 JSON 版本
python manage.py sync_teachers --mode update --backup
```

## 🛠️ 命令参考手册

### verify_teachers - 验证数据一致性

```bash
# 基本用法：检查与标准数据集的一致性
python manage.py verify_teachers

# 指定自定义 JSON 文件
python manage.py verify_teachers --json-file custom_data.json

# 严格模式（检查顺序等）
python manage.py verify_teachers --strict
```

**输出解读：**
- ✅ 绿色 = 完全一致，无需操作
- ⚠️ 黄色 = 有差异，需要决策
- ❌ 红色 = 严重不一致，需要立即处理

### sync_teachers - 同步数据

```bash
# Update 模式（推荐）：更新现有，添加缺失
python manage.py sync_teachers --mode update --backup

# Reset 模式：完全重置为标准数据集
python manage.py sync_teachers --mode reset --backup

# Merge 模式：保留数据库额外的教师
python manage.py sync_teachers --mode merge --backup

# 指定自定义数据源
python manage.py sync_teachers \
  --json-file custom_data.json \
  --photos-dir custom_photos/ \
  --mode update
```

**模式说明：**

| 模式 | 说明 | 何时使用 | 风险 |
|------|------|----------|------|
| **update** | 更新现有+添加缺失 | 日常同步 | 低 ⭐ |
| **merge** | 保留数据库额外数据 | 有意添加了测试教师 | 中 ⭐⭐ |
| **reset** | 完全重置 | 数据严重混乱 | 高 ⭐⭐⭐ |

### export_teachers - 导出数据

```bash
# 导出当前数据库数据
python manage.py export_teachers --output my_data.json

# 更新标准数据集
python manage.py export_teachers \
  --output teachers_data_final.json \
  --overwrite
```

### import_teachers - 导入数据

```bash
# 从 JSON 文件导入（会更新或创建）
python manage.py import_teachers

# 指定自定义文件
python manage.py import_teachers \
  --json-file custom_data.json \
  --photos-dir custom_photos/
```

## 📅 定期维护建议

### 每天（开发前）
```bash
git pull
python manage.py migrate
python manage.py verify_teachers  # 快速检查
```

### 每周（团队同步会议时）
```bash
# 1. 检查所有成员的数据状态
python manage.py verify_teachers

# 2. 如果有差异，讨论并决定标准版本
# 3. 更新标准数据集（如果需要）
python manage.py export_teachers --output teachers_data_final.json --overwrite

# 4. 提交更新
git add teachers_data_final.json
git commit -m "Weekly data sync: Update standard dataset"
git push

# 5. 通知所有成员执行
git pull
python manage.py sync_teachers --mode update --backup
```

### 重要里程碑前（如部署前）
```bash
# 1. 确认所有开发环境数据一致
python manage.py verify_teachers

# 2. 导出最终数据集
python manage.py export_teachers --output production_seed_data.json

# 3. 提交到版本控制
git add production_seed_data.json
git commit -m "Production ready: Final teacher dataset"
```

## 🚨 常见问题解决

### Q1: 忘记同步数据就开始开发了

```bash
# 不要慌！先备份当前状态
python manage.py export_teachers --output my_backup.json

# 检查差异
python manage.py verify_teachers

# 如果只是缺少一些教师，更新即可
python manage.py sync_teachers --mode merge --backup

# 如果数据严重不一致，寻求团队帮助
```

### Q2: 不确定数据库里的教师是谁添加的

```bash
# 导出当前数据查看
python manage.py export_teachers --output current_state.json

# 对比标准数据集
python manage.py verify_teachers

# 查看差异后，与团队讨论
```

### Q3: 多人同时修改了教师数据

```bash
# 这是需要避免的情况！
# 解决方案：

# 方案 1: 使用分支隔离
git checkout -b feature/add-teachers
# 在分支上工作，合并前协调

# 方案 2: 明确数据所有权
# 在团队文档中约定：
# - 谁有权修改标准数据集
# - 修改前需要通知团队
# - 使用 Issue 或讨论记录变更

# 方案 3: 使用不同的测试数据集
python manage.py import_teachers --json-file my_test_data.json
# 不提交到版本控制
```

### Q4: 数据验证失败但我确定数据是对的

```bash
# 可能原因：
# 1. JSON 文件本身就是旧版本
# 2. 你有更新的数据

# 解决方案：更新标准数据集
python manage.py export_teachers \
  --output teachers_data_final.json \
  --overwrite

# 提交并通知团队
git add teachers_data_final.json
git commit -m "Update: Refresh standard dataset"
git push

# 在 PR 或团队群中说明变更原因
```

## 📊 最佳实践检查清单

开发开始前：
- [ ] `git pull` 获取最新代码
- [ ] `python manage.py migrate` 更新数据库结构  
- [ ] `python manage.py verify_teachers` 验证数据一致性
- [ ] 如有差异，执行 `sync_teachers`

添加测试数据时：
- [ ] 明确这是临时测试数据还是团队共享数据
- [ ] 如果是共享数据，使用 `export_teachers` 导出
- [ ] 提交前与团队沟通
- [ ] 在 commit message 中清楚说明

提交代码前：
- [ ] 检查是否意外修改了数据库
- [ ] 如果有数据变更，确认是否应该提交
- [ ] 验证 JSON 文件格式正确
- [ ] 更新相关文档

代码审查时：
- [ ] 检查是否包含数据库文件（应该被 .gitignore 排除）
- [ ] 验证 JSON 数据变更的合理性
- [ ] 确认数据变更已通知团队

## 🔐 权限和责任

建议团队明确角色：

**数据管理员**（1-2人）
- 负责维护标准数据集
- 审核数据变更请求
- 定期验证团队数据一致性
- 协调数据冲突解决

**开发人员**
- 保持本地数据与标准数据集同步
- 临时测试数据不提交
- 需要共享数据时提交 PR
- 遵循数据变更审批流程

**新成员**
- 跟随 TEAM_WORKFLOW.md 文档
- 初始化后执行 `verify_teachers`
- 有疑问及时询问
- 不确定时先备份再操作

## 📞 获取帮助

1. 查看本文档的相关章节
2. 运行 `python manage.py <command> --help` 查看命令帮助
3. 查看 `DATA_MANAGEMENT_GUIDE.md` 了解原理
4. 在团队频道提问
5. 提交 Issue 到项目仓库

## 🎓 总结

**核心原则：**
1. 数据库是真相，JSON 是快照
2. 经常验证，及时同步
3. 修改前备份，变更前沟通
4. 标准数据集应该稳定，测试数据应该隔离

**记住这个口诀：**
```
Pull → Migrate → Verify → Sync → Code → Test → Commit
拉取 → 迁移   → 验证   → 同步 → 编码 → 测试 → 提交
```

