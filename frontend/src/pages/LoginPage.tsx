import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Tab,
  Tabs,
  Alert,
} from '@mui/material';
import {
  PersonOutline,
  AdminPanelSettingsOutlined,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import { LoginCredentials } from '../types';
import AnimatedBackground from '../components/AnimatedBackground';
import LoginForm from '../components/LoginForm';
import WelcomeDialog from '../components/WelcomeDialog';

interface LoginFormState extends LoginCredentials {
  username: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  
  // 学生登录表单
  const [studentForm, setStudentForm] = useState<LoginFormState>({
    username: '',
    password: '',
  });
  
  // 管理员登录表单
  const [adminForm, setAdminForm] = useState<LoginFormState>({
    username: '',
    password: '',
  });

  // 检查是否已登录，如果已登录则重定向
  useEffect(() => {
    const userType = localStorage.getItem('userType');
    const accessToken = localStorage.getItem('accessToken');
    
    if (userType && accessToken) {
      // 已登录，根据用户类型跳转
      if (userType === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
    // 只在组件挂载时执行一次
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setError('');
  };

  const handleStudentLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 调用学生登录API
      const response = await authApi.studentLogin(studentForm);
      
      // 保存登录信息
      localStorage.setItem('userType', 'student');
      localStorage.setItem('username', studentForm.username);
      localStorage.setItem('accessToken', response.access);
      localStorage.setItem('refreshToken', response.refresh);
      
      // 触发用户状态更新事件
      window.dispatchEvent(new Event('userStatusChange'));
      
      // 显示欢迎对话框
      setShowWelcomeDialog(true);
    } catch (err) {
      setError('登录失败，请检查用户名和密码');
      console.error('Student login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 调用管理员登录API
      const response = await authApi.adminLogin(adminForm);
      
      // 保存登录信息
      localStorage.setItem('userType', 'admin');
      localStorage.setItem('username', adminForm.username);
      localStorage.setItem('accessToken', response.access);
      localStorage.setItem('refreshToken', response.refresh);
      
      // 触发用户状态更新事件
      window.dispatchEvent(new Event('userStatusChange'));
      
      // 显示欢迎对话框
      setShowWelcomeDialog(true);
    } catch (err) {
      setError('登录失败，请检查用户名和密码');
      console.error('Admin login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseWelcomeDialog = () => {
    setShowWelcomeDialog(false);
    // 根据用户类型跳转
    const userType = localStorage.getItem('userType');
    if (userType === 'admin') {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        py: 4,
        background: '#f8fafc',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 0% 0%, rgba(27, 60, 111, 0.08) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(27, 60, 111, 0.05) 0%, transparent 50%)',
          zIndex: 0,
          pointerEvents: 'none',
        },
      }}
    >
      <AnimatedBackground enabled={false} />
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            borderRadius: 3,
            overflow: 'hidden',
            bgcolor: '#ffffff',
            boxShadow: '0 4px 20px rgba(27, 60, 111, 0.08)',
            borderTop: '4px solid #1B3C6F',
            position: 'relative'
          }}
        >
          <Box sx={{ 
            p: 4,
            textAlign: 'center',
            bgcolor: 'transparent',
            pb: 2
          }}>
            {/* Logo展示 */}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
              <img 
                src="/CDUT.png" 
                alt="成都理工大学" 
                style={{ 
                  height: '40px', 
                  width: 'auto',
                  marginRight: '16px',
                }} 
              />
              <img 
                src="/OBU.png" 
                alt="牛津布鲁克斯大学" 
                style={{ 
                  height: '40px', 
                  width: 'auto',
                }} 
              />
            </Box>
            
            <Typography variant="h4" component="h1" sx={{ fontWeight: 750, mb: 1, letterSpacing: '-0.02em' }}>
              登录
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              CDUT-OBU 教师评价系统
            </Typography>
          </Box>

        <Box sx={{ bgcolor: 'background.paper' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              px: 2,
              mb: 2,
              '& .MuiTabs-flexContainer': {
                bgcolor: 'transparent',
                borderBottom: '1px solid #e2e8f0',
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#1B3C6F',
                height: 3,
                borderRadius: '3px 3px 0 0',
              },
              '& .MuiTab-root': {
                minHeight: 56,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                color: '#64748b',
                '&.Mui-selected': {
                  color: '#1B3C6F',
                  fontWeight: 700,
                },
              }
            }}
          >
            <Tab 
              icon={<PersonOutline />} 
              iconPosition="start"
              label="学生" 
            />
            <Tab 
              icon={<AdminPanelSettingsOutlined />} 
              iconPosition="start"
              label="管理员" 
            />
          </Tabs>

          {error && (
            <Box sx={{ p: 2, pb: 0 }}>
              <Alert severity="error" sx={{ borderRadius: 1, bgcolor: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' }}>
                {error}
              </Alert>
            </Box>
          )}

          {tabValue === 0 && (
            <LoginForm
              username={studentForm.username}
              password={studentForm.password}
              onUsernameChange={(value) => setStudentForm({ ...studentForm, username: value })}
              onPasswordChange={(value) => setStudentForm({ ...studentForm, password: value })}
              onSubmit={handleStudentLogin}
              loading={loading}
              userType="student"
            />
          )}

          {tabValue === 1 && (
            <LoginForm
              username={adminForm.username}
              password={adminForm.password}
              onUsernameChange={(value) => setAdminForm({ ...adminForm, username: value })}
              onPasswordChange={(value) => setAdminForm({ ...adminForm, password: value })}
              onSubmit={handleAdminLogin}
              loading={loading}
              userType="admin"
            />
          )}
        </Box>

        <Box sx={{ 
          p: 3, 
          textAlign: 'center', 
          borderTop: '1px solid',
          borderColor: '#f1f5f9',
          bgcolor: '#f8fafc'
        }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            首次使用？请联系管理员获取账号
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Telegram:
              </Typography>
              <Typography
                component="a"
                href="https://t.me/carsonluo112233"
                target="_blank"
                rel="noopener noreferrer"
                variant="body2"
                sx={{
                  color: '#1B3C6F',
                  textDecoration: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    textDecoration: 'underline',
                  }
                }}
              >
                @carsonluo112233
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                邮箱:
              </Typography>
              <Typography
                component="a"
                href="mailto:carsonluo2233@outlook.com"
                variant="body2"
                sx={{
                  color: '#1B3C6F',
                  textDecoration: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    textDecoration: 'underline',
                  }
                }}
              >
                carsonluo2233@outlook.com
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      <WelcomeDialog
        open={showWelcomeDialog}
        onClose={handleCloseWelcomeDialog}
      />
      </Container>
    </Box>
  );
};

export default LoginPage;
