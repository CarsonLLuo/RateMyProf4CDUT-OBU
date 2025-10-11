import { useState, useCallback } from 'react';
import { 
  Teacher, 
  TeacherFormData, 
  SnackbarState 
} from '../types';
import { teachersApi } from '../services/api';

interface UseTeacherManagementProps {
  showSnackbar: (message: string, severity?: SnackbarState['severity']) => void;
}

interface UseTeacherManagementReturn {
  // 状态
  teachers: Teacher[];
  teachersLoading: boolean;
  openTeacherDialog: boolean;
  editingTeacher: Teacher | null;
  teacherFormData: TeacherFormData;
  imageFile: File | null;
  
  // 操作函数
  loadTeachers: () => Promise<void>;
  handleOpenTeacherDialog: (teacher?: Teacher | null) => Promise<void>;
  handleCloseTeacherDialog: () => void;
  handleTeacherInputChange: (field: keyof TeacherFormData, value: string) => void;
  handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleTeacherSubmit: () => Promise<void>;
  handleTeacherDelete: (teacherId: number, teacherName: string) => Promise<void>;
}

const initialTeacherFormData: TeacherFormData = {
  name: '',
  bio: '',
  department: '计算机科学与技术&软件工程',
  subjects: '',
  detail_url: '',
};

export const useTeacherManagement = ({ 
  showSnackbar 
}: UseTeacherManagementProps): UseTeacherManagementReturn => {
  // 状态管理
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [teachersLoading, setTeachersLoading] = useState(true);
  const [openTeacherDialog, setOpenTeacherDialog] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [teacherFormData, setTeacherFormData] = useState<TeacherFormData>(initialTeacherFormData);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // 加载教师列表
  const loadTeachers = useCallback(async () => {
    try {
      setTeachersLoading(true);
      const response = await teachersApi.getTeachers({ page_size: 100 });
      setTeachers(response.results || []);
    } catch (error) {
      showSnackbar('加载教师列表失败', 'error');
      console.error('Error loading teachers:', error);
    } finally {
      setTeachersLoading(false);
    }
  }, [showSnackbar]);

  // 打开教师对话框
  const handleOpenTeacherDialog = useCallback(async (teacher: Teacher | null = null) => {
    if (teacher) {
      try {
        // 获取完整的教师信息，包括bio等详细字段
        const fullTeacherData = await teachersApi.getTeacher(teacher.id);
        setEditingTeacher(fullTeacherData);
        setTeacherFormData({
          name: fullTeacherData.name,
          bio: fullTeacherData.bio || '',
          department: fullTeacherData.department,
          subjects: fullTeacherData.subjects_list ? fullTeacherData.subjects_list.join(', ') : '',
          detail_url: fullTeacherData.detail_url || '',
        });
      } catch (error) {
        console.error('Error fetching teacher details:', error);
        // 发生错误时使用列表数据作为备选
        setEditingTeacher(teacher);
        setTeacherFormData({
          name: teacher.name,
          bio: '',
          department: teacher.department,
          subjects: teacher.subjects_list ? teacher.subjects_list.join(', ') : '',
          detail_url: '',
        });
        showSnackbar('获取教师详细信息失败，部分字段可能为空', 'warning');
      }
    } else {
      setEditingTeacher(null);
      setTeacherFormData(initialTeacherFormData);
    }
    setImageFile(null);
    setOpenTeacherDialog(true);
  }, [showSnackbar]);

  // 关闭教师对话框
  const handleCloseTeacherDialog = useCallback(() => {
    setOpenTeacherDialog(false);
    setEditingTeacher(null);
    setImageFile(null);
  }, []);

  // 教师表单输入变化
  const handleTeacherInputChange = useCallback((field: keyof TeacherFormData, value: string) => {
    setTeacherFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  // 教师头像变化
  const handleImageChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 验证文件类型
      if (!file.type.startsWith('image/')) {
        showSnackbar('请选择图片文件', 'error');
        return;
      }
      // 验证文件大小 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        showSnackbar('图片大小不能超过5MB', 'error');
        return;
      }
      setImageFile(file);
    }
  }, [showSnackbar]);

  // 提交教师表单（创建/更新）
  const handleTeacherSubmit = useCallback(async () => {
    try {
      // 验证必填字段
      if (!teacherFormData.name.trim()) {
        showSnackbar('教师姓名不能为空', 'error');
        return;
      }

      // 准备表单数据
      const submitData = new FormData();
      submitData.append('name', teacherFormData.name);
      submitData.append('bio', teacherFormData.bio);
      submitData.append('department', teacherFormData.department);
      submitData.append('subjects', teacherFormData.subjects);
      submitData.append('detail_url', teacherFormData.detail_url);
      
      if (imageFile) {
        submitData.append('image', imageFile);
      }

      if (editingTeacher) {
        // 更新教师
        await teachersApi.updateTeacher(editingTeacher.id, submitData);
        showSnackbar('教师信息更新成功', 'success');
      } else {
        // 创建新教师
        await teachersApi.createTeacher(submitData);
        showSnackbar('教师创建成功', 'success');
      }

      handleCloseTeacherDialog();
      await loadTeachers();
    } catch (error: any) {
      console.error('Error saving teacher:', error);
      
      // 处理错误响应
      let errorMessage = '操作失败';
      if (error.response?.data) {
        const errorData = error.response.data;
        if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.name) {
          errorMessage = `姓名: ${Array.isArray(errorData.name) ? errorData.name.join(', ') : errorData.name}`;
        } else if (errorData.subjects) {
          errorMessage = `科目: ${Array.isArray(errorData.subjects) ? errorData.subjects.join(', ') : errorData.subjects}`;
        } else {
          errorMessage = JSON.stringify(errorData);
        }
      } else if (error.message) {
        errorMessage = `网络错误: ${error.message}`;
      }
      
      showSnackbar(errorMessage, 'error');
    }
  }, [teacherFormData, imageFile, editingTeacher, showSnackbar, handleCloseTeacherDialog, loadTeachers]);

  // 删除教师
  const handleTeacherDelete = useCallback(async (teacherId: number, teacherName: string) => {
    if (!window.confirm(`确定要删除教师 "${teacherName}" 吗？此操作无法撤销。`)) {
      return;
    }

    try {
      await teachersApi.deleteTeacher(teacherId);
      showSnackbar('教师删除成功', 'success');
      await loadTeachers();
    } catch (error) {
      showSnackbar('删除失败，请检查网络连接', 'error');
      console.error('Error deleting teacher:', error);
    }
  }, [showSnackbar, loadTeachers]);

  return {
    // 状态
    teachers,
    teachersLoading,
    openTeacherDialog,
    editingTeacher,
    teacherFormData,
    imageFile,
    
    // 操作函数
    loadTeachers,
    handleOpenTeacherDialog,
    handleCloseTeacherDialog,
    handleTeacherInputChange,
    handleImageChange,
    handleTeacherSubmit,
    handleTeacherDelete,
  };
};
