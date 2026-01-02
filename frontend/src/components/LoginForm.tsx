import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface LoginFormProps {
  username: string;
  password: string;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  loading: boolean;
  userType: 'student' | 'admin';
}

const LoginForm: React.FC<LoginFormProps> = ({
  username,
  password,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
  loading,
  userType,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const isStudent = userType === 'student';

  return (
    <Box sx={{ p: 3 }}>
      <form onSubmit={onSubmit}>
        <TextField
          fullWidth
          label={isStudent ? '学号/用户名' : '管理员账号'}
          variant="outlined"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          margin="normal"
          required
          autoComplete="username"
          sx={{ 
            mb: 2, 
            '& .MuiOutlinedInput-root': { 
              borderRadius: 2,
              '&.Mui-focused fieldset': {
                borderColor: '#1B3C6F',
              }
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#1B3C6F',
            }
          }}
        />
        
        <TextField
          fullWidth
          label="密码"
          type={showPassword ? 'text' : 'password'}
          variant="outlined"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          margin="normal"
          required
          autoComplete="current-password"
          sx={{ 
            mb: 3, 
            '& .MuiOutlinedInput-root': { 
              borderRadius: 2,
              '&.Mui-focused fieldset': {
                borderColor: '#1B3C6F',
              }
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#1B3C6F',
            }
          }}
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
            fontSize: '1.05rem',
            fontWeight: 750,
            borderRadius: 2,
            background: '#1B3C6F',
            boxShadow: '0 4px 12px rgba(27, 60, 111, 0.2)',
            '&:hover': {
              background: '#152f56',
              boxShadow: '0 6px 16px rgba(27, 60, 111, 0.3)',
            }
          }}
        >
          {loading ? '登录中...' : isStudent ? '学生登录' : '管理员登录'}
        </Button>
      </form>
    </Box>
  );
};

export default LoginForm;
