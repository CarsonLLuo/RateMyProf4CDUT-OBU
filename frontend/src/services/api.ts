import axios, { AxiosResponse } from 'axios';
import {
  ApiResponse,
  LoginCredentials,
  TokenResponse,
  UserProfile,
  Teacher,
  TeacherStats,
  TeacherListParams,
  Review,
  CreateReviewData,
  ReviewStats,
  ReviewListParams,
  User,
  UserFormData,
  UserStats,
  UserListParams,
} from '../types';

// 创建axios实例
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 添加认证token
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// =============================================
// 认证API
// =============================================

export const authApi = {
  // 学生登录
  studentLogin: (credentials: LoginCredentials): Promise<TokenResponse> => 
    api.post('/auth/student/login/', credentials),
  
  // 管理员登录
  adminLogin: (credentials: LoginCredentials): Promise<TokenResponse> => 
    api.post('/auth/admin/login/', credentials),
  
  // 获取当前用户信息
  getCurrentUser: (): Promise<UserProfile> => 
    api.get('/auth/user/'),
  
  // 登出
  logout: (): Promise<void> => 
    api.post('/auth/logout/'),
  
  // 刷新token
  refreshToken: (refreshToken: string): Promise<TokenResponse> => 
    api.post('/auth/refresh/', { refresh: refreshToken }),
};

// =============================================
// 教师API
// =============================================

export const teachersApi = {
  // 获取教师列表
  getTeachers: (params: TeacherListParams = {}): Promise<ApiResponse<Teacher>> => 
    api.get('/teachers/', { params }),
  
  // 获取教师详情
  getTeacher: (id: number): Promise<Teacher> => 
    api.get(`/teachers/${id}/`),
  
  // 获取教师统计
  getTeacherStats: (): Promise<TeacherStats> => 
    api.get('/teachers/stats/'),
  
  // 创建教师 (管理员功能)
  createTeacher: (data: FormData): Promise<Teacher> => 
    api.post('/teachers/', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  // 更新教师 (管理员功能)
  updateTeacher: (id: number, data: FormData): Promise<Teacher> => 
    api.patch(`/teachers/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  // 删除教师 (管理员功能)
  deleteTeacher: (id: number): Promise<void> => 
    api.delete(`/teachers/${id}/`),
};

// =============================================
// 评价API
// =============================================

export const reviewsApi = {
  // 获取评价列表
  getReviews: (params: ReviewListParams = {}): Promise<ApiResponse<Review>> => 
    api.get('/reviews/', { params }),
  
  // 管理API - 获取评价列表（用于Admin）
  getReviewsForAdmin: (params: ReviewListParams = {}): Promise<ApiResponse<Review>> => 
    api.get('/reviews/manage/', { params }),
  
  // 创建评价
  createReview: (data: CreateReviewData): Promise<Review> => 
    api.post('/reviews/create/', data),
  
  // 获取评价详情
  getReview: (id: number): Promise<Review> => 
    api.get(`/reviews/${id}/`),
  
  // 删除评价（管理员功能）
  deleteReview: (id: number): Promise<void> => 
    api.delete(`/reviews/manage/${id}/`),
  
  // 标记评价为有用
  markHelpful: (reviewId: number): Promise<{ helpful_count: number }> => 
    api.post(`/reviews/${reviewId}/helpful/`),
  
  // 获取评价统计
  getReviewStats: (): Promise<ReviewStats> => 
    api.get('/reviews/stats/'),
};

// =============================================
// 用户管理API
// =============================================

export const usersApi = {
  // 获取用户列表
  getUsers: (params: UserListParams = {}): Promise<ApiResponse<User>> => 
    api.get('/auth/users/', { params }),
  
  // 获取用户详情
  getUser: (id: number): Promise<User> => 
    api.get(`/auth/users/${id}/`),
  
  // 创建用户
  createUser: (data: UserFormData): Promise<User> => 
    api.post('/auth/users/', data),
  
  // 更新用户
  updateUser: (id: number, data: Partial<UserFormData>): Promise<User> => 
    api.put(`/auth/users/${id}/`, data),
  
  // 删除用户
  deleteUser: (id: number): Promise<void> => 
    api.delete(`/auth/users/${id}/`),
  
  // 获取用户统计
  getUserStats: (): Promise<UserStats> => 
    api.get('/auth/users/stats/'),
};

// =============================================
// 工具函数
// =============================================

// 处理API错误
export const handleApiError = (error: any): string => {
  if (error.response?.data?.detail) {
    return error.response.data.detail;
  }
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return '发生未知错误';
};

// 构建查询参数
export const buildQueryParams = (params: Record<string, any>): Record<string, any> => {
  const cleanParams: Record<string, any> = {};
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      cleanParams[key] = value;
    }
  });
  
  return cleanParams;
};

export default api;
