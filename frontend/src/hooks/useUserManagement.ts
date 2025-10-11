import { useState, useCallback } from 'react';
import { 
  User, 
  UserFormData, 
  UserFilters, 
  UserStats,
  SnackbarState 
} from '../types';
import { usersApi } from '../services/api';

interface UseUserManagementProps {
  showSnackbar: (message: string, severity?: SnackbarState['severity']) => void;
}

interface UseUserManagementReturn {
  // 状态
  users: User[];
  usersLoading: boolean;
  userStats: UserStats | null;
  openUserDialog: boolean;
  editingUser: User | null;
  userFormData: UserFormData;
  userFilters: UserFilters;
  showPasswords: Record<number, boolean>;
  
  // 操作函数
  loadUsers: () => Promise<void>;
  loadUserStats: () => Promise<void>;
  handleOpenUserDialog: (user?: User | null) => void;
  handleCloseUserDialog: () => void;
  handleUserInputChange: (field: keyof UserFormData, value: string | boolean) => void;
  handleUserSubmit: () => Promise<void>;
  handleUserDelete: (userId: number, username: string) => Promise<void>;
  handleUserFilterChange: (field: keyof UserFilters, value: string | boolean) => void;
  applyUserFilters: () => void;
  togglePasswordVisibility: (userId: number) => void;
}

const initialUserFormData: UserFormData = {
  username: '',
  password: '',
  first_name: '',
  last_name: '',
  email: '',
  user_type: 'student',
  student_id: '',
  is_active: true,
};

const initialUserFilters: UserFilters = {
  user_type: '',
  search: '',
};

export const useUserManagement = ({ 
  showSnackbar 
}: UseUserManagementProps): UseUserManagementReturn => {
  // 状态管理
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userFormData, setUserFormData] = useState<UserFormData>(initialUserFormData);
  const [userFilters, setUserFilters] = useState<UserFilters>(initialUserFilters);
  const [showPasswords, setShowPasswords] = useState<Record<number, boolean>>({});

  // 加载用户列表
  const loadUsers = useCallback(async () => {
    try {
      setUsersLoading(true);
      const params = {
        page_size: 100,
        user_type: (userFilters.user_type as 'student' | 'admin') || undefined,
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
  }, [userFilters.user_type, userFilters.search, showSnackbar]);

  // 加载用户统计
  const loadUserStats = useCallback(async () => {
    try {
      const stats = await usersApi.getUserStats();
      setUserStats(stats);
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  }, []);

  // 打开用户对话框
  const handleOpenUserDialog = useCallback((user: User | null = null) => {
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
      setUserFormData(initialUserFormData);
    }
    setOpenUserDialog(true);
  }, []);

  // 关闭用户对话框
  const handleCloseUserDialog = useCallback(() => {
    setOpenUserDialog(false);
    setEditingUser(null);
  }, []);

  // 用户表单输入变化
  const handleUserInputChange = useCallback((field: keyof UserFormData, value: string | boolean) => {
    setUserFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  // 提交用户表单（创建/更新）
  const handleUserSubmit = useCallback(async () => {
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

      if (editingUser) {
        // 更新用户
        await usersApi.updateUser(editingUser.id, userFormData);
        showSnackbar('用户信息更新成功', 'success');
      } else {
        // 创建新用户
        await usersApi.createUser(userFormData);
        showSnackbar('用户创建成功', 'success');
      }

      handleCloseUserDialog();
      await loadUsers();
      await loadUserStats();
    } catch (error: any) {
      let errorMessage = '操作失败';
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        if (errors.username) {
          errorMessage = `用户名: ${Array.isArray(errors.username) ? errors.username.join(', ') : errors.username}`;
        } else if (errors.email) {
          errorMessage = `邮箱: ${Array.isArray(errors.email) ? errors.email.join(', ') : errors.email}`;
        } else {
          errorMessage = JSON.stringify(errors);
        }
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      showSnackbar(errorMessage, 'error');
      console.error('Error saving user:', error);
    }
  }, [userFormData, editingUser, showSnackbar, handleCloseUserDialog, loadUsers, loadUserStats]);

  // 删除用户
  const handleUserDelete = useCallback(async (userId: number, username: string) => {
    if (!window.confirm(`确定要删除用户 "${username}" 吗？此操作无法撤销。`)) {
      return;
    }

    try {
      await usersApi.deleteUser(userId);
      showSnackbar('用户删除成功', 'success');
      await loadUsers();
      await loadUserStats();
    } catch (error: any) {
      let errorMessage = '删除失败';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      showSnackbar(errorMessage, 'error');
      console.error('Error deleting user:', error);
    }
  }, [showSnackbar, loadUsers, loadUserStats]);

  // 用户过滤器变化
  const handleUserFilterChange = useCallback((field: keyof UserFilters, value: string | boolean) => {
    setUserFilters(prev => ({ ...prev, [field]: value }));
  }, []);

  // 应用用户过滤器
  const applyUserFilters = useCallback(() => {
    loadUsers();
  }, [loadUsers]);

  // 切换密码显示
  const togglePasswordVisibility = useCallback((userId: number) => {
    setShowPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  }, []);

  return {
    // 状态
    users,
    usersLoading,
    userStats,
    openUserDialog,
    editingUser,
    userFormData,
    userFilters,
    showPasswords,
    
    // 操作函数
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
  };
};
