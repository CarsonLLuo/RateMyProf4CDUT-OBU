import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Fab,
} from '@mui/material';
import {
  Add as AddIcon,
  People as PeopleIcon,
} from '@mui/icons-material';

// 导入hooks返回类型
import { useUserManagement } from '../../../hooks';

// 导入子组件
import UserStats from './UserStats';
import UserFilters from './UserFilters';
import UserList from './UserList';
import UserDialog from './UserDialog';

type UserManagementProps = ReturnType<typeof useUserManagement>;

const UserManagement: React.FC<UserManagementProps> = ({
  users,
  usersLoading,
  userStats,
  openUserDialog,
  editingUser,
  userFormData,
  userFilters,
  showPasswords,
  loadUsers,
  loadUserStats,
  handleOpenUserDialog,
  handleCloseUserDialog,
  handleUserInputChange,
  handleUserSubmit,
  handleUserDelete,
  handleUserFilterChange,
  applyUserFilters,
  togglePasswordVisibility,
}) => {
  return (
    <Box>
      {/* 用户统计 */}
      <UserStats userStats={userStats} />

      {/* 用户管理卡片 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PeopleIcon color="primary" />
              <Typography variant="h6" fontWeight="600">
                用户管理 ({users.length})
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenUserDialog()}
              sx={{ borderRadius: 2 }}
            >
              添加用户
            </Button>
          </Box>

          {/* 过滤器 */}
          <UserFilters
            filters={userFilters}
            onFilterChange={handleUserFilterChange}
            onApply={applyUserFilters}
          />

          {usersLoading ? (
            <Box display="flex" justifyContent="center" py={8}>
              <CircularProgress size={40} />
            </Box>
          ) : (
            <UserList
              users={users}
              showPasswords={showPasswords}
              onEdit={handleOpenUserDialog}
              onDelete={handleUserDelete}
              onTogglePassword={togglePasswordVisibility}
            />
          )}
        </CardContent>
      </Card>

      {/* 用户对话框 */}
      <UserDialog
        open={openUserDialog}
        editingUser={editingUser}
        formData={userFormData}
        onClose={handleCloseUserDialog}
        onInputChange={handleUserInputChange}
        onSubmit={handleUserSubmit}
      />

      {/* 浮动添加按钮 (移动端友好) */}
      <Fab
        color="primary"
        aria-label="添加用户"
        onClick={() => handleOpenUserDialog()}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          display: { xs: 'flex', md: 'none' }, // 只在小屏幕显示
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default UserManagement;
