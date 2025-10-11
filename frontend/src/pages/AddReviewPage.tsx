import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Rating,
  Chip,
  Alert,
  CircularProgress,
  Paper,
  Avatar,
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

import { teachersApi, reviewsApi } from '../services/api';
import { Teacher } from '../types';
import { COURSE_OPTIONS } from '../utils/courseMapping';

// 本地类型定义
interface ReviewFormData {
  student_name: string;
  overall_rating: number;
  difficulty_rating: number;
  would_take_again: boolean;
  course: string;
  content: string;
  tags: string[];
}

const AddReviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState<ReviewFormData>({
    student_name: '',
    overall_rating: 5,
    difficulty_rating: 3,
    would_take_again: true,
    course: '',
    content: '',
    tags: [],
  });

  const [customTag, setCustomTag] = useState('');

  const commonTags = [
    '认真负责', '讲解清楚', '作业适中', '考试公平', '互动性强',
    '幽默风趣', '严格要求', '实践性强', '理论扎实', '答疑耐心'
  ];

  useEffect(() => {
    if (id) {
      loadTeacher();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadTeacher = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const teacherData = await teachersApi.getTeacher(parseInt(id));
      setTeacher(teacherData);
    } catch (error) {
      console.error('加载教师信息失败:', error);
      setError('加载教师信息失败');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ReviewFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleTagToggle = (tag: string) => {
    const currentTags = [...formData.tags];
    const tagIndex = currentTags.indexOf(tag);
    
    if (tagIndex > -1) {
      currentTags.splice(tagIndex, 1);
    } else {
      currentTags.push(tag);
    }
    
    handleInputChange('tags', currentTags);
  };

  const handleAddCustomTag = () => {
    const trimmedTag = customTag.trim();
    
    if (!trimmedTag) {
      return;
    }
    
    // 检查标签是否已存在
    if (formData.tags.includes(trimmedTag)) {
      setError('该标签已添加');
      return;
    }
    
    // 检查标签长度
    if (trimmedTag.length > 10) {
      setError('标签长度不能超过10个字符');
      return;
    }
    
    // 添加自定义标签
    const currentTags = [...formData.tags, trimmedTag];
    handleInputChange('tags', currentTags);
    setCustomTag('');
    setError('');
  };

  const handleRemoveTag = (tag: string) => {
    const currentTags = formData.tags.filter(t => t !== tag);
    handleInputChange('tags', currentTags);
  };

  const handleCustomTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomTag();
    }
  };

  const validateForm = (): boolean => {
    if (!formData.content.trim()) {
      setError('请输入评价内容');
      return false;
    }
    
    if (!formData.course) {
      setError('请选择课程');
      return false;
    }
    
    if (formData.content.length < 10) {
      setError('评价内容至少需要10个字符');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !id) {
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      
      // 生成标题（从内容的前50个字符）
      const title = formData.content.length > 50 
        ? formData.content.substring(0, 50) + '...' 
        : formData.content;
      
      const reviewData: any = {
        ...formData,
        teacher: parseInt(id),
        student_name: formData.student_name || '匿名用户',
        title: title, // 添加标题
        tags: formData.tags.join(','), // 将数组转换为逗号分隔的字符串
      };
      
      await reviewsApi.createReview(reviewData);
      navigate(`/teachers/${id}`, { 
        state: { message: '评价提交成功！' }
      });
      
    } catch (error) {
      console.error('提交评价失败:', error);
      setError('提交评价失败，请检查输入信息');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!teacher) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 4, borderRadius: 2 }}>
          未找到教师信息，请检查链接是否正确
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      {/* 页面标题 */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="600">
          添加评价
        </Typography>
        <Typography variant="body1" color="textSecondary">
          为 {teacher.name} 老师写一篇真实的评价
        </Typography>
      </Box>

      {/* 教师信息卡片 */}
      <Card sx={{ mb: 4, borderRadius: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              src={teacher.image}
              sx={{ width: 80, height: 80, mr: 3 }}
              alt={teacher.name}
            >
              {teacher.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="600">
                {teacher.name}
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ mb: 1 }}>
                {teacher.department}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Rating value={parseFloat(String(teacher.average_rating || 0))} readOnly size="small" />
                <Typography variant="body2">
                  {parseFloat(String(teacher.average_rating || 0)).toFixed(1)} ({teacher.total_reviews} 条评价)
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* 评价表单 */}
      <Card sx={{ borderRadius: 2 }}>
        <CardContent sx={{ p: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* 基本信息 */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom fontWeight="600" color="primary">
                  基本信息
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="您的姓名"
                  placeholder="可选，留空则显示为匿名"
                  value={formData.student_name}
                  onChange={(e) => handleInputChange('student_name', e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>选择课程</InputLabel>
                  <Select
                    value={formData.course}
                    onChange={(e) => handleInputChange('course', e.target.value)}
                    label="选择课程"
                    sx={{ borderRadius: 2 }}
                  >
                    {COURSE_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* 评分部分 */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom fontWeight="600" color="primary" sx={{ mt: 2 }}>
                  评分
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography component="legend" gutterBottom>
                  总体评分 *
                </Typography>
                <Rating
                  value={formData.overall_rating}
                  onChange={(_, value) => handleInputChange('overall_rating', value || 1)}
                  size="large"
                  sx={{ mb: 1 }}
                />
                <Typography variant="body2" color="textSecondary">
                  给这位老师的总体教学评分
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography component="legend" gutterBottom>
                  难度评分 *
                </Typography>
                <Rating
                  value={formData.difficulty_rating}
                  onChange={(_, value) => handleInputChange('difficulty_rating', value || 1)}
                  size="large"
                  sx={{ mb: 1 }}
                />
                <Typography variant="body2" color="textSecondary">
                  课程难度如何？(1=很简单, 5=很困难)
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.would_take_again}
                      onChange={(e) => handleInputChange('would_take_again', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="我愿意再次选择这位老师的课程"
                  sx={{ mt: 1 }}
                />
              </Grid>

              {/* 详细评价 */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom fontWeight="600" color="primary" sx={{ mt: 2 }}>
                  详细评价
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="评价内容"
                  multiline
                  rows={6}
                  placeholder="请详细描述您对这位老师的看法，包括教学方式、课程内容、互动情况等..."
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  required
                  error={!formData.content.trim()}
                  helperText={
                    !formData.content.trim() 
                      ? '请输入评价内容' 
                      : `${formData.content.length}/500 字符`
                  }
                  inputProps={{ maxLength: 500 }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>

              {/* 标签选择 */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom fontWeight="600">
                  选择标签 (可选)
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  选择或添加最能描述这位老师的标签
                </Typography>
                
                {/* 常用标签 */}
                <Typography variant="body2" fontWeight="500" sx={{ mb: 1 }}>
                  常用标签：
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                  {commonTags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      onClick={() => handleTagToggle(tag)}
                      color={formData.tags.includes(tag) ? 'primary' : 'default'}
                      variant={formData.tags.includes(tag) ? 'filled' : 'outlined'}
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': { 
                          bgcolor: formData.tags.includes(tag) ? 'primary.dark' : 'grey.100' 
                        }
                      }}
                    />
                  ))}
                </Box>

                {/* 自定义标签输入 */}
                <Typography variant="body2" fontWeight="500" sx={{ mb: 1 }}>
                  添加自定义标签：
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    size="small"
                    placeholder="输入自定义标签（最多10字）"
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    onKeyPress={handleCustomTagKeyPress}
                    inputProps={{ maxLength: 10 }}
                    sx={{ 
                      flex: 1,
                      '& .MuiOutlinedInput-root': { borderRadius: 2 } 
                    }}
                  />
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddCustomTag}
                    disabled={!customTag.trim()}
                    sx={{ borderRadius: 2, minWidth: 100 }}
                  >
                    添加
                  </Button>
                </Box>

                {/* 已选标签显示 */}
                {formData.tags.length > 0 && (
                  <>
                    <Typography variant="body2" fontWeight="500" sx={{ mb: 1 }}>
                      已选标签 ({formData.tags.length})：
                    </Typography>
                    <Paper 
                      variant="outlined" 
                      sx={{ 
                        p: 2, 
                        bgcolor: 'grey.50',
                        borderRadius: 2
                      }}
                    >
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {formData.tags.map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag}
                            onDelete={() => handleRemoveTag(tag)}
                            color="primary"
                            deleteIcon={<CloseIcon />}
                            sx={{ fontWeight: 500 }}
                          />
                        ))}
                      </Box>
                    </Paper>
                  </>
                )}
              </Grid>

              {/* 操作按钮 */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={() => navigate(`/teachers/${id}`)}
                    disabled={submitting}
                    sx={{ borderRadius: 2 }}
                  >
                    取消
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    disabled={submitting || !formData.content.trim() || !formData.course}
                    size="large"
                    sx={{ borderRadius: 2, py: 1.5, px: 4 }}
                  >
                    {submitting ? <CircularProgress size={24} color="inherit" /> : '提交评价'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AddReviewPage;
