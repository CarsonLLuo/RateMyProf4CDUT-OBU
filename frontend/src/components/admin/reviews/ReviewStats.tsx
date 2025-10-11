import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
} from '@mui/material';
import {
  RateReview as ReviewIcon,
  Star as StarIcon,
  Warning as WarningIcon,
  People as PeopleIcon,
} from '@mui/icons-material';

import { Review } from '../../../types';

interface ReviewStatsProps {
  reviews: Review[];
}

const ReviewStats: React.FC<ReviewStatsProps> = ({ reviews }) => {
  // 计算统计数据
  const totalReviews = reviews.length;
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.overall_rating, 0) / reviews.length)
    : 0;
  const lowRatingCount = reviews.filter(r => r.overall_rating <= 2).length;
  const uniqueTeachers = new Set(reviews.map(r => 
    typeof r.teacher === 'object' ? r.teacher.id : r.teacher
  )).size;

  const statsConfig = [
    {
      title: '评论总数',
      value: totalReviews,
      color: 'primary.main',
      icon: <ReviewIcon sx={{ fontSize: 30 }} />,
      bgColor: 'primary.50',
    },
    {
      title: '平均评分',
      value: averageRating.toFixed(1),
      color: 'secondary.main', 
      icon: <StarIcon sx={{ fontSize: 30 }} />,
      bgColor: 'secondary.50',
    },
    {
      title: '低分评论',
      value: lowRatingCount,
      color: 'warning.main',
      icon: <WarningIcon sx={{ fontSize: 30 }} />,
      bgColor: 'warning.50',
    },
    {
      title: '涉及教师',
      value: uniqueTeachers,
      color: 'info.main',
      icon: <PeopleIcon sx={{ fontSize: 30 }} />,
      bgColor: 'info.50',
    },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {statsConfig.map((stat, index) => (
        <Grid item xs={12} md={3} key={index}>
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

export default ReviewStats;
