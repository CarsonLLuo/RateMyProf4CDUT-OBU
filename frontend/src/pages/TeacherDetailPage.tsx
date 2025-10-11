import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  Divider,
  CircularProgress,
  Paper,
  Rating,
  LinearProgress,
} from '@mui/material';
import {
  Star as StarIcon,
  Add as AddIcon,
  ThumbUp as ThumbUpIcon,
  School as SchoolIcon,
} from '@mui/icons-material';

import { teachersApi, reviewsApi } from '../services/api';
import { Teacher, Review } from '../types';
import { getCourseFullName } from '../utils/courseMapping';

// 本地类型定义
interface RatingDistribution {
  [key: number]: number;
}

const TeacherDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadTeacherData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadTeacherData = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setReviewsLoading(true);
      
      const [teacherData, reviewsData] = await Promise.all([
        teachersApi.getTeacher(parseInt(id)),
        reviewsApi.getReviews({ teacher: parseInt(id), ordering: '-created_at' })
      ]);
      
      setTeacher(teacherData);
      setReviews(reviewsData.results || []);
      
    } catch (error) {
      console.error('加载教师数据失败:', error);
    } finally {
      setLoading(false);
      setReviewsLoading(false);
    }
  };

  const handleMarkHelpful = async (reviewId: number) => {
    if (!id) return;
    
    try {
      await reviewsApi.markHelpful(reviewId);
      // 重新加载评价以更新点赞数
      const reviewsData = await reviewsApi.getReviews({ 
        teacher: parseInt(id), 
        ordering: '-created_at' 
      });
      setReviews(reviewsData.results || []);
    } catch (error) {
      console.error('点赞失败:', error);
    }
  };

  const getRatingDistribution = (): RatingDistribution => {
    if (!reviews.length) return {};
    
    const distribution: RatingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.overall_rating] = (distribution[review.overall_rating] || 0) + 1;
    });
    
    return distribution;
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
      <Container maxWidth="lg">
        <Typography variant="h6" textAlign="center" color="textSecondary" sx={{ mt: 4 }}>
          教师信息未找到
        </Typography>
      </Container>
    );
  }

  const ratingDistribution = getRatingDistribution();

  return (
    <Container maxWidth="lg">
      <Grid container spacing={4}>
        {/* 教师基本信息 */}
        <Grid item xs={12} md={4}>
          <Card sx={{ position: 'sticky', top: 100 }}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <Avatar
                src={teacher.image}
                sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                alt={teacher.name}
              >
                {teacher.name.charAt(0)}
              </Avatar>
              
              <Typography variant="h5" fontWeight="600" gutterBottom>
                {teacher.name}
              </Typography>
              
              <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
                {teacher.department}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              {/* 评分信息 */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h3" color="primary" fontWeight="700">
                  {parseFloat(String(teacher.average_rating || 0)).toFixed(1)}
                </Typography>
                <Rating 
                  value={parseFloat(String(teacher.average_rating || 0))} 
                  readOnly 
                  size="large" 
                  sx={{ mb: 1 }}
                />
                <Typography variant="body2" color="textSecondary">
                  基于 {teacher.total_reviews} 条评价
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              {/* 其他统计 */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Typography variant="h6" color="warning.main" fontWeight="600">
                    {parseFloat(String(teacher.difficulty_rating || 0)).toFixed(1)}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    难度评分
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6" color="success.main" fontWeight="600">
                    {parseFloat(String(teacher.would_take_again_percentage || 0)).toFixed(0)}%
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    再选率
                  </Typography>
                </Grid>
              </Grid>
              
              <Button
                component={Link}
                to={`/teachers/${teacher.id}/add-review`}
                variant="contained"
                fullWidth
                startIcon={<AddIcon />}
                size="large"
                sx={{ borderRadius: 2, py: 1.5 }}
              >
                写评价
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* 详细信息和评价 */}
        <Grid item xs={12} md={8}>
          {/* 教师简介 */}
          {teacher.bio && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="600">
                  教师简介
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                  {teacher.bio}
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* 教授课程 */}
          {teacher.subjects_list && teacher.subjects_list.length > 0 && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="600">
                  教授课程
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {teacher.subjects_list.map((subject, index) => (
                    <Chip
                      key={index}
                      label={subject}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}

          {/* 评分分布 */}
          {reviews.length > 0 && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="600">
                  评分分布
                </Typography>
                <Grid container spacing={2}>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <Grid item xs={12} key={rating}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body2" sx={{ minWidth: 40 }}>
                          {rating} 星
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={(ratingDistribution[rating] || 0) / reviews.length * 100}
                          sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                        />
                        <Typography variant="body2" sx={{ minWidth: 30 }}>
                          {ratingDistribution[rating] || 0}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          )}

          {/* 学生评价 */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="600">
                学生评价 ({reviews.length})
              </Typography>
              
              {reviewsLoading ? (
                <Box display="flex" justifyContent="center" py={4}>
                  <CircularProgress />
                </Box>
              ) : reviews.length > 0 ? (
                <Box>
                  {reviews.map((review, index) => (
                    <Paper key={review.id} elevation={1} sx={{ p: 3, mb: 2, borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="600">
                            {review.student_name || '匿名用户'}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {new Date(review.created_at).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Rating value={review.overall_rating} readOnly size="small" />
                      </Box>
                      
                      <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
                        {review.content}
                      </Typography>
                      
                      {(() => {
                        // 安全处理tags字段，支持字符串和数组两种格式
                        let tagsArray: string[] = [];
                        if (review.tags) {
                          if (Array.isArray(review.tags)) {
                            tagsArray = review.tags;
                          } else if (typeof review.tags === 'string') {
                            // 如果是字符串，按逗号分割
                            tagsArray = review.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
                          }
                        }
                        
                        return tagsArray.length > 0 && (
                          <Box sx={{ mb: 2 }}>
                            {tagsArray.map((tag, tagIndex) => (
                              <Chip 
                                key={tagIndex}
                                label={tag} 
                                size="small" 
                                sx={{ mr: 0.5, mb: 0.5 }}
                              />
                            ))}
                          </Box>
                        );
                      })()}
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', gap: 2, fontSize: '0.875rem' }}>
                          <Typography variant="caption">
                            课程: {getCourseFullName(review.course)}
                          </Typography>
                          <Typography variant="caption">
                            难度: {review.difficulty_rating}/5
                          </Typography>
                          <Typography variant="caption">
                            再选: {review.would_take_again ? '愿意' : '不愿意'}
                          </Typography>
                        </Box>
                        
                        <Button
                          size="small"
                          startIcon={<ThumbUpIcon />}
                          onClick={() => handleMarkHelpful(review.id)}
                          disabled={review.is_helpful}
                        >
                          {review.is_helpful ? '已点赞' : '有用'} ({review.helpful_count})
                        </Button>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <SchoolIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    暂无评价
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    成为第一个评价这位教师的学生
                  </Typography>
                  <Button
                    component={Link}
                    to={`/teachers/${teacher.id}/add-review`}
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{ borderRadius: 2 }}
                  >
                    写评价
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TeacherDetailPage;
