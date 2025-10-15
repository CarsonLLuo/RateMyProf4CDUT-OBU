<a id="readme-top"></a>

<div align="center">

<h3 align="center">RateMyProf4CDUT-OBU</h3>

<img src="images/logo.png" alt="RateMyProf4CDUT-OBU Logo" width="150" style="margin-bottom: 20px;">

  <p align="center">
    一个为成都理工大学牛津布鲁克斯学院 (CDUT-OBU) 学生量身打造的开源教师评价平台。
    <br />
    <a href="https://github.com/CarsonLLuo/RateMyProf4CDUT-OBU"><strong>探索文档 »</strong></a>
    <br />
  </p>

  <!-- PROJECT SHIELDS -->
[![贡献者][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![问题][issues-shield]][issues-url]
[![许可证][license-shield]][license-url]

  <p align="center">
    <a href="https://github.com/CarsonLLuo/RateMyProf4CDUT-OBU">查看 Demo</a>
    ·
    <a href="https://github.com/CarsonLLuo/RateMyProf4CDUT-OBU/issues/new?labels=bug&template=bug-report---.md">报告 Bug</a>
    ·
    <a href="https://github.com/CarsonLLuo/RateMyProf4CDUT-OBU/issues/new?labels=enhancement&template=feature-request---.md">请求功能</a>
  </p>
</div>

<!-- 目录 -->
<details>
  <summary>目录</summary>
  <ol>
    <li>
      <a href="#-关于项目">关于项目</a>
      <ul>
        <li><a href="#-技术栈">技术栈</a></li>
        <li><a href="#-项目结构">项目结构</a></li>
      </ul>
    </li>
    <li>
      <a href="#-开始使用">开始使用</a>
      <ul>
        <li><a href="#环境要求">环境要求</a></li>
        <li><a href="#安装步骤">安装步骤</a></li>
        <li><a href="#配置">配置</a></li>
      </ul>
    </li>
    <li><a href="#-使用说明">使用说明</a></li>
    <li><a href="#-路线图">路线图</a></li>
    <li><a href="#-贡献">贡献</a></li>
    <li><a href="#-许可证">许可证</a></li>
    <li><a href="#-联系方式">联系方式</a></li>
  </ol>
</details>

<!-- 关于项目 -->
## 📖 关于项目


这是一个为成都理工大学牛津布鲁克斯学院 (CDUT-OBU) 学生量身打造的开源教师评价平台，是知名网站 "Rate My Professors" 的克隆实现。项目旨在提供一个开放、透明的平台，让学生可以分享和查阅关于教师和课程的真实反馈，帮助同学们更好地进行课程选择。

### 主要功能

*   🌟 **教师评分与评论系统**: 学生可以对教师进行多维度评分（如综合体验、课程难度），并发表详细的文字评论和标签。
*   🖥️ **全面的后台管理面板**: 管理员拥有一个功能强大的仪表盘，可以管理教师信息、用户信息和所有评论，确保平台内容的健康与准确。
*   🔍 **高级教师筛选与搜索**: 用户可以根据教师姓名、所授课程、评分等多种条件进行搜索和排序，快速找到目标教师。
*   🔐 **基于角色的用户认证**: 系统区分学生和管理员角色，通过 JWT (JSON Web Tokens) 实现安全认证，保障不同角色的操作权限。
*   🤖 **自动化数据采集**: 项目内置了一个使用 Selenium 和 `undetected-chromedriver` 构建的复杂网络爬虫套件，能够自动化地从学校官网采集教师的初始数据，极大地提高了数据录入效率和准确性。

<p align="right">(<a href="#readme-top">返回顶部</a>)</p>

### 🛠️ 技术栈

本项目采用前后端分离的现代架构，确保了高效的开发和良好的可扩展性。

**前端 (Frontend):**
*   [![React][React.js]][React-url]
*   [![TypeScript]][TypeScript-url]
*   **Material-UI:** 用于构建美观、响应式的用户界面。
*   **Axios:** 用于处理与后端 API 的 HTTP 通信。
*   **React Router:** 用于实现客户端路由。

**后端 (Backend):**
*   [![Python]][Python-url]
*   [![Django]][Django-url]
*   **Django REST Framework:** 用于快速构建强大且灵活的 RESTful API。
*   **Simple JWT:** 用于实现基于 JSON Web Token 的身份验证。
*   [![MySQL]][MySQL-url]
*   **django-cors-headers:** 用于处理跨域资源共享 (CORS)。

<p align="right">(<a href="#readme-top">返回顶部</a>)</p>

### 📁 项目结构

<details>
<summary>点击展开项目结构</summary>

```
RateMyProf_OBU/
├── .gitignore
├── AdminPage.js
├── CDUT.png
├── OBU.png
├── requirements.txt
├── start_frontend.sh
├── teachers_data_final.json
├── frontend/
    ├── AdminPage-with-Hooks-Example.tsx
    ├── package-lock.json
    ├── package.json
    ├── tsconfig.json
    ├── public/
        ├── CDUT.png
        ├── OBU.png
        ├── index.html
        ├── manifest.json
    ├── src/
        ├── App.tsx
        ├── index.tsx
        ├── types/
            ├── index.ts
        ├── utils/
            ├── courseMapping.ts
        ├── components/
            ├── Footer.tsx
            ├── Header.tsx
            ├── ProtectedRoute.tsx
            ├── admin/
                ├── AdminLayout.tsx
                ├── teachers/
                    ├── TeacherDialog.tsx
                    ├── TeacherList.tsx
                    ├── TeacherManagement.tsx
                    ├── TeacherStats.tsx
                ├── shared/
                ├── users/
                    ├── UserDialog.tsx
                    ├── UserFilters.tsx
                    ├── UserList.tsx
                    ├── UserManagement.tsx
                    ├── UserStats.tsx
                ├── reviews/
                    ├── ReviewDialog.tsx
                    ├── ReviewFilters.tsx
                    ├── ReviewList.tsx
                    ├── ReviewManagement.tsx
                    ├── ReviewStats.tsx
        ├── hooks/
            ├── index.ts
            ├── useReviewManagement.ts
            ├── useSnackbar.ts
            ├── useTeacherManagement.ts
            ├── useUserManagement.ts
        ├── pages/
            ├── AddReviewPage.tsx
            ├── AdminPage.tsx
            ├── HomePage.tsx
            ├── LoginPage.tsx
            ├── TeacherDetailPage.tsx
            ├── TeachersPage.tsx
        ├── services/
            ├── api.ts
├── teacher_photos/
    ├── Aymen_Chebira.jpg
    ├── Chiagoziem_Chima_Ukwuoma.jpg
    ├── Emmanuel_Osei-Mensah.jpg
    ├── Grace_Nneji.jpg
    ├── Happy_Nkanta_Monday.jpg
    ├── Irfan_Ullah.jpg
    ├── James_Blouin.jpg
    ├── Joojo_Walker.jpg
    ├── Maged_Fakirah.jpg
    ├── Muhammad_Yasir_Mustafa.jpg
    ├── 徐甘洋_Albert.jpg
    ├── 蒋过_Gore.jpg
    ├── 贾新源_Javier.jpg
├── backend/
    ├── current_data.json
    ├── manage.py
    ├── requirements.txt
    ├── setup_database.py
    ├── ratemyprofessor/
        ├── settings.py
        ├── urls.py
        ├── wsgi.py
    ├── management/
        ├── commands/
    ├── teachers/
        ├── admin.py
        ├── apps.py
        ├── models.py
        ├── serializers.py
        ├── urls.py
        ├── views.py
        ├── migrations/
            ├── 0001_initial.py
            ├── 0002_alter_teacher_would_take_again.py
        ├── management/
            ├── commands/
                ├── export_teachers.py
                ├── import_teachers.py
                ├── sync_teachers.py
                ├── verify_teachers.py
    ├── authentication/
        ├── admin.py
        ├── apps.py
        ├── models.py
        ├── serializers.py
        ├── tests.py
        ├── urls.py
        ├── views.py
        ├── migrations/
            ├── 0001_initial.py
            ├── 0002_userprofile_delete_customuser.py
            ├── 0003_userprofile_plain_password.py
        ├── management/
            ├── commands/
                ├── create_test_user.py
                ├── setup_auth.py
                ├── show_user_passwords.py
                ├── update_plain_passwords.py
    ├── reviews/
        ├── admin.py
        ├── apps.py
        ├── models.py
        ├── serializers.py
        ├── urls.py
        ├── views.py
        ├── migrations/
            ├── 0001_initial.py
```

</details>

<p align="right">(<a href="#readme-top">返回顶部</a>)</p>

<!-- 开始使用 -->
## 🚀 开始使用

按照以下简单步骤，即可在本地设置并运行此项目。

### 环境要求

在开始之前，请确保您的开发环境中已安装以下软件：
*   **Node.js** (v16 或更高版本) 和 **npm**
*   **Python** (v3.8 或更高版本) 和 **pip**
*   **MySQL** 数据库服务

### 安装步骤

1.  **克隆仓库**
    ```sh
    git clone https://github.com/CarsonLLuo/RateMyProf4CDUT-OBU.git
    cd RateMyProf4CDUT-OBU
    ```

2.  **后端设置**
    ```sh
    # 进入后端目录
    cd backend

    # 创建并激活虚拟环境 (推荐)
    python -m venv venv
    source venv/bin/activate  # on Windows, use `venv\Scripts\activate`

    # 安装 Python 依赖
    pip install -r requirements.txt

    # 配置数据库并执行数据库迁移
    # (请先完成下面的“配置”步骤)
    python manage.py migrate
    ```

3.  **前端设置**
    ```sh
    # 进入前端目录
    cd ../frontend

    # 安装 npm 依赖
    npm install
    ```

### 配置

后端配置依赖于环境变量。
1.  在 `backend/` 目录下，创建一个名为 `.env` 的文件。
2.  参考 `backend/ratemyprofessor/settings.py` 文件，将必要的配置项填入 `.env` 文件中，至少需要包括：
    ```env
    SECRET_KEY='your-secret-key'
    DEBUG=True

    # 数据库配置
    DB_NAME='your_db_name'
    DB_USER='your_db_user'
    DB_PASSWORD='your_db_password'
    DB_HOST='127.0.0.1'
    DB_PORT='3306'
    ```
3.  确保您已在 MySQL 中创建了对应的数据库。

<p align="right">(<a href="#readme-top">返回顶部</a>)</p>

<!-- 使用说明 -->
## 💻 使用说明

完成安装和配置后，您可以分别启动后端和前端服务。

1.  **启动后端 API 服务**
    在 `backend/` 目录下运行：
    ```sh
    python manage.py runserver
    ```
    默认情况下，后端服务将在 `http://127.0.0.1:8000` 上运行。

2.  **启动前端开发服务器**
    在 `frontend/` 目录下运行：
    ```sh
    npm start
    ```
    前端应用将在 `http://localhost:3000` 上启动，并会自动在浏览器中打开。

现在，您可以通过浏览器访问应用，注册学生账户，浏览教师信息，提交您的第一条评论！

<p align="right">(<a href="#readme-top">返回顶部</a>)</p>

<!-- 路线图 -->
## 🗺️ 路线图

*   [ ] 增加课程维度的评价和筛选功能
*   [ ] 实现用户间的消息通知系统
*   [ ] 优化移动端的用户体验和界面
*   [ ] 增加数据可视化图表，分析教师评价趋势

查看 [公开的 Issues](https://github.com/CarsonLLuo/RateMyProf4CDUT-OBU/issues) 获取完整的建议功能列表（和已知问题）。

<p align="right">(<a href="#readme-top">返回顶部</a>)</p>

<!-- 贡献 -->
## 🤝 贡献

贡献是使开源社区成为一个学习、激励和创造的奇妙之地的原因。我们**非常感谢**您的任何贡献。

如果您有任何建议希望项目变得更好，请 fork 本仓库并创建一个 pull request。您也可以简单地打开一个带有 “enhancement” 标签的 issue。
别忘了给这个项目点一个 star！再次感谢！

1.  Fork 本项目
2.  创建您的功能分支 (`git checkout -b feature/AmazingFeature`)
3.  提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4.  推送到分支 (`git push origin feature/AmazingFeature`)
5.  打开一个 Pull Request

<p align="right">(<a href="#readme-top">返回顶部</a>)</p>

### 主要贡献者:

- **[Carson Luo](https://github.com/CarsonLLuo)** - 项目创建者和主要开发者

<!-- 许可证 -->
## 🎗 许可证

Copyright © 2024-2025 [RateMyProf4CDUT-OBU][RateMyProf4CDUT-OBU]. <br />
本项目根据 [MIT 许可证][license-url] 发布。

<p align="right">(<a href="#readme-top">返回顶部</a>)</p>

<!-- 联系方式 -->
## 📧 联系方式

邮箱: carsonluo2233@outlook.com

项目链接: [https://github.com/CarsonLLuo/RateMyProf4CDUT-OBU](https://github.com/CarsonLLuo/RateMyProf4CDUT-OBU)

<p align="right">(<a href="#readme-top">返回顶部</a>)</p>

<!-- REFERENCE LINKS -->
[RateMyProf4CDUT-OBU]: https://github.com/CarsonLLuo/RateMyProf4CDUT-OBU
[contributors-shield]: https://img.shields.io/github/contributors/CarsonLLuo/RateMyProf4CDUT-OBU.svg?style=flat-round
[contributors-url]: https://github.com/CarsonLLuo/RateMyProf4CDUT-OBU/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/CarsonLLuo/RateMyProf4CDUT-OBU.svg?style=flat-round
[forks-url]: https://github.com/CarsonLLuo/RateMyProf4CDUT-OBU/network/members
[stars-shield]: https://img.shields.io/github/stars/CarsonLLuo/RateMyProf4CDUT-OBU.svg?style=flat-round
[stars-url]: https://github.com/CarsonLLuo/RateMyProf4CDUT-OBU/stargazers
[issues-shield]: https://img.shields.io/github/issues/CarsonLLuo/RateMyProf4CDUT-OBU.svg?style=flat-round
[issues-url]: https://github.com/CarsonLLuo/RateMyProf4CDUT-OBU/issues
[license-shield]: https://img.shields.io/github/license/CarsonLLuo/RateMyProf4CDUT-OBU.svg?style=flat-round
[license-url]: https://github.com/CarsonLLuo/RateMyProf4CDUT-OBU/blob/master/LICENSE.txt
[Python]: https://img.shields.io/badge/Python-3776AB?style=flat-round&logo=python&logoColor=white
[Python-url]: https://www.python.org/
[TypeScript]: https://img.shields.io/badge/TypeScript-007ACC?style=flat-round&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=flat-round&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Django]: https://img.shields.io/badge/Django-092E20?style=flat-round&logo=django&logoColor=white
[Django-url]: https://www.djangoproject.com/
[MySQL]: https://img.shields.io/badge/MySQL-00000F?style=flat-round&logo=mysql&logoColor=white
[MySQL-url]: https://www.mysql.com/