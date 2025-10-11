import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  VisibilityOff as VisibilityOffIcon,
  SupervisorAccount as SupervisorAccountIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

import { User } from '../../../types';

interface UserListProps {
  users: User[];
  showPasswords: Record<number, boolean>;
  onEdit: (user: User) => void;
  onDelete: (userId: number, username: string) => void;
  onTogglePassword: (userId: number) => void;
}

const UserList: React.FC<UserListProps> = ({ 
  users, 
  showPasswords,
  onEdit, 
  onDelete,
  onTogglePassword
}) => {
  if (users.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          暂无用户数据
        </Typography>
        <Typography variant="body2" color="text.secondary">
          点击上方"添加用户"按钮来添加第一个用户
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer 
      component={Paper} 
      elevation={0}
      sx={{ 
        border: 1, 
        borderColor: 'grey.200',
        borderRadius: 2,
        overflow: 'hidden'
      }}
    >
      <Table>
        <TableHead sx={{ bgcolor: 'grey.50' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>用户名</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>姓名</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>邮箱</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>用户类型</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>学号</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>密码</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>状态</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>注册时间</TableCell>
            <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>操作</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow 
              key={user.id} 
              hover
              sx={{ 
                '&:hover': { bgcolor: 'grey.50' },
                transition: 'background-color 0.15s'
              }}
            >
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
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
                    maxWidth: 200,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 120 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: 'monospace',
                      fontSize: '0.875rem',
                      minWidth: 80,
                      maxWidth: 100,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      color: showPasswords[user.id] ? 'text.primary' : 'text.secondary'
                    }}
                  >
                    {showPasswords[user.id] ? 
                      (user.plain_password || '未设置') : 
                      '••••••••'
                    }
                  </Typography>
                  <Tooltip title={showPasswords[user.id] ? "隐藏密码" : "显示密码"} arrow>
                    <IconButton
                      size="small"
                      onClick={() => onTogglePassword(user.id)}
                      sx={{ 
                        '&:hover': { bgcolor: 'action.hover' },
                        transition: 'all 0.2s'
                      }}
                    >
                      {showPasswords[user.id] ? 
                        <VisibilityOffIcon fontSize="small" /> : 
                        <ViewIcon fontSize="small" />
                      }
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
              
              <TableCell>
                <Chip
                  label={user.is_active ? '活跃' : '禁用'}
                  color={user.is_active ? 'success' : 'default'}
                  size="small"
                  sx={{
                    fontWeight: 500,
                    minWidth: 60
                  }}
                />
              </TableCell>
              
              <TableCell>
                <Typography variant="caption" color="text.secondary">
                  {new Date(user.date_joined).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: '2-digit', 
                    day: '2-digit'
                  })}
                </Typography>
              </TableCell>
              
              <TableCell>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                  <Tooltip title="编辑用户信息" arrow>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => onEdit(user)}
                      sx={{ 
                        '&:hover': { bgcolor: 'primary.50' },
                        transition: 'all 0.2s'
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="删除用户" arrow>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onDelete(user.id, user.username)}
                      sx={{ 
                        '&:hover': { bgcolor: 'error.50' },
                        transition: 'all 0.2s'
                      }}
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
  );
};

export default UserList;
