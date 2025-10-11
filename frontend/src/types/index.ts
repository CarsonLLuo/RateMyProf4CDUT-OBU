// =============================================
// 通用API响应类型
// =============================================

export interface ApiResponse<T> {
  results: T[];
  count: number;
  next?: string;
  previous?: string;
}

export interface ApiError {
  detail?: string;
  message?: string;
  [key: string]: any;
}

// =============================================
// 认证相关类型
// =============================================

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface TokenResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: 'student' | 'admin';
  student_id?: string;
  is_active: boolean;
  date_joined: string;
  last_login?: string;
}

// =============================================
// 教师相关类型
// =============================================

export interface Teacher {
  id: number;
  name: string;
  bio: string;
  department: string;
  subjects_list: string[];
  detail_url?: string;
  image?: string;
  total_reviews: number;
  average_rating: number;
  would_take_again_percentage: number;
  difficulty_rating: number;
  created_at: string;
  updated_at: string;
}

export interface TeacherFormData {
  name: string;
  bio: string;
  department: string;
  subjects: string;
  detail_url: string;
}

export interface TeacherStats {
  total_teachers: number;
  teachers_with_reviews: number;
  average_rating: number;
  total_reviews: number;
}

// =============================================
// 评价相关类型
// =============================================

export interface Review {
  id: number;
  teacher: Teacher | number; // 支持完整对象或ID
  teacher_name?: string; // API返回的教师名称字段
  student_name: string;
  course: string;
  content: string;
  overall_rating: number;
  difficulty_rating: number;
  would_take_again: boolean;
  tags: string[] | string; // 支持数组和字符串两种格式
  helpful_count: number;
  is_helpful?: boolean; // 用户是否已标记为有用
  created_at: string;
  updated_at: string;
}

export interface CreateReviewData {
  teacher: number;
  course: string;
  content: string;
  overall_rating: number;
  difficulty_rating: number;
  would_take_again: boolean;
  tags: string[] | string; // 支持数组或字符串（提交时会转为字符串）
  student_name?: string;
  title?: string; // 评价标题（可选，后端会自动生成）
}

export interface ReviewFilters {
  teacher?: string;
  course?: string;
  min_rating?: string;
  max_rating?: string;
  would_take_again?: boolean;
  ordering?: string;
}

export interface ReviewStats {
  total_reviews: number;
  average_rating: number;
  rating_distribution: {
    [key: number]: number;
  };
  recent_reviews: Review[];
}

// =============================================
// 用户管理相关类型
// =============================================

export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  user_type: 'student' | 'admin';
  student_id?: string;
  is_active: boolean;
  date_joined: string;
  last_login?: string;
  plain_password?: string; // 仅用于显示，实际API不会返回
}

export interface UserFormData {
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  email: string;
  user_type: 'student' | 'admin';
  student_id: string;
  is_active: boolean;
}

export interface UserFilters {
  user_type?: string;
  search?: string;
  is_active?: boolean;
}

export interface UserStats {
  total_users: number;
  active_users: number;
  student_count: number;
  admin_count: number;
  recent_signups: User[];
}

// =============================================
// 表单和UI相关类型
// =============================================

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
}

export interface DialogState {
  open: boolean;
  mode: 'create' | 'edit' | 'view';
}

export interface FilterOptions {
  departments: string[];
  subjects: string[];
  userTypes: Array<{ value: string; label: string }>;
}

// =============================================
// API请求参数类型
// =============================================

export interface PaginationParams {
  page?: number;
  page_size?: number;
}

export interface SearchParams extends PaginationParams {
  search?: string;
  ordering?: string;
}

export interface TeacherListParams extends SearchParams {
  department?: string;
  subject?: string;
  min_rating?: number;
  has_reviews?: boolean;
}

export interface ReviewListParams extends SearchParams {
  teacher?: number;
  course?: string;
  min_rating?: number;
  max_rating?: number;
  would_take_again?: boolean;
  tags?: string[];
}

export interface UserListParams extends SearchParams {
  user_type?: 'student' | 'admin';
  is_active?: boolean;
}

// =============================================
// 组件Props类型
// =============================================

export interface LoadingProps {
  loading: boolean;
  error?: string | null;
}

export interface ListComponentProps<T> extends LoadingProps {
  items: T[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
}

// =============================================
// 常量类型
// =============================================

export const DEPARTMENTS = [
  '计算机科学与技术&软件工程',
  '其他'
] as const;

export const SUBJECTS = [
  '问题解决与编程',
  '面向对象编程',
  '高级面向对象编程',
  '软件工程',
  '软件分析与测试',
  '人机交互',
  'DevOps',
  '创新产品开发',
  'C++',
  'Java',
  '计算数学',
  '计算机相关课程'
] as const;

export const USER_TYPES = [
  { value: 'student', label: '学生' },
  { value: 'admin', label: '管理员' }
] as const;

export const RATING_LABELS = {
  1: '很差',
  2: '较差',
  3: '一般',
  4: '良好',
  5: '优秀'
} as const;

// 类型工具
export type Department = typeof DEPARTMENTS[number];
export type Subject = typeof SUBJECTS[number];
export type UserType = typeof USER_TYPES[number]['value'];
export type RatingValue = keyof typeof RATING_LABELS;
