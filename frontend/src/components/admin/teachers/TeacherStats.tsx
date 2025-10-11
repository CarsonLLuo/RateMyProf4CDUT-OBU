import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
} from '@mui/material';
import {
  School as SchoolIcon,
  RateReview as ReviewIcon,
  Star as StarIcon,
} from '@mui/icons-material';

import { Teacher } from '../../../types';

interface TeacherStatsProps {
  teachers: Teacher[];
}

const TeacherStats: React.FC<TeacherStatsProps> = ({ teachers }) => {
  // 计算统计数据
  const totalTeachers = teachers.length;
  const totalReviews = teachers.reduce((sum, t) => sum + t.total_reviews, 0);
  const averageRating = teachers.length > 0 
    ? (teachers.reduce((sum, t) => sum + parseFloat(String(t.average_rating || 0)), 0) / teachers.length)
    : 0;

  const statsConfig = [
    {
      title: '教师总数',
      value: totalTeachers,
      color: 'primary.main',
      icon: <SchoolIcon sx={{ fontSize: 30 }} />,
      bgColor: 'primary.50',
    },
    {
      title: '评价总数',
      value: totalReviews,
      color: 'secondary.main', 
      icon: <ReviewIcon sx={{ fontSize: 30 }} />,
      bgColor: 'secondary.50',
    },
    {
      title: '平均评分',
      value: averageRating.toFixed(1),
      color: 'success.main',
      icon: <StarIcon sx={{ fontSize: 30 }} />,
      bgColor: 'success.50',
    },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {statsConfig.map((stat, index) => (
        <Grid item xs={12} md={4} key={index}>
          <Card 
            elevation={0}
            sx={{ 
              border: 1, 
              borderColor: 'grey.200',
              transition: 'all 0.2s',
              '&:hover': {
                boxShadow: 2,
                transform: 'translateY(-2px)',
              }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: stat.bgColor,
                    color: stat.color,
                    mr: 2,
                  }}
                >
                  {stat.icon}
                </Box>
                <Typography variant="body2" color="text.secondary" fontWeight="500">
                  {stat.title}
                </Typography>
              </Box>
              
              <Typography 
                variant="h3" 
                color={stat.color} 
                fontWeight="700"
                sx={{ textAlign: 'center' }}
              >
                {stat.value}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default TeacherStats;
