import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
} from '@mui/material';
import {
  People as PeopleIcon,
  School as StudentIcon,
  AdminPanelSettings as AdminIcon,
  CheckCircle as ActiveIcon,
} from '@mui/icons-material';

import { UserStats } from '../../../types';

interface UserStatsProps {
  userStats: UserStats | null;
}

const UserStatsComponent: React.FC<UserStatsProps> = ({ userStats }) => {
  if (!userStats) {
    return null;
  }

  const statsConfig = [
    {
      title: '用户总数',
      value: userStats.total_users || 0,
      color: 'primary.main',
      icon: <PeopleIcon sx={{ fontSize: 30 }} />,
      bgColor: 'primary.50',
    },
    {
      title: '学生用户',
      value: userStats.student_count || 0,
      color: 'info.main', 
      icon: <StudentIcon sx={{ fontSize: 30 }} />,
      bgColor: 'info.50',
    },
    {
      title: '管理员',
      value: userStats.admin_count || 0,
      color: 'warning.main',
      icon: <AdminIcon sx={{ fontSize: 30 }} />,
      bgColor: 'warning.50',
    },
    {
      title: '活跃用户',
      value: userStats.active_users || 0,
      color: 'success.main',
      icon: <ActiveIcon sx={{ fontSize: 30 }} />,
      bgColor: 'success.50',
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

export default UserStatsComponent;
