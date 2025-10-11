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
  School as SchoolIcon,
} from '@mui/icons-material';

// 导入hooks返回类型
import { useTeacherManagement } from '../../../hooks';

// 导入子组件
import TeacherStats from './TeacherStats';
import TeacherList from './TeacherList';
import TeacherDialog from './TeacherDialog';

type TeacherManagementProps = ReturnType<typeof useTeacherManagement>;

const TeacherManagement: React.FC<TeacherManagementProps> = ({
  teachers,
  teachersLoading,
  openTeacherDialog,
  editingTeacher,
  teacherFormData,
  imageFile,
  loadTeachers,
  handleOpenTeacherDialog,
  handleCloseTeacherDialog,
  handleTeacherInputChange,
  handleImageChange,
  handleTeacherSubmit,
  handleTeacherDelete,
}) => {
  return (
    <Box>
      {/* 统计卡片 */}
      <TeacherStats teachers={teachers} />

      {/* 教师列表卡片 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SchoolIcon color="primary" />
              <Typography variant="h6" fontWeight="600">
                教师列表 ({teachers.length})
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenTeacherDialog()}
              sx={{ borderRadius: 2 }}
            >
              添加教师
            </Button>
          </Box>

          {teachersLoading ? (
            <Box display="flex" justifyContent="center" py={8}>
              <CircularProgress size={40} />
            </Box>
          ) : (
            <TeacherList
              teachers={teachers}
              onEdit={handleOpenTeacherDialog}
              onDelete={handleTeacherDelete}
            />
          )}
        </CardContent>
      </Card>

      {/* 教师对话框 */}
      <TeacherDialog
        open={openTeacherDialog}
        editingTeacher={editingTeacher}
        formData={teacherFormData}
        imageFile={imageFile}
        onClose={handleCloseTeacherDialog}
        onInputChange={handleTeacherInputChange}
        onImageChange={handleImageChange}
        onSubmit={handleTeacherSubmit}
      />

      {/* 浮动添加按钮 (移动端友好) */}
      <Fab
        color="primary"
        aria-label="添加教师"
        onClick={() => handleOpenTeacherDialog()}
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

export default TeacherManagement;
