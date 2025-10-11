import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Tab,
  Tabs,
  Alert,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  PersonOutline,
  AdminPanelSettingsOutlined,
  FavoriteBorder,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import { LoginCredentials } from '../types';

// 本地类型定义
interface TabPanelProps {
  children?: React.ReactNode;
  value: number;
  index: number;
}

interface LoginFormState extends LoginCredentials {
  username: string;
  password: string;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`login-tabpanel-${index}`}
      aria-labelledby={`login-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  
  const floatingWords = [
    // 80% 的理想
    '知识', '分享', '连接', '数据', '社区', '学习', '成长', '交流',
    '探索', '创新', '协作', '启发', '思考', '进步', '共建', '未来',
    'Knowledge', 'Share', 'Connect', 'Data', 'Community', 'Learn',
    'Growth', 'Explore', 'Innovation', 'Inspire', 'Think', 'Progress',
    
    '迷茫', '重复', '困惑', '标准答案', '孤岛','内卷'
  ];
  
  // 缓存背景文字配置，避免重新渲染时位置变化
  const floatingWordsConfig = useMemo(() => {
    return Array.from({ length: 40 }).map(() => {
      const word = floatingWords[Math.floor(Math.random() * floatingWords.length)];
      return {
        word,
        left: Math.random() * 100,
        top: Math.random() * 100,
        fontSize: Math.random() * 10 + 12,
        isEnglish: /^[A-Za-z]+$/.test(word),
        colorIndex: Math.floor(Math.random() * 3),
        baseOpacity: Math.random() * 0.4 + 0.2,
        glowSize: Math.random() * 15 + 5,
        floatDuration: Math.random() * 15 + 20,
        pulseDuration: Math.random() * 4 + 3,
        animationDelay: Math.random() * 5,
        translateX1: Math.random() * 80 - 40,
        translateY1: Math.random() * 80 - 40,
        scale1: Math.random() * 0.4 + 0.9,
        translateX2: Math.random() * 80 - 40,
        translateY2: Math.random() * 80 - 40,
        scale2: Math.random() * 0.4 + 1.1,
        opacityMin: Math.random() * 0.2 + 0.15,
        opacityMax: Math.random() * 0.5 + 0.35,
      };
    });
  }, []); // 空依赖数组，只在组件挂载时生成一次

  // 缓存连接线配置
  const connectionLinesConfig = useMemo(() => {
    return Array.from({ length: 20 }).map(() => ({
      x1: Math.random() * 100,
      y1: Math.random() * 100,
      x2: Math.random() * 100,
      y2: Math.random() * 100,
      colorIndex: Math.floor(Math.random() * 2),
      duration: Math.random() * 5 + 3,
    }));
  }, []); // 空依赖数组，只在组件挂载时生成一次
  
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

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleStudentChange = (field: keyof LoginFormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setStudentForm({
      ...studentForm,
      [field]: event.target.value,
    });
  };

  const handleAdminChange = (field: keyof LoginFormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setAdminForm({
      ...adminForm,
      [field]: event.target.value,
    });
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
        background: 'radial-gradient(ellipse at center, #2c2a47 0%, #1B2A47 50%, #0f1829 100%)',
      }}
    >
      {/* Animated Background Layer */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          overflow: 'hidden',
        }}
      >
        {/* Generate animated floating words */}
        {floatingWordsConfig.map((config, index) => {
          const colors = ['#00E5FF', '#BB86FC', '#ffffff'];
          
          return (
            <Box
              key={index}
              sx={{
                position: 'absolute',
                left: `${config.left}%`,
                top: `${config.top}%`,
                fontSize: `${config.fontSize}px`,
                fontWeight: config.isEnglish ? 400 : 500,
                color: colors[config.colorIndex],
                opacity: config.baseOpacity,
                textShadow: `0 0 ${config.glowSize}px currentColor`,
                whiteSpace: 'nowrap',
                userSelect: 'none',
                pointerEvents: 'none',
                animation: `
                  float-${index} ${config.floatDuration}s ease-in-out infinite,
                  pulse-${index} ${config.pulseDuration}s ease-in-out infinite alternate
                `,
                animationDelay: `${config.animationDelay}s`,
                [`@keyframes float-${index}`]: {
                  '0%, 100%': {
                    transform: `translate(0, 0) scale(1)`,
                  },
                  '33%': {
                    transform: `translate(${config.translateX1}px, ${config.translateY1}px) scale(${config.scale1})`,
                  },
                  '66%': {
                    transform: `translate(${config.translateX2}px, ${config.translateY2}px) scale(${config.scale2})`,
                  },
                },
                [`@keyframes pulse-${index}`]: {
                  '0%': {
                    opacity: config.opacityMin,
                  },
                  '100%': {
                    opacity: config.opacityMax,
                  },
                },
              }}
            >
              {config.word}
            </Box>
          );
        })}
        
        {/* Connection Lines */}
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0.15,
          }}
        >
          {connectionLinesConfig.map((config, index) => {
            const colors = ['#00E5FF', '#BB86FC'];
            return (
              <line
                key={index}
                x1={`${config.x1}%`}
                y1={`${config.y1}%`}
                x2={`${config.x2}%`}
                y2={`${config.y2}%`}
                stroke={colors[config.colorIndex]}
                strokeWidth="1"
                style={{
                  animation: `lineOpacity ${config.duration}s ease-in-out infinite alternate`,
                }}
              />
            );
          })}
        </svg>
      </Box>

      {/* Keyframes for animations */}
      <style>
        {`
          @keyframes lineOpacity {
            0% { opacity: 0.05; }
            100% { opacity: 0.2; }
          }
        `}
      </style>
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper 
          elevation={6} 
          sx={{ 
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 12px 48px rgba(0,0,0,0.4)'
          }}
        >
          <Box sx={{ 
            background: 'linear-gradient(135deg, #263D6A 0%, #1A2B47 100%)',
            color: 'white',
            p: 4,
            textAlign: 'center'
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
                  filter: 'brightness(0) invert(1)'
                }} 
              />
              <img 
                src="/OBU.png" 
                alt="牛津布鲁克斯大学" 
                style={{ 
                  height: '40px', 
                  width: 'auto',
                  filter: 'brightness(0) invert(1)'
                }} 
              />
            </Box>
            
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
              欢迎登录
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              CDUT-OBU 教师评价系统
            </Typography>
          </Box>

        <Box sx={{ bgcolor: 'background.paper' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                minHeight: 64,
                fontSize: '1.1rem',
                fontWeight: 500,
              }
            }}
          >
            <Tab 
              icon={<PersonOutline />} 
              iconPosition="start"
              label="学生登录" 
            />
            <Tab 
              icon={<AdminPanelSettingsOutlined />} 
              iconPosition="start"
              label="管理员登录" 
            />
          </Tabs>

          {error && (
            <Box sx={{ p: 2, pb: 0 }}>
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {error}
              </Alert>
            </Box>
          )}

          {/* 学生登录表单 */}
          <TabPanel value={tabValue} index={0}>
            <form onSubmit={handleStudentLogin}>
              <TextField
                fullWidth
                label="学号/用户名"
                variant="outlined"
                value={studentForm.username}
                onChange={handleStudentChange('username')}
                margin="normal"
                required
                autoComplete="username"
                sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              
              <TextField
                fullWidth
                label="密码"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                value={studentForm.password}
                onChange={handleStudentChange('password')}
                margin="normal"
                required
                autoComplete="current-password"
                sx={{ mb: 4, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        onMouseDown={(e) => e.preventDefault()}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  }
                }}
              >
                {loading ? '登录中...' : '学生登录'}
              </Button>
            </form>
          </TabPanel>

          {/* 管理员登录表单 */}
          <TabPanel value={tabValue} index={1}>
            <form onSubmit={handleAdminLogin}>
              <TextField
                fullWidth
                label="管理员账号"
                variant="outlined"
                value={adminForm.username}
                onChange={handleAdminChange('username')}
                margin="normal"
                required
                autoComplete="username"
                sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              
              <TextField
                fullWidth
                label="密码"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                value={adminForm.password}
                onChange={handleAdminChange('password')}
                margin="normal"
                required
                autoComplete="current-password"
                sx={{ mb: 4, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        onMouseDown={(e) => e.preventDefault()}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #e686f0 0%, #e94560 100%)',
                  }
                }}
              >
                {loading ? '登录中...' : '管理员登录'}
              </Button>
            </form>
          </TabPanel>
        </Box>

        <Box sx={{ 
          p: 3, 
          textAlign: 'center', 
          bgcolor: 'grey.50',
          borderTop: '1px solid',
          borderColor: 'grey.200'
        }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            首次使用？请联系管理员获取账号
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                📱 Telegram:
              </Typography>
              <Typography
                component="a"
                href="https://t.me/carsonluo112233"
                target="_blank"
                rel="noopener noreferrer"
                variant="body2"
                sx={{
                  color: 'primary.main',
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
                ✉️ 邮箱:
              </Typography>
              <Typography
                component="a"
                href="mailto:carsonluo2233@outlook.com"
                variant="body2"
                sx={{
                  color: 'primary.main',
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

      {/* 欢迎对话框 */}
      <Dialog
        open={showWelcomeDialog}
        onClose={handleCloseWelcomeDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 12px 48px rgba(0,0,0,0.15)',
          }
        }}
      >
        <DialogTitle sx={{ 
          textAlign: 'center',
          pt: 4,
          pb: 2,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <FavoriteBorder sx={{ fontSize: 48 }} />
          </Box>
          <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
            欢迎来到这里
          </Typography>
          <Typography variant="subtitle1" sx={{ mt: 1, opacity: 0.95 }}>
            一个源于真实感受和微小善意的空间
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ px: 4, py: 4 }}>
          <Typography 
            variant="body1" 
            paragraph 
            sx={{ 
              fontSize: '1.05rem', 
              lineHeight: 2,
              color: 'text.primary',
              mb: 2.5
            }}
          >
            这个小站的诞生，源于几个至今难忘的瞬间：
          </Typography>
          
          <Typography 
            variant="body1" 
            paragraph 
            sx={{ 
              fontSize: '1.05rem', 
              lineHeight: 2,
              color: 'text.secondary',
              mb: 2.5,
              pl: 2,
              borderLeft: '3px solid',
              borderColor: 'primary.light'
            }}
          >
            它源于第一次在课堂上不自觉睡着的沉闷；源于面对难题时，却被告知"你应该去问同学"的无奈；也源于毕业设计中那些一言难尽的时刻。
          </Typography>
          
          <Typography 
            variant="body1" 
            paragraph 
            sx={{ 
              fontSize: '1.05rem', 
              lineHeight: 2,
              color: 'text.primary',
              mb: 2.5
            }}
          >
            当回望在 CDUTZY 的学生时代，记忆里充斥着"草台班子"式的仓促、照本宣科的机械和缺乏启发的瞬间。我们都曾是其中的亲历者。
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600,
              color: 'primary.main',
              my: 3,
              textAlign: 'center'
            }}
          >
            但改变，始于一个微小的行动。
          </Typography>
          
          <Typography 
            variant="body1" 
            paragraph 
            sx={{ 
              fontSize: '1.05rem', 
              lineHeight: 2,
              color: 'text.secondary',
              mb: 2.5
            }}
          >
            2023年初，因为疫情，期末考试延期。我第一次尝试着把自己的几份课程笔记上传到 Github。起初无人问津，直到后来，当它被23级的学弟学妹们发现和使用时，那份跨越时空的"被需要"的感觉，让我备受感动。
          </Typography>
          
          <Typography 
            variant="body1" 
            paragraph 
            sx={{ 
              fontSize: '1.05rem', 
              lineHeight: 2,
              color: 'text.primary',
              mb: 2.5,
              fontWeight: 500
            }}
          >
            原来，一次微小的分享，真的可以为后来者照亮一小段路。
          </Typography>
          
          <Typography 
            variant="body1" 
            paragraph 
            sx={{ 
              fontSize: '1.05rem', 
              lineHeight: 2,
              color: 'text.secondary',
              mb: 2.5
            }}
          >
            这个小站，就是那份感动的延续。它是我对自己本科时代的一份交代，也是希望能为你、为每一个路过的同学，提供一份参考，一份温暖，一份力量。
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600,
              color: 'primary.main',
              mt: 4,
              textAlign: 'center',
              fontSize: '1.2rem'
            }}
          >
            愿我们能一起，将这里建设成我们理想中的样子。
          </Typography>
        </DialogContent>
        
        <DialogActions sx={{ px: 4, pb: 4, justifyContent: 'center' }}>
          <Button
            onClick={handleCloseWelcomeDialog}
            variant="contained"
            size="large"
            sx={{
              px: 6,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              borderRadius: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              }
            }}
          >
            开始探索
          </Button>
        </DialogActions>
      </Dialog>
      </Container>
    </Box>
  );
};

export default LoginPage;
