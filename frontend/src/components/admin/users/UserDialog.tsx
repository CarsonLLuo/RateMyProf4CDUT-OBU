import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  SupervisorAccount as SupervisorAccountIcon,
} from '@mui/icons-material';

import { User, UserFormData, USER_TYPES } from '../../../types';

interface UserDialogProps {
  open: boolean;
  editingUser: User | null;
  formData: UserFormData;
  onClose: () => void;
  onInputChange: (field: keyof UserFormData, value: string | boolean) => void;
  onSubmit: () => void;
}

const UserDialog: React.FC<UserDialogProps> = ({
  open,
  editingUser,
  formData,
  onClose,
  onInputChange,
  onSubmit,
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle sx={{ pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {editingUser?.user_type === 'admin' ? (
            <SupervisorAccountIcon color="error" />
          ) : (
            <PersonIcon color="primary" />
          )}
          <Box>
            <Typography variant="h6" fontWeight="600">
              {editingUser ? '编辑用户信息' : '添加新用户'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {editingUser 
                ? `修改用户 "${editingUser.username}" 的信息` 
                : '创建新的系统用户账户'
              }
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 3 }}>
        {editingUser && (
          <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
            正在编辑用户：{editingUser.username} 
            ({editingUser.user_type === 'admin' ? '管理员' : '学生'})
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* 账户信息 */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
              账户信息
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="用户名"
              value={formData.username}
              onChange={(e) => onInputChange('username', e.target.value)}
              required
              disabled={!!editingUser}
              error={!formData.username.trim()}
              helperText={
                editingUser 
                  ? '用户名在创建后不能修改' 
                  : !formData.username.trim() 
                    ? '用户名不能为空' 
                    : '用于登录系统的唯一标识'
              }
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={editingUser ? "新密码（留空不修改）" : "密码"}
              type="password"
              value={formData.password}
              onChange={(e) => onInputChange('password', e.target.value)}
              required={!editingUser}
              error={!editingUser && !formData.password.trim()}
              helperText={
                editingUser 
                  ? '留空表示不修改密码' 
                  : !formData.password.trim() 
                    ? '新用户密码不能为空'
                    : '建议使用强密码'
              }
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Grid>

          {/* 个人信息 */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="primary" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
              个人信息
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="姓"
              value={formData.first_name}
              onChange={(e) => onInputChange('first_name', e.target.value)}
              placeholder="请输入姓氏"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="名"
              value={formData.last_name}
              onChange={(e) => onInputChange('last_name', e.target.value)}
              placeholder="请输入名字"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="邮箱"
              type="email"
              value={formData.email}
              onChange={(e) => onInputChange('email', e.target.value)}
              placeholder="user@example.com"
              helperText="用于接收系统通知"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="学号"
              value={formData.student_id}
              onChange={(e) => onInputChange('student_id', e.target.value)}
              placeholder="学生用户请填写学号"
              disabled={formData.user_type === 'admin'}
              helperText={formData.user_type === 'admin' ? '管理员用户无需学号' : '学生用户的唯一学号'}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Grid>

          {/* 权限设置 */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="primary" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
              权限设置
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>用户类型</InputLabel>
              <Select
                value={formData.user_type}
                onChange={(e) => onInputChange('user_type', e.target.value)}
                label="用户类型"
                sx={{ borderRadius: 2 }}
              >
                {USER_TYPES.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {type.value === 'admin' ? (
                        <SupervisorAccountIcon fontSize="small" />
                      ) : (
                        <PersonIcon fontSize="small" />
                      )}
                      {type.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>账户状态</InputLabel>
              <Select
                value={formData.is_active ? 'true' : 'false'}
                onChange={(e) => onInputChange('is_active', e.target.value === 'true')}
                label="账户状态"
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="true">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ 
                      width: 8, 
                      height: 8, 
                      borderRadius: '50%', 
                      bgcolor: 'success.main' 
                    }} />
                    活跃
                  </Box>
                </MenuItem>
                <MenuItem value="false">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ 
                      width: 8, 
                      height: 8, 
                      borderRadius: '50%', 
                      bgcolor: 'grey.400' 
                    }} />
                    禁用
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* 权限说明 */}
          <Grid item xs={12}>
            <Alert severity="warning" sx={{ borderRadius: 2 }}>
              <Typography variant="body2">
                <strong>权限说明：</strong>
              </Typography>
              <Typography variant="body2" component="ul" sx={{ m: 0, pl: 2 }}>
                <li><strong>学生用户</strong>：可以查看教师信息、提交评价、查看自己的评价历史</li>
                <li><strong>管理员用户</strong>：拥有所有权限，包括用户管理、教师管理、评价管理等</li>
                <li><strong>禁用账户</strong>：无法登录系统，但数据仍会保留</li>
              </Typography>
            </Alert>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button 
          onClick={onClose} 
          startIcon={<CancelIcon />}
          color="inherit"
          sx={{ borderRadius: 2 }}
        >
          取消
        </Button>
        
        <Button 
          onClick={onSubmit} 
          variant="contained" 
          startIcon={<SaveIcon />}
          sx={{ borderRadius: 2, px: 3 }}
          disabled={!formData.username.trim() || (!editingUser && !formData.password.trim())}
        >
          {editingUser ? '更新用户' : '创建用户'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserDialog;
