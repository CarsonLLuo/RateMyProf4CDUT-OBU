import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  IconButton,
  Alert,
  Snackbar,
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  Tabs,
  Tab,
  Rating,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Upload as UploadIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  AdminPanelSettings as AdminIcon,
  School as SchoolIcon,
  RateReview as ReviewIcon,
  Visibility as ViewIcon,
  VisibilityOff as VisibilityOffIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  SupervisorAccount as SupervisorAccountIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { teachersApi, reviewsApi, usersApi } from '../services/api';

const AdminPage = () => {
  // Tab管理
  const [currentTab, setCurrentTab] = useState(0);
  
  // 教师管理状态
  const [teachers, setTeachers] = useState([]);
  const [teachersLoading, setTeachersLoading] = useState(true);
  const [openTeacherDialog, setOpenTeacherDialog] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [teacherFormData, setTeacherFormData] = useState({
    name: '',
    bio: '',
    department: '计算机科学与技术&软件工程',
    subjects: '',
    detail_url: '',
  });
  const [imageFile, setImageFile] = useState(null);
  
  // 评论管理状态
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [reviewFilters, setReviewFilters] = useState({
    teacher: '',
    course: '',
    min_rating: '',
  });
  
  // 用户管理状态
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [userStats, setUserStats] = useState({});
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userFormData, setUserFormData] = useState({
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    email: '',
    user_type: 'student',
    student_id: '',
    is_active: true,
  });
  const [userFilters, setUserFilters] = useState({
    user_type: '',
    search: '',
  });
  const [showPasswords, setShowPasswords] = useState({});
  
  // 通用状态
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // 预定义的课程选项
  // const subjects_choices = [
  //   '问题解决与编程',
  //   '面向对象编程', 
  //   '高级面向对象编程',
  //   '软件工程',
  //   '软件分析与测试',
  //   '人机交互',
  //   'DevOps',
  //   '创新产品开发',
  //   'C++',
  //   'Java',
  //   '计算数学',
  //   '计算机相关课程',
  // ];

  useEffect(() => {
    if (currentTab === 0) {
      loadTeachers();
    } else if (currentTab === 1) {
      loadReviews();
    } else if (currentTab === 2) {
      loadUsers();
      loadUserStats();
    }
  }, [currentTab]);

  // 初始加载
  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      setTeachersLoading(true);
      const response = await teachersApi.getTeachers({ page_size: 100 });
      setTeachers(response.results || []);
    } catch (error) {
      showSnackbar('加载教师列表失败', 'error');
      console.error('Error loading teachers:', error);
    } finally {
      setTeachersLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      setReviewsLoading(true);
      const params = {
        page_size: 100,
        teacher: reviewFilters.teacher || undefined,
        course: reviewFilters.course || undefined,
        min_rating: reviewFilters.min_rating || undefined,
        ordering: '-created_at',
      };
      const response = await reviewsApi.getReviewsForAdmin(params);
      setReviews(response.results || []);
    } catch (error) {
      showSnackbar('加载评论列表失败', 'error');
      console.error('Error loading reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenTeacherDialog = async (teacher = null) => {
    if (teacher) {
      try {
        // 获取完整的教师信息，包括bio等详细字段
        const response = await fetch(`http://localhost:8000/api/teachers/${teacher.id}/`);
        if (response.ok) {
          const fullTeacherData = await response.json();
          setEditingTeacher(fullTeacherData);
          setTeacherFormData({
            name: fullTeacherData.name,
            bio: fullTeacherData.bio || '',
            department: fullTeacherData.department,
            subjects: fullTeacherData.subjects_list ? fullTeacherData.subjects_list.join(', ') : '',
            detail_url: fullTeacherData.detail_url || '',
          });
        } else {
          // 如果获取详情失败，使用列表数据作为备选
          setEditingTeacher(teacher);
          setTeacherFormData({
            name: teacher.name,
            bio: '', // 列表数据没有bio字段
            department: teacher.department,
            subjects: teacher.subjects_list ? teacher.subjects_list.join(', ') : '',
            detail_url: '', // 列表数据没有detail_url字段
          });
          showSnackbar('获取教师详细信息失败，部分字段可能为空', 'warning');
        }
      } catch (error) {
        console.error('Error fetching teacher details:', error);
        // 发生错误时使用列表数据作为备选
        setEditingTeacher(teacher);
        setTeacherFormData({
          name: teacher.name,
          bio: '',
          department: teacher.department,
          subjects: teacher.subjects_list ? teacher.subjects_list.join(', ') : '',
          detail_url: '',
        });
        showSnackbar('获取教师详细信息失败，部分字段可能为空', 'warning');
      }
    } else {
      setEditingTeacher(null);
      setTeacherFormData({
        name: '',
        bio: '',
        department: '计算机科学与技术&软件工程',
        subjects: '',
        detail_url: '',
      });
    }
    setImageFile(null);
    setOpenTeacherDialog(true);
  };

  const handleCloseTeacherDialog = () => {
    setOpenTeacherDialog(false);
    setEditingTeacher(null);
    setImageFile(null);
  };

  const handleTeacherInputChange = (field, value) => {
    setTeacherFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // 验证文件类型
      if (!file.type.startsWith('image/')) {
        showSnackbar('请选择图片文件', 'error');
        return;
      }
      // 验证文件大小 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        showSnackbar('图片大小不能超过5MB', 'error');
        return;
      }
      setImageFile(file);
    }
  };

  const handleSubmit = async () => {
    try {
      // 验证必填字段
      if (!teacherFormData.name.trim()) {
        showSnackbar('教师姓名不能为空', 'error');
        return;
      }

      // 准备表单数据
      const submitData = new FormData();
      submitData.append('name', teacherFormData.name);
      submitData.append('bio', teacherFormData.bio);
      submitData.append('department', teacherFormData.department);
      submitData.append('subjects', teacherFormData.subjects);
      submitData.append('detail_url', teacherFormData.detail_url);
      
      if (imageFile) {
        submitData.append('image', imageFile);
      }

      let response;
      if (editingTeacher) {
        // 更新教师
        response = await fetch(`http://localhost:8000/api/teachers/${editingTeacher.id}/`, {
          method: 'PATCH',
          body: submitData,
        });
      } else {
        // 创建新教师
        response = await fetch('http://localhost:8000/api/teachers/', {
          method: 'POST',
          body: submitData,
        });
      }

      if (response.ok) {
        showSnackbar(
          editingTeacher ? '教师信息更新成功' : '教师创建成功',
          'success'
        );
        handleCloseTeacherDialog();
        loadTeachers();
      } else {
        // 处理错误响应
        let errorMessage = '操作失败';
        try {
          const errorData = await response.json();
          console.error('后端错误详情:', errorData);
          
          if (errorData.detail) {
            errorMessage = errorData.detail;
          } else if (errorData.name) {
            errorMessage = `姓名: ${errorData.name.join(', ')}`;
          } else if (errorData.subjects) {
            errorMessage = `科目: ${errorData.subjects.join(', ')}`;
          } else {
            errorMessage = JSON.stringify(errorData);
          }
        } catch (e) {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        showSnackbar(errorMessage, 'error');
      }
    } catch (error) {
      console.error('Error saving teacher:', error);
      showSnackbar(`网络错误: ${error.message}`, 'error');
    }
  };

  // 评论管理函数
  const handleViewReview = (review) => {
    setSelectedReview(review);
    setOpenReviewDialog(true);
  };

  const handleCloseReviewDialog = () => {
    setOpenReviewDialog(false);
    setSelectedReview(null);
  };

  const handleDeleteReview = async (reviewId, reviewTitle) => {
    if (!window.confirm(`确定要删除评价 "${reviewTitle}" 吗？此操作将影响教师的评分统计。`)) {
      return;
    }

    try {
      await reviewsApi.deleteReview(reviewId);
      showSnackbar('评价删除成功', 'success');
      loadReviews();
      if (currentTab === 0) {
        loadTeachers(); // 刷新教师统计
      }
    } catch (error) {
      showSnackbar('删除失败，请检查网络连接', 'error');
      console.error('Error deleting review:', error);
    }
  };

  const handleReviewFilterChange = (field, value) => {
    setReviewFilters(prev => ({ ...prev, [field]: value }));
  };

  const applyReviewFilters = () => {
    loadReviews();
  };

  const handleDelete = async (teacherId, teacherName) => {
    if (!window.confirm(`确定要删除教师 "${teacherName}" 吗？此操作无法撤销。`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/teachers/${teacherId}/`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showSnackbar('教师删除成功', 'success');
        loadTeachers();
      } else {
        showSnackbar('删除失败', 'error');
      }
    } catch (error) {
      showSnackbar('删除失败，请检查网络连接', 'error');
      console.error('Error deleting teacher:', error);
    }
  };

  // 用户管理函数
  const loadUsers = async () => {
    try {
      setUsersLoading(true);
      const params = {
        page_size: 100,
        user_type: userFilters.user_type || undefined,
        search: userFilters.search || undefined,
      };
      const response = await usersApi.getUsers(params);
      setUsers(response.results || []);
    } catch (error) {
      showSnackbar('加载用户列表失败', 'error');
      console.error('Error loading users:', error);
    } finally {
      setUsersLoading(false);
    }
  };

  const loadUserStats = async () => {
    try {
      const stats = await usersApi.getUserStats();
      setUserStats(stats);
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const handleOpenUserDialog = (user = null) => {
    if (user) {
      setEditingUser(user);
      setUserFormData({
        username: user.username,
        password: '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        user_type: user.user_type,
        student_id: user.student_id || '',
        is_active: user.is_active,
      });
    } else {
      setEditingUser(null);
      setUserFormData({
        username: '',
        password: '',
        first_name: '',
        last_name: '',
        email: '',
        user_type: 'student',
        student_id: '',
        is_active: true,
      });
    }
    setOpenUserDialog(true);
  };

  const handleCloseUserDialog = () => {
    setOpenUserDialog(false);
    setEditingUser(null);
  };

  const handleUserInputChange = (field, value) => {
    setUserFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleUserSubmit = async () => {
    try {
      // 验证必填字段
      if (!userFormData.username.trim()) {
        showSnackbar('用户名不能为空', 'error');
        return;
      }
      if (!editingUser && !userFormData.password.trim()) {
        showSnackbar('密码不能为空', 'error');
        return;
      }

      let response;
      if (editingUser) {
        // 更新用户
        response = await usersApi.updateUser(editingUser.id, userFormData);
        showSnackbar('用户信息更新成功', 'success');
      } else {
        // 创建新用户
        response = await usersApi.createUser(userFormData);
        showSnackbar('用户创建成功', 'success');
      }

      handleCloseUserDialog();
      loadUsers();
      loadUserStats();
    } catch (error) {
      let errorMessage = '操作失败';
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        if (errors.username) {
          errorMessage = `用户名: ${errors.username.join(', ')}`;
        } else if (errors.email) {
          errorMessage = `邮箱: ${errors.email.join(', ')}`;
        } else {
          errorMessage = JSON.stringify(errors);
        }
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      showSnackbar(errorMessage, 'error');
      console.error('Error saving user:', error);
    }
  };

  const handleUserDelete = async (userId, username) => {
    if (!window.confirm(`确定要删除用户 "${username}" 吗？此操作无法撤销。`)) {
      return;
    }

    try {
      await usersApi.deleteUser(userId);
      showSnackbar('用户删除成功', 'success');
      loadUsers();
      loadUserStats();
    } catch (error) {
      let errorMessage = '删除失败';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      showSnackbar(errorMessage, 'error');
      console.error('Error deleting user:', error);
    }
  };

  const handleUserFilterChange = (field, value) => {
    setUserFilters(prev => ({ ...prev, [field]: value }));
  };

  const applyUserFilters = () => {
    loadUsers();
  };

  const togglePasswordVisibility = (userId) => {
    setShowPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  return (
    <Container maxWidth="lg">
      {/* 页面头部 */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AdminIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Box>
            <Typography variant="h4" component="h1" fontWeight="600">
              教师评价系统管理后台
            </Typography>
            <Typography variant="body1" color="textSecondary">
              管理教师信息、课程设置和评价内容
            </Typography>
          </Box>
        </Box>
        {currentTab === 0 && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            size="large"
            onClick={() => handleOpenTeacherDialog()}
            sx={{ borderRadius: 2 }}
          >
            添加教师
          </Button>
        )}
        {currentTab === 2 && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            size="large"
            onClick={() => handleOpenUserDialog()}
            sx={{ borderRadius: 2 }}
          >
            添加用户
          </Button>
        )}
      </Box>

      {/* Tab导航 */}
      <Box sx={{ mb: 4 }}>
        <Tabs
          value={currentTab}
          onChange={(e, newValue) => setCurrentTab(newValue)}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem',
            }
          }}
        >
          <Tab
            icon={<SchoolIcon />}
            iconPosition="start"
            label="教师管理"
            sx={{ mr: 2 }}
          />
          <Tab
            icon={<ReviewIcon />}
            iconPosition="start"
            label="评价管理"
            sx={{ mr: 2 }}
          />
          <Tab
            icon={<PeopleIcon />}
            iconPosition="start"
            label="用户管理"
          />
        </Tabs>
      </Box>

      {/* 统计卡片 */}
      {currentTab === 0 ? (
        // 教师管理统计
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary" fontWeight="600">
                  {teachers.length}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  教师总数
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="secondary" fontWeight="600">
                  {teachers.reduce((sum, t) => sum + t.total_reviews, 0)}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  评价总数
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="success.main" fontWeight="600">
                  {(teachers.reduce((sum, t) => sum + parseFloat(t.average_rating), 0) / teachers.length || 0).toFixed(1)}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  平均评分
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : currentTab === 1 ? (
        // 评价管理统计
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary" fontWeight="600">
                  {reviews.length}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  评价总数
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="secondary" fontWeight="600">
                  {(reviews.reduce((sum, r) => sum + r.overall_rating, 0) / reviews.length || 0).toFixed(1)}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  平均评分
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="warning.main" fontWeight="600">
                  {reviews.filter(r => r.overall_rating <= 2).length}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  低分评价
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="error.main" fontWeight="600">
                  {new Set(reviews.map(r => r.teacher)).size}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  涉及教师
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        // 用户管理统计
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary" fontWeight="600">
                  {userStats.total_users || 0}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  用户总数
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="warning.main" fontWeight="600">
                  {userStats.student_users || 0}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  学生用户
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="error.main" fontWeight="600">
                  {userStats.admin_users || 0}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  管理员
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="success.main" fontWeight="600">
                  {userStats.active_users || 0}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  活跃用户
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* 主要内容区域 */}
      {currentTab === 0 ? (
        // 教师管理
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight="600">
              教师列表
            </Typography>
            
            {teachersLoading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>头像</TableCell>
                    <TableCell>姓名</TableCell>
                    <TableCell>系别</TableCell>
                    <TableCell>教授课程</TableCell>
                    <TableCell>评价数</TableCell>
                    <TableCell>平均评分</TableCell>
                    <TableCell>操作</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {teachers.map((teacher) => (
                    <TableRow key={teacher.id} hover>
                      <TableCell>
                        <Avatar src={teacher.image} sx={{ width: 40, height: 40 }}>
                          {teacher.name.charAt(0)}
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" fontWeight="600">
                          {teacher.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="textSecondary">
                          {teacher.department}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {teacher.subjects_list?.slice(0, 3).map((subject, index) => (
                            <Chip
                              key={index}
                              label={subject}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          ))}
                          {teacher.subjects_list?.length > 3 && (
                            <Chip
                              label={`+${teacher.subjects_list.length - 3}`}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>{teacher.total_reviews}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="600">
                          {parseFloat(teacher.average_rating || 0).toFixed(1)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="编辑">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleOpenTeacherDialog(teacher)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="删除">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(teacher.id, teacher.name)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
      ) : currentTab === 1 ? (
        // 评价管理
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight="600">
              评价管理
            </Typography>
            
            {/* 评价过滤器 */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>筛选教师</InputLabel>
                  <Select
                    value={reviewFilters.teacher}
                    onChange={(e) => handleReviewFilterChange('teacher', e.target.value)}
                    label="筛选教师"
                  >
                    <MenuItem value="">全部教师</MenuItem>
                    {teachers.map((teacher) => (
                      <MenuItem key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>课程</InputLabel>
                  <Select
                    value={reviewFilters.course}
                    onChange={(e) => handleReviewFilterChange('course', e.target.value)}
                    label="课程"
                  >
                    <MenuItem value="">全部课程</MenuItem>
                    <MenuItem value="PSP">问题解决与编程</MenuItem>
                    <MenuItem value="OOP">面向对象编程</MenuItem>
                    <MenuItem value="SE">软件工程</MenuItem>
                    <MenuItem value="HCI">人机交互</MenuItem>
                    <MenuItem value="DevOps">DevOps</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>最低评分</InputLabel>
                  <Select
                    value={reviewFilters.min_rating}
                    onChange={(e) => handleReviewFilterChange('min_rating', e.target.value)}
                    label="最低评分"
                  >
                    <MenuItem value="">全部评分</MenuItem>
                    <MenuItem value="1">1分以上</MenuItem>
                    <MenuItem value="2">2分以上</MenuItem>
                    <MenuItem value="3">3分以上</MenuItem>
                    <MenuItem value="4">4分以上</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={applyReviewFilters}
                  size="medium"
                >
                  应用筛选
                </Button>
              </Grid>
            </Grid>

            {reviewsLoading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>教师</TableCell>
                      <TableCell>评价者</TableCell>
                      <TableCell>标题</TableCell>
                      <TableCell>评分</TableCell>
                      <TableCell>课程</TableCell>
                      <TableCell>时间</TableCell>
                      <TableCell>操作</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reviews.map((review) => (
                      <TableRow key={review.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight="600">
                            {review.teacher_name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {review.reviewer_name || '匿名'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" 
                            sx={{ 
                              maxWidth: 200, 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap' 
                            }}
                          >
                            {review.title}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Rating value={review.overall_rating} readOnly size="small" />
                            <Typography variant="caption" sx={{ ml: 1 }}>
                              ({review.overall_rating})
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={review.course_display || review.course} 
                            size="small" 
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption">
                            {new Date(review.created_at).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="查看详情">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleViewReview(review)}
                              >
                                <ViewIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="删除评价">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteReview(review.id, review.title)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      ) : (
        // 用户管理
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight="600">
              用户管理
            </Typography>
            
            {/* 用户筛选器 */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>筛选用户类型</InputLabel>
                  <Select
                    value={userFilters.user_type}
                    onChange={(e) => handleUserFilterChange('user_type', e.target.value)}
                    label="筛选用户类型"
                  >
                    <MenuItem value="">全部用户</MenuItem>
                    <MenuItem value="student">学生</MenuItem>
                    <MenuItem value="admin">管理员</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="搜索用户"
                  placeholder="用户名、姓名"
                  value={userFilters.search}
                  onChange={(e) => handleUserFilterChange('search', e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <SearchIcon color="action" />
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={applyUserFilters}
                  size="medium"
                >
                  应用筛选
                </Button>
              </Grid>
            </Grid>

            {usersLoading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>用户名</TableCell>
                      <TableCell>姓名</TableCell>
                      <TableCell>邮箱</TableCell>
                      <TableCell>用户类型</TableCell>
                      <TableCell>学号</TableCell>
                      <TableCell>密码</TableCell>
                      <TableCell>状态</TableCell>
                      <TableCell>注册时间</TableCell>
                      <TableCell>操作</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} hover>
                        <TableCell>
                          <Typography variant="body1" fontWeight="600">
                            {user.username}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {user.first_name || user.last_name ? 
                              `${user.first_name || ''} ${user.last_name || ''}`.trim() : 
                              '-'
                            }
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="textSecondary">
                            {user.email || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={user.user_type === 'admin' ? 
                              <SupervisorAccountIcon sx={{ fontSize: 16 }} /> : 
                              <PersonIcon sx={{ fontSize: 16 }} />
                            }
                            label={user.user_type === 'admin' ? '管理员' : '学生'}
                            color={user.user_type === 'admin' ? 'error' : 'primary'}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {user.student_id || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontFamily: 'monospace',
                                minWidth: 80,
                                maxWidth: 120,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}
                            >
                              {showPasswords[user.id] ? 
                                (user.plain_password || '未设置') : 
                                '••••••••'
                              }
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => togglePasswordVisibility(user.id)}
                            >
                              {showPasswords[user.id] ? 
                                <VisibilityOffIcon fontSize="small" /> : 
                                <ViewIcon fontSize="small" />
                              }
                            </IconButton>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={user.is_active ? '活跃' : '禁用'}
                            color={user.is_active ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption">
                            {new Date(user.date_joined).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="编辑">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleOpenUserDialog(user)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="删除">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleUserDelete(user.id, user.username)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      )}

      {/* 评价详情对话框 */}
      <Dialog
        open={openReviewDialog}
        onClose={handleCloseReviewDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle>
          评价详情
        </DialogTitle>
        <DialogContent dividers>
          {selectedReview && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  教师信息
                </Typography>
                <Typography variant="body1" fontWeight="600">
                  {selectedReview.teacher_name}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  评价者
                </Typography>
                <Typography variant="body1">
                  {selectedReview.reviewer_name || '匿名'}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  评价标题
                </Typography>
                <Typography variant="h6" fontWeight="600">
                  {selectedReview.title}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  总体评分
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Rating value={selectedReview.overall_rating} readOnly />
                  <Typography variant="body1" sx={{ ml: 1, fontWeight: 600 }}>
                    {selectedReview.overall_rating}/5
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  难度评分
                </Typography>
                <Typography variant="body1" fontWeight="600">
                  {selectedReview.difficulty_rating}/5
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  再次选择
                </Typography>
                <Chip
                  label={selectedReview.would_take_again ? '愿意' : '不愿意'}
                  color={selectedReview.would_take_again ? 'success' : 'error'}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  课程
                </Typography>
                <Typography variant="body1">
                  {selectedReview.course_display || selectedReview.course}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  学期
                </Typography>
                <Typography variant="body1">
                  {selectedReview.semester_display || selectedReview.semester}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  评价内容
                </Typography>
                <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="body1">
                    {selectedReview.content}
                  </Typography>
                </Paper>
              </Grid>
              {selectedReview.pros && (
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    优点
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    {selectedReview.pros}
                  </Typography>
                </Grid>
              )}
              {selectedReview.cons && (
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    缺点
                  </Typography>
                  <Typography variant="body2" color="error.main">
                    {selectedReview.cons}
                  </Typography>
                </Grid>
              )}
              {selectedReview.tags_list && selectedReview.tags_list.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    标签
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedReview.tags_list.map((tag, index) => (
                      <Chip key={index} label={tag} size="small" />
                    ))}
                  </Box>
                </Grid>
              )}
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  提交时间
                </Typography>
                <Typography variant="caption">
                  {new Date(selectedReview.created_at).toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button 
            onClick={handleCloseReviewDialog} 
            color="inherit"
          >
            关闭
          </Button>
        </DialogActions>
      </Dialog>

      {/* 添加/编辑教师对话框 */}
      <Dialog 
        open={openTeacherDialog} 
        onClose={handleCloseTeacherDialog} 
        maxWidth="md" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle>
          {editingTeacher ? '编辑教师信息' : '添加新教师'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="教师姓名 *"
                value={teacherFormData.name}
                onChange={(e) => handleTeacherInputChange('name', e.target.value)}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>系别</InputLabel>
                <Select
                  value={teacherFormData.department}
                  onChange={(e) => handleTeacherInputChange('department', e.target.value)}
                  label="系别"
                >
                  <MenuItem value="计算机科学与技术&软件工程">计算机科学与技术&软件工程</MenuItem>
                  <MenuItem value="其他专业">其他专业</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="教授课程"
                value={teacherFormData.subjects}
                onChange={(e) => handleTeacherInputChange('subjects', e.target.value)}
                placeholder="用逗号分隔多个课程，如：软件工程,面向对象编程,人机交互"
                margin="normal"
                helperText="建议课程：软件工程、面向对象编程、人机交互、DevOps、C++、Java等"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="个人简介"
                value={teacherFormData.bio}
                onChange={(e) => handleTeacherInputChange('bio', e.target.value)}
                multiline
                rows={4}
                margin="normal"
                placeholder="请输入教师的个人简介、教育背景、研究方向等..."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="详情页面URL"
                value={teacherFormData.detail_url}
                onChange={(e) => handleTeacherInputChange('detail_url', e.target.value)}
                placeholder="https://cie.cdut.edu.cn/info/1090/xxxx.htm"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<UploadIcon />}
                >
                  选择头像
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>
                {imageFile && (
                  <Typography variant="body2" color="primary">
                    已选择: {imageFile.name}
                  </Typography>
                )}
                {editingTeacher?.image && !imageFile && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar src={editingTeacher.image} sx={{ width: 30, height: 30 }} />
                    <Typography variant="body2" color="textSecondary">
                      当前头像
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button 
            onClick={handleCloseTeacherDialog} 
            startIcon={<CancelIcon />}
            color="inherit"
          >
            取消
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            startIcon={<SaveIcon />}
            sx={{ borderRadius: 2 }}
          >
            {editingTeacher ? '更新' : '创建'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 添加/编辑用户对话框 */}
      <Dialog 
        open={openUserDialog} 
        onClose={handleCloseUserDialog} 
        maxWidth="md" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle>
          {editingUser ? '编辑用户信息' : '添加新用户'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="用户名 *"
                value={userFormData.username}
                onChange={(e) => handleUserInputChange('username', e.target.value)}
                margin="normal"
                disabled={!!editingUser}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={editingUser ? "新密码（留空不修改）" : "密码 *"}
                type="password"
                value={userFormData.password}
                onChange={(e) => handleUserInputChange('password', e.target.value)}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="姓"
                value={userFormData.first_name}
                onChange={(e) => handleUserInputChange('first_name', e.target.value)}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="名"
                value={userFormData.last_name}
                onChange={(e) => handleUserInputChange('last_name', e.target.value)}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="邮箱"
                type="email"
                value={userFormData.email}
                onChange={(e) => handleUserInputChange('email', e.target.value)}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="学号（学生用户）"
                value={userFormData.student_id}
                onChange={(e) => handleUserInputChange('student_id', e.target.value)}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>用户类型</InputLabel>
                <Select
                  value={userFormData.user_type}
                  onChange={(e) => handleUserInputChange('user_type', e.target.value)}
                  label="用户类型"
                >
                  <MenuItem value="student">学生</MenuItem>
                  <MenuItem value="admin">管理员</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>账户状态</InputLabel>
                <Select
                  value={userFormData.is_active}
                  onChange={(e) => handleUserInputChange('is_active', e.target.value)}
                  label="账户状态"
                >
                  <MenuItem value={true}>活跃</MenuItem>
                  <MenuItem value={false}>禁用</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button 
            onClick={handleCloseUserDialog} 
            startIcon={<CancelIcon />}
            color="inherit"
          >
            取消
          </Button>
          <Button 
            onClick={handleUserSubmit} 
            variant="contained" 
            startIcon={<SaveIcon />}
            sx={{ borderRadius: 2 }}
          >
            {editingUser ? '更新' : '创建'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 消息提示 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminPage;
