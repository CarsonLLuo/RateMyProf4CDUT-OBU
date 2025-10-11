import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Button,
  Avatar,
  Chip,
  CircularProgress,
  Pagination,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  Star as StarIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { teachersApi } from '../services/api';
import { Teacher } from '../types';

// 本地类型定义
interface TeacherFilters {
  search: string;
  min_rating: string;
  ordering: string;
}

interface PaginationState {
  page: number;
  total_pages: number;
  count: number;
}

const TeachersPage: React.FC = () => {
  const theme = useTheme();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<TeacherFilters>({
    search: '',
    min_rating: '',
    ordering: '-average_rating',
  });
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    total_pages: 1,
    count: 0,
  });

  useEffect(() => {
    loadTeachers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, pagination.page]);

  const loadTeachers = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        search: filters.search || undefined,
        min_rating: filters.min_rating ? parseFloat(filters.min_rating) : undefined,
        ordering: filters.ordering,
      };
      
      const response = await teachersApi.getTeachers(params);
      setTeachers(response.results || []);
      setPagination(prev => ({
        ...prev,
        total_pages: Math.ceil(response.count / 20),
        count: response.count,
      }));
    } catch (error) {
      console.error('加载教师列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field: keyof TeacherFilters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const renderRatingStars = (rating: number): React.ReactElement[] => {
    const stars: React.ReactElement[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <StarIcon key={i} sx={{ color: 'orange', fontSize: 16 }} />
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <StarIcon key="half" sx={{ color: 'orange', fontSize: 16, opacity: 0.5 }} />
      );
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <StarIcon key={`empty-${i}`} sx={{ color: 'lightgray', fontSize: 16 }} />
      );
    }
    
    return stars;
  };

  return (
    <Container maxWidth="lg">
      {/* 页面标题 */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="600">
          教师列表
        </Typography>
        <Typography variant="body1" color="textSecondary">
          浏览所有教师信息，查看评分和评价
        </Typography>
      </Box>

      {/* 搜索和过滤器 */}
      <Card sx={{ mb: 4, p: 3, borderRadius: 2 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="搜索教师姓名或课程..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>最低评分</InputLabel>
              <Select
                value={filters.min_rating}
                onChange={(e) => handleFilterChange('min_rating', e.target.value)}
                label="最低评分"
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="">全部</MenuItem>
                <MenuItem value="4">4分以上</MenuItem>
                <MenuItem value="3.5">3.5分以上</MenuItem>
                <MenuItem value="3">3分以上</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>排序方式</InputLabel>
              <Select
                value={filters.ordering}
                onChange={(e) => handleFilterChange('ordering', e.target.value)}
                label="排序方式"
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="-average_rating">评分高到低</MenuItem>
                <MenuItem value="average_rating">评分低到高</MenuItem>
                <MenuItem value="-total_reviews">评价数量多到少</MenuItem>
                <MenuItem value="name">姓名A-Z</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={loadTeachers}
              sx={{ borderRadius: 2 }}
            >
              筛选
            </Button>
          </Grid>
        </Grid>
      </Card>

      {/* 加载状态 */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress size={40} />
        </Box>
      ) : (
        <>
          {/* 教师列表 */}
          <Grid container spacing={3}>
            {teachers.map((teacher) => (
              <Grid item xs={12} sm={6} md={4} key={teacher.id}>
                <Card 
                  component={Link}
                  to={`/teachers/${teacher.id}`}
                  sx={{
                    height: '100%',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    borderRadius: 2,
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[8],
                    }
                  }}
                >
                  <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {/* 教师基本信息 */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        src={teacher.image}
                        sx={{ width: 60, height: 60, mr: 2 }}
                        alt={teacher.name}
                      >
                        {teacher.name.charAt(0)}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" fontWeight="600" sx={{ mb: 0.5, color: 'text.primary' }}>
                          {teacher.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {teacher.department}
                        </Typography>
                      </Box>
                    </Box>

                    {/* 评分信息 */}
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ display: 'flex', mr: 1 }}>
                          {renderRatingStars(parseFloat(String(teacher.average_rating || 0)))}
                        </Box>
                        <Typography variant="body2" fontWeight="600">
                          {parseFloat(String(teacher.average_rating || 0)).toFixed(1)}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                          ({teacher.total_reviews} 条评价)
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 2, fontSize: '0.85rem' }}>
                        <Box>
                          <Typography variant="caption" color="textSecondary">
                            难度: {parseFloat(String(teacher.difficulty_rating || 0)).toFixed(1)}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="textSecondary">
                            再选率: {parseFloat(String(teacher.would_take_again_percentage || 0)).toFixed(0)}%
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* 教授科目 */}
                    {teacher.subjects_list && teacher.subjects_list.length > 0 && (
                      <Box sx={{ mt: 'auto' }}>
                        {teacher.subjects_list.slice(0, 3).map((subject, index) => (
                          <Chip
                            key={index}
                            label={subject}
                            size="small"
                            sx={{ 
                              mr: 0.5, 
                              mb: 0.5, 
                              fontSize: '0.75rem',
                              bgcolor: theme.palette.primary.main,
                              color: 'white',
                              height: 24,
                              '&:hover': {
                                bgcolor: theme.palette.primary.dark,
                              }
                            }}
                          />
                        ))}
                        {teacher.subjects_list.length > 3 && (
                          <Typography variant="caption" color="textSecondary">
                            +{teacher.subjects_list.length - 3} 更多
                          </Typography>
                        )}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* 分页 */}
          {pagination.total_pages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={pagination.total_pages}
                page={pagination.page}
                onChange={handlePageChange}
                size="large"
                sx={{
                  '& .MuiPaginationItem-root': {
                    borderRadius: 2,
                    '&.Mui-selected': {
                      bgcolor: theme.palette.primary.main,
                      color: 'white',
                    }
                  }
                }}
              />
            </Box>
          )}

          {/* 无数据提示 */}
          {teachers.length === 0 && !loading && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                没有找到符合条件的教师
              </Typography>
              <Button 
                variant="outlined" 
                sx={{ mt: 2, borderRadius: 2 }}
                onClick={() => {
                  setFilters({ search: '', min_rating: '', ordering: '-average_rating' });
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
              >
                重置筛选条件
              </Button>
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default TeachersPage;
