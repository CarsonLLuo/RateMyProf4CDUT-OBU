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
  Box,
  Avatar,
  Typography,
  Chip,
  OutlinedInput,
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Upload as UploadIcon,
} from '@mui/icons-material';

import { Teacher, TeacherFormData, DEPARTMENTS } from '../../../types';
import { COURSE_OPTIONS } from '../../../utils/courseMapping';

interface TeacherDialogProps {
  open: boolean;
  editingTeacher: Teacher | null;
  formData: TeacherFormData;
  imageFile: File | null;
  onClose: () => void;
  onInputChange: (field: keyof TeacherFormData, value: string) => void;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}

const TeacherDialog: React.FC<TeacherDialogProps> = ({
  open,
  editingTeacher,
  formData,
  imageFile,
  onClose,
  onInputChange,
  onImageChange,
  onSubmit,
}) => {
  // 将逗号分隔的字符串转换为数组
  const selectedCourses = formData.subjects
    ? formData.subjects.split(',').map(s => s.trim()).filter(s => s)
    : [];

  // 处理课程选择变化
  const handleCourseChange = (event: any) => {
    const value = event.target.value;
    // 将选中的课程数组转换为逗号分隔的字符串
    const coursesString = Array.isArray(value) ? value.join(', ') : value;
    onInputChange('subjects', coursesString);
  };

  // 处理删除单个课程
  const handleDeleteCourse = (courseToDelete: string) => {
    const updatedCourses = selectedCourses.filter(course => course !== courseToDelete);
    const coursesString = updatedCourses.join(', ');
    onInputChange('subjects', coursesString);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle sx={{ pb: 2 }}>
        <Typography variant="h6" fontWeight="600">
          {editingTeacher ? '编辑教师信息' : '添加新教师'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {editingTeacher ? '修改教师的基本信息' : '填写教师的详细信息'}
        </Typography>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 3 }}>
        <Grid container spacing={3}>
          {/* 基本信息 */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
              基本信息
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="教师姓名"
              value={formData.name}
              onChange={(e) => onInputChange('name', e.target.value)}
              required
              error={!formData.name.trim()}
              helperText={!formData.name.trim() ? '教师姓名不能为空' : ''}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>系别</InputLabel>
              <Select
                value={formData.department}
                onChange={(e) => onInputChange('department', e.target.value)}
                label="系别"
                sx={{ borderRadius: 2 }}
              >
                {DEPARTMENTS.map((dept) => (
                  <MenuItem key={dept} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* 课程信息 */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="primary" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
              课程信息
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>教授课程</InputLabel>
              <Select
                multiple
                value={selectedCourses}
                onChange={handleCourseChange}
                input={<OutlinedInput label="教授课程" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(selected as string[]).map((value) => {
                      // 找到对应的课程选项以显示完整名称
                      const course = COURSE_OPTIONS.find(opt => opt.label === value);
                      return (
                        <Chip 
                          key={value} 
                          label={course?.label || value} 
                          size="small"
                          sx={{ height: 24 }}
                        />
                      );
                    })}
                  </Box>
                )}
                sx={{ borderRadius: 2 }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 400,
                    },
                  },
                }}
              >
                {COURSE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.label}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <Typography variant="body2" sx={{ flex: 1 }}>
                        {option.label}
                      </Typography>
                      {selectedCourses.includes(option.label) && (
                        <Typography variant="body2" color="primary" sx={{ ml: 1 }}>
                          ✓
                        </Typography>
                      )}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                可以选择多门课程。已选择 {selectedCourses.length} 门课程
              </Typography>
            </FormControl>
            
            {/* 已选课程列表 - 可删除 */}
            {selectedCourses.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" fontWeight="500" gutterBottom>
                  已选课程 (点击 × 删除)：
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 1,
                  p: 2,
                  bgcolor: 'grey.50',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'grey.200'
                }}>
                  {selectedCourses.map((course) => (
                    <Chip
                      key={course}
                      label={course}
                      onDelete={() => handleDeleteCourse(course)}
                      color="primary"
                      sx={{ fontWeight: 500 }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Grid>

          {/* 详细信息 */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="primary" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
              详细信息
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="个人简介"
              value={formData.bio}
              onChange={(e) => onInputChange('bio', e.target.value)}
              multiline
              rows={4}
              placeholder="请输入教师的个人简介、教育背景、研究方向等..."
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="详情页面URL"
              value={formData.detail_url}
              onChange={(e) => onInputChange('detail_url', e.target.value)}
              placeholder="https://cie.cdut.edu.cn/info/1090/xxxx.htm"
              helperText="教师在学校官网的详情页面链接"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Grid>

          {/* 头像上传 */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="primary" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
              头像设置
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadIcon />}
                sx={{ borderRadius: 2 }}
              >
                选择头像
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={onImageChange}
                />
              </Button>

              {imageFile && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" color="success.main" fontWeight="500">
                    已选择: {imageFile.name}
                  </Typography>
                </Box>
              )}

              {editingTeacher?.image && !imageFile && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar 
                    src={editingTeacher.image} 
                    sx={{ width: 32, height: 32 }}
                    alt={editingTeacher.name}
                  />
                  <Typography variant="body2" color="text.secondary">
                    当前头像
                  </Typography>
                </Box>
              )}
            </Box>
            
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              支持 JPG、PNG 格式，文件大小不超过 5MB
            </Typography>
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
        >
          {editingTeacher ? '更新教师' : '创建教师'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TeacherDialog;
