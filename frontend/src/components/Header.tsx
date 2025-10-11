import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  useTheme,
  Menu,
  MenuItem,
  Avatar,
  Chip,
} from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  School as SchoolIcon,
  AccountCircle,
  ExitToApp,
  AdminPanelSettings,
} from '@mui/icons-material';

// 本地类型定义
interface User {
  type: 'admin' | 'student';
  username: string;
}

interface NavItem {
  label: string;
  path: string;
}

const Header: React.FC = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [user, setUser] = useState<User | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  
  // 检查用户登录状态
  useEffect(() => {
    const checkUserStatus = () => {
      const userType = localStorage.getItem('userType') as 'admin' | 'student' | null;
      const username = localStorage.getItem('username');
      if (userType && username) {
        setUser({ type: userType, username });
      } else {
        setUser(null);
      }
    };

    checkUserStatus();
    
    // 监听localStorage变化
    window.addEventListener('storage', checkUserStatus);
    
    // 监听自定义的用户状态变化事件
    window.addEventListener('userStatusChange', checkUserStatus);
    
    return () => {
      window.removeEventListener('storage', checkUserStatus);
      window.removeEventListener('userStatusChange', checkUserStatus);
    };
  }, []);

  const navItems: NavItem[] = [
    { label: '首页', path: '/' },
    { label: '教师列表', path: '/teachers' },
    ...(user?.type === 'admin' ? [{ label: '管理后台', path: '/admin' }] : []),
  ];

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('userType');
    localStorage.removeItem('username');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setAnchorEl(null);
    
    // 触发用户状态更新事件
    window.dispatchEvent(new Event('userStatusChange'));
    
    navigate('/');
  };

  return (
    <>
      {/* 管理员标识条 */}
      {user?.type === 'admin' && (
        <Box
          sx={{
            backgroundColor: '#d32f2f',
            color: 'white',
            py: 0.5,
            textAlign: 'center',
            fontSize: '0.75rem',
            fontWeight: 'bold'
          }}
        >
          <AdminPanelSettings sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
          管理员模式
        </Box>
      )}
      
      <AppBar 
        position="sticky" 
        elevation={2}
        sx={{ 
          backgroundColor: theme.palette.primary.main,
          backgroundImage: user?.type === 'admin' 
            ? 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)'
            : 'linear-gradient(135deg, #263D6A 0%, #1A2B47 100%)'
        }}
      >
      <Container maxWidth="lg">
        <Toolbar sx={{ px: 0 }}>
          {/* Logo和标题 */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
            {/* 学校Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
              <img 
                src="/CDUT.png" 
                alt="成都理工大学" 
                style={{ 
                  height: '32px', 
                  width: 'auto',
                  marginRight: '8px',
                  filter: 'brightness(0) invert(1)' // 白色滤镜
                }} 
              />
              <img 
                src="/OBU.png" 
                alt="牛津布鲁克斯大学" 
                style={{ 
                  height: '32px', 
                  width: 'auto',
                  filter: 'brightness(0) invert(1)' // 白色滤镜
                }} 
              />
            </Box>
            
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                textDecoration: 'none',
                color: 'inherit',
                fontWeight: 600,
                fontSize: { xs: '1.1rem', md: '1.25rem' }
              }}
            >
              CDUT-OBU 评教系统
            </Typography>
          </Box>

          {/* 导航菜单 */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                color="inherit"
                sx={{
                  mx: 1,
                  px: 2,
                  borderRadius: 1,
                  backgroundColor: location.pathname === item.path 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* 用户信息或登录按钮 */}
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
            {user ? (
              <>
                <Chip
                  avatar={
                    <Avatar sx={{ 
                      bgcolor: user.type === 'admin' ? '#ff5722' : '#4caf50',
                      width: 24,
                      height: 24 
                    }}>
                      {user.type === 'admin' ? 
                        <AdminPanelSettings sx={{ fontSize: 16 }} /> : 
                        <AccountCircle sx={{ fontSize: 16 }} />
                      }
                    </Avatar>
                  }
                  label={`${user.username} (${user.type === 'admin' ? '管理员' : '学生'})`}
                  onClick={handleUserMenuOpen}
                  sx={{
                    color: 'white',
                    bgcolor: user.type === 'admin' 
                      ? 'rgba(255, 87, 34, 0.2)' 
                      : 'rgba(76, 175, 80, 0.2)',
                    border: user.type === 'admin' 
                      ? '1px solid rgba(255, 87, 34, 0.5)'
                      : '1px solid rgba(76, 175, 80, 0.5)',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    '&:hover': {
                      bgcolor: user.type === 'admin' 
                        ? 'rgba(255, 87, 34, 0.3)' 
                        : 'rgba(76, 175, 80, 0.3)',
                    }
                  }}
                />
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleUserMenuClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem onClick={handleLogout}>
                    <ExitToApp sx={{ mr: 1, fontSize: 20 }} />
                    退出登录
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                component={Link}
                to="/login"
                color="inherit"
                variant="outlined"
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                登录
              </Button>
            )}
          </Box>

          {/* 学校信息 */}
          
        </Toolbar>
      </Container>
    </AppBar>
    </>
  );
};

export default Header;
