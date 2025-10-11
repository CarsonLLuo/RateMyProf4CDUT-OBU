# RateMyProf for CDUT-OBU

> **我们相信，信息应该自由流动，而非困于孤岛。**
> **我们相信，经验应该得以传承，而非随毕业消散。**


本项目因此诞生。它不仅仅是一个工具，更旨在成为 **OBU 学子共同的知识库与记忆传承**。在这里，我们的每一次分享，都在为这个社区贡献一份力量；我们的每一次客观评价，都在为后来者点亮一盏指路的明灯。

我们邀请你，成为这束光的一部分。

灵感来源于 [Rate My Professors](https://www.ratemyprofessors.com/)，并针对 OBU 的教学环境进行了定制。

## ✨ 主要功能

- **教师信息**：集中展示教师的学术背景、教授课程和综合评分。
- **学生评价**：学生可以对教师进行多维度（如难度、课程质量）匿名评价和打分。
- **课程标签**：通过标签系统（如“评分严”、“干货多”）快速了解教师风格。
- **搜索与筛选**：支持按教师姓名、课程或学院进行快速查找。
- **数据统计**：提供教师平均分、重修率等可视化数据。
- **管理员后台**：为管理员提供对教师、评价、用户的完整 CRUD (增删改查) 功能。

## 🛠️ 技术栈

| 类别 | 技术 |
| :--- | :--- |
| **后端** | Django, Django REST Framework, Simple JWT |
| **前端** | React, TypeScript, Material-UI (MUI) |
| **数据库** | MySQL 8.0 |
| **开发工具** | Python 3.9+, Node.js 16+, Git |

## 🚀 环境准备

在开始之前，请确保你的开发环境中安装了以下软件：

- **Python 3.9+** 及 Pip
- **Node.js 16+** 及 Npm
- **MySQL 8.0+**
- **Git**

## 🔧 安装与启动

#### 1. 克隆项目

```bash
git clone https://github.com/CarsonLLuo/RateMyProf4CDUT-OBU.git
cd RateMyProf4CDUT-OBU
```

#### 2. 后端设置

后端服务基于 Django 构建。

```bash
# 1. 进入后端目录
cd backend

# 2. 创建并激活 Python 虚拟环境
python -m venv venv
source venv/bin/activate  # macOS/Linux
# venv\Scripts\activate   # Windows

# 3. 安装依赖
pip install -r requirements.txt

# 4. 设置数据库
#    - 请确保 MySQL 服务已启动
#    - 在 MySQL 中手动创建一个数据库，例如 'ratemyprofessor'
#      CREATE DATABASE ratemyprofessor CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
#    - (可选) 如果你的 MySQL 用户名或密码不是默认的 'root'/''，请在 backend/ratemyprofessor/settings.py 中修改。

# 5. 运行自动化设置脚本
#    该脚本将执行数据库迁移、导入初始教师数据、并创建一个名为 'admin' 的超级用户。
python setup_database.py

# 6. 为管理员设置密码 (关键步骤!)
#    上一步创建的 'admin' 用户默认没有密码，请使用以下命令为其设置密码。
python manage.py changepassword admin

# 7. 启动后端开发服务器
python manage.py runserver
```
后端 API 将运行在 `http://localhost:8000`。

#### 3. 前端设置

前端应用基于 React 和 TypeScript。

```bash
# 1. (在项目根目录) 进入前端目录
cd frontend

# 2. 安装依赖
npm install

# 3. 启动前端开发服务器
npm start
```
前端应用将运行在 `http://localhost:3000` 并自动打开浏览器。

## 🔑 管理员访问

- **后台地址**: [http://localhost:8000/admin/](http://localhost:8000/admin/)
- **用户名**: `admin`
- **密码**: (您在 `changepassword` 步骤中设置的密码)

## 📁 项目结构

```
RateMyProf_OBU/
├── backend/                # Django 后端
│   ├── authentication/     # 用户认证应用
│   ├── reviews/            # 评价应用
│   ├── teachers/           # 教师应用
│   ├── ratemyprofessor/    # 项目主配置
│   ├── requirements.txt    # 后端依赖
│   └── manage.py
├── frontend/               # React + TypeScript 前端
│   ├── src/
│   │   ├── components/     # 可复用组件
│   │   ├── hooks/          # 自定义 Hooks
│   │   ├── pages/          # 页面级组件
│   │   ├── services/       # API 请求服务
│   │   └── types/          # TypeScript 类型定义
│   └── package.json
├── teacher_photos/         # 教师照片资源
└── README.md
```

## 📊 数据管理与协同开发

### 数据流架构

```
初始数据 (JSON)  →  [一次性导入]  →  数据库 (MySQL)  →  [运行时] →  应用
     ↑                                    ↓
     └────────────── [按需导出] ──────────┘
```

### 重要概念

1. **数据库是唯一的数据源（Single Source of Truth）**
   - `teachers_data_final.json` 仅用于初始化数据和版本控制
   - 管理端的所有 CRUD 操作只修改数据库
   - 应用运行时始终从数据库读取数据

2. **JSON 文件的作用**
   - ✅ 提供初始示例数据
   - ✅ 方便新开发者快速启动项目
   - ✅ 作为数据迁移的参考
   - ❌ **不是**运行时数据存储
   - ❌ **不会**自动同步管理端的修改

### 数据管理命令

```bash
# 验证数据一致性（⭐ 推荐经常使用）
python manage.py verify_teachers

# 同步数据（当发现不一致时）
python manage.py sync_teachers --mode update --backup

# 导入教师数据（首次设置或重置时）
python manage.py import_teachers

# 导出教师数据到 JSON（用于备份或迁移）
python manage.py export_teachers --output teachers_backup.json

# 覆盖已存在的文件
python manage.py export_teachers --output teachers_data_final.json --overwrite
```

💡 **快速参考：** 查看 [QUICK_REFERENCE.md](QUICK_REFERENCE.md) 了解所有常用命令

### 🔍 数据一致性保障

为确保团队成员的数据库数据一致，项目提供了强大的验证和同步工具：

```bash
# 每次开发前执行（推荐）
python manage.py verify_teachers

# 如果发现数据不一致
python manage.py sync_teachers --mode update --backup
```

**详细指南：**
- 📘 [团队协作工作流程](TEAM_WORKFLOW.md) - 完整的团队开发指南
- 📗 [快速参考手册](QUICK_REFERENCE.md) - 常用命令速查表  
- 📕 [数据管理指南](DATA_MANAGEMENT_GUIDE.md) - 深入理解数据管理
- 📙 [系统架构说明](ARCHITECTURE.md) - 了解系统设计原理

### 协同开发最佳实践

#### 场景 1：新开发者加入团队
```bash
# 1. 克隆代码仓库
git clone <repo-url>

# 2. 安装依赖并初始化数据库
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python setup_database.py

# 3. 数据已从 teachers_data_final.json 自动导入
```

#### 场景 2：需要共享测试数据
```bash
# 开发者 A：导出当前数据库数据
python manage.py export_teachers --output test_data.json --overwrite

# 提交到版本控制
git add test_data.json
git commit -m "Add test data with new teachers"
git push

# 开发者 B：导入新的测试数据
git pull
python manage.py flush  # 清空数据库（谨慎使用！）
python manage.py import_teachers --json-file test_data.json
```

#### 场景 3：生产环境数据备份
```bash
# 定期导出数据库数据作为备份
python manage.py export_teachers --output backups/teachers_$(date +%Y%m%d).json

# 或者使用 Django 的 dumpdata（推荐，包含所有数据）
python manage.py dumpdata teachers --indent 2 > backups/teachers_$(date +%Y%m%d).json
```

### ⚠️ 注意事项

1. **不要期望 JSON 文件自动更新**
   - 管理端添加/修改教师后，JSON 文件不会改变
   - 这是设计的，不是 bug

2. **数据同步策略**
   - 开发环境：使用 `export_teachers` 命令手动导出
   - 生产环境：使用数据库备份工具（mysqldump）
   - 不要将 `db.sqlite3` 或生产数据库提交到 Git

3. **版本控制**
   - ✅ 提交：JSON 示例数据、数据库迁移文件
   - ❌ 不提交：`db.sqlite3`、数据库备份文件

## 🌐 API 概览

### 教师 (Teachers)
- `GET /api/teachers/`：获取所有教师列表，支持分页和筛选。
- `GET /api/teachers/{id}/`：获取单个教师的详细信息。
- `GET /api/teachers/stats/`：获取教师相关的统计数据。
- `POST /api/teachers/`：创建新教师（需要管理员权限）。
- `PATCH /api/teachers/{id}/`：更新教师信息（需要管理员权限）。
- `DELETE /api/teachers/{id}/`：删除教师（需要管理员权限）。

### 评价 (Reviews)
- `GET /api/reviews/`：获取所有评价，支持按教师 ID 筛选。
- `POST /api/reviews/create/`：为指定教师创建一条新评价。
- `POST /api/reviews/{id}/helpful/`：将一条评价标记为"有用"。

### 认证 (Authentication)
- `POST /api/auth/token/`：用户登录，获取 JWT Token。
- `POST /api/auth/token/refresh/`：刷新 JWT Token。
- `GET /api/auth/user/`：获取当前登录用户的信息。

