import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  AdminPanelSettings as AdminIcon,
  School as SchoolIcon,
  RateReview as ReviewIcon,
  People as PeopleIcon,
} from '@mui/icons-material';

// 引入hooks
import { 
  useTeacherManagement, 
  useReviewManagement, 
  useUserManagement,
  useSnackbar
} from '../../hooks';

// 引入子组件
import TeacherManagement from './teachers/TeacherManagement';
import ReviewManagement from './reviews/ReviewManagement';
import UserManagement from './users/UserManagement';

const AdminLayout: React.FC = () => {
  // Tab管理
  const [currentTab, setCurrentTab] = useState(0);
  
  // 使用自定义hooks
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();
  
  const teacherManagement = useTeacherManagement({ showSnackbar });
  const reviewManagement = useReviewManagement({ 
    showSnackbar,
    onReviewDeleted: teacherManagement.loadTeachers // 当评论删除时刷新教师数据
  });
  const userManagement = useUserManagement({ showSnackbar });

  // Tab变化时加载对应数据
  useEffect(() => {
    if (currentTab === 0) {
      teacherManagement.loadTeachers();
    } else if (currentTab === 1) {
      reviewManagement.loadReviews();
    } else if (currentTab === 2) {
      userManagement.loadUsers();
      userManagement.loadUserStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab]);

  // 默认加载教师数据
  useEffect(() => {
    teacherManagement.loadTeachers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Tab配置
  const tabConfig = [
    {
      label: '教师管理',
      icon: <SchoolIcon sx={{ mr: 1 }} />,
      component: <TeacherManagement {...teacherManagement} />
    },
    {
      label: '评论管理', 
      icon: <ReviewIcon sx={{ mr: 1 }} />,
      component: <ReviewManagement {...reviewManagement} />
    },
    {
      label: '用户管理',
      icon: <PeopleIcon sx={{ mr: 1 }} />,
      component: <UserManagement {...userManagement} />
    }
  ];

  return (
    <Container maxWidth="lg">
      {/* 页面头部 */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <AdminIcon color="primary" sx={{ fontSize: 40 }} />
          <Box>
            <Typography variant="h4" component="h1" fontWeight="600" color="primary">
              管理面板
            </Typography>
            <Typography variant="body2" color="text.secondary">
              系统数据管理与维护
            </Typography>
          </Box>
        </Box>
        
        {/* 统计信息 */}
        <Box sx={{ display: 'flex', gap: 3, textAlign: 'center' }}>
          <Box>
            <Typography variant="h6" color="primary" fontWeight="600">
              {teacherManagement.teachers.length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              教师数量
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" color="secondary" fontWeight="600">
              {reviewManagement.reviews.length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              评论数量
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" color="success.main" fontWeight="600">
              {userManagement.users.length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              用户数量
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Tab导航 */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs 
          value={currentTab} 
          onChange={(_, newValue) => setCurrentTab(newValue)}
          variant="fullWidth"
          sx={{ 
            '& .MuiTab-root': { 
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
              minHeight: 64
            },
            '& .Mui-selected': {
              color: 'primary.main',
              fontWeight: 600
            }
          }}
        >
          {tabConfig.map((tab, index) => (
            <Tab 
              key={index}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {tab.icon}
                  {tab.label}
                </Box>
              }
            />
          ))}
        </Tabs>
      </Box>

      {/* Tab 内容 */}
      <Box sx={{ minHeight: '60vh' }}>
        {tabConfig[currentTab]?.component}
      </Box>

      {/* 全局Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={hideSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={hideSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminLayout;
