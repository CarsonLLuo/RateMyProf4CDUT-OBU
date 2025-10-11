import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Paper,
  Avatar,
  Chip,
  useTheme,
  CircularProgress,
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  School as SchoolIcon,
  Star as StarIcon,
  RateReview as ReviewIcon,
  TrendingUp as TrendingIcon,
} from '@mui/icons-material';

import { teachersApi } from '../services/api';
import { Teacher } from '../types';

// 本地类型定义
interface HomeStats {
  teachers: number;
  reviews: number;
  departments: number;
}

const HomePage: React.FC = () => {
  const theme = useTheme();
  const [stats, setStats] = useState<HomeStats | null>(null);
  const [topTeachers, setTopTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // 并行请求数据
      const [teacherStatsRes, topTeachersRes] = await Promise.all([
        teachersApi.getTeacherStats(),
        teachersApi.getTeachers({ ordering: '-average_rating', page_size: 8 }),
      ]);

      setStats({
        teachers: teacherStatsRes.total_teachers,
        reviews: teacherStatsRes.total_reviews,
        departments: teacherStatsRes.teachers_with_reviews || 1,
      });
      
      setTopTeachers(topTeachersRes.results || []);
      
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      {/* 欢迎横幅 */}
      <Paper
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          p: 6,
          mb: 4,
          borderRadius: 3,
          textAlign: 'center',
        }}
      >
        {/* 学校Logo展示 */}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3 }}>
          <img 
            src="/CDUT.png" 
            alt="成都理工大学" 
            style={{ 
              height: '60px', 
              width: 'auto',
              marginRight: '20px',
              filter: 'brightness(0) invert(1)' // 白色滤镜
            }} 
          />
          
          <img 
            src="/OBU.png" 
            alt="牛津布鲁克斯大学" 
            style={{ 
              height: '60px', 
              width: 'auto',
              marginLeft: '20px',
              filter: 'brightness(0) invert(1)' // 白色滤镜
            }} 
          />
        </Box>
        
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          CDUT-OBU 教师评价系统
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9, mb: 3, maxWidth: '600px', mx: 'auto' }}>
          成都理工大学与牛津布鲁克斯大学合作办学软件工程专业
          <br />
          真实、客观的教师教学评价平台
        </Typography>
      </Paper>

      {/* 统计数据 */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: 'center', p: 2, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
              <CardContent>
                <Avatar sx={{ bgcolor: theme.palette.primary.main, mx: 'auto', mb: 2, width: 56, height: 56 }}>
                  <SchoolIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Typography variant="h4" color="primary" fontWeight="600">
                  {stats.teachers}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  位教师
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: 'center', p: 2, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
              <CardContent>
                <Avatar sx={{ bgcolor: theme.palette.secondary.main, mx: 'auto', mb: 2, width: 56, height: 56 }}>
                  <ReviewIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Typography variant="h4" color="secondary" fontWeight="600">
                  {stats.reviews}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  条评价
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: 'center', p: 2, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
              <CardContent>
                <Avatar sx={{ bgcolor: theme.palette.success.main, mx: 'auto', mb: 2, width: 56, height: 56 }}>
                  <TrendingIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Typography variant="h4" color="success.main" fontWeight="600">
                  {stats.departments}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  个专业
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <Grid container spacing={4}>
        {/* 热门教师 */}
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            热门教师
          </Typography>
          
          {topTeachers.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                暂无教师数据
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {topTeachers.map((teacher) => (
                <Grid item xs={12} sm={6} key={teacher.id}>
                  <Card 
                    component={Link} 
                    to={`/teachers/${teacher.id}`}
                    sx={{ 
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      '&:hover': { 
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[8]
                      }
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                          src={teacher.image}
                          sx={{ width: 50, height: 50, mr: 2 }}
                          alt={teacher.name}
                        >
                          {teacher.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight="600" color="text.primary">
                            {teacher.name}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {teacher.department}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <StarIcon sx={{ color: 'orange', fontSize: 18, mr: 0.5 }} />
                          <Typography variant="body2" fontWeight="600">
                            {parseFloat(String(teacher.average_rating || 0)).toFixed(1)}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="textSecondary">
                          {teacher.total_reviews} 条评价
                        </Typography>
                      </Box>
                      
                      {teacher.subjects_list && teacher.subjects_list.length > 0 && (
                        <Box sx={{ mt: 1 }}>
                          {teacher.subjects_list.slice(0, 2).map((subject, index) => (
                            <Chip
                              key={index}
                              label={subject}
                              size="small"
                              variant="outlined"
                              sx={{ 
                                mr: 0.5, 
                                mb: 0.5, 
                                fontSize: '0.75rem',
                                height: 24
                              }}
                            />
                          ))}
                          {teacher.subjects_list.length > 2 && (
                            <Chip
                              label={`+${teacher.subjects_list.length - 2}`}
                              size="small"
                              color="primary"
                              sx={{ 
                                mr: 0.5, 
                                mb: 0.5, 
                                fontSize: '0.75rem',
                                height: 24
                              }}
                            />
                          )}
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomePage;
