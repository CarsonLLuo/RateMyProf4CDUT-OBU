import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Rating,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

import { Review } from '../../../types';
import { getCourseFullName } from '../../../utils/courseMapping';

interface ReviewListProps {
  reviews: Review[];
  onView: (review: Review) => void;
  onDelete: (reviewId: number, reviewTitle: string) => void;
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews, onView, onDelete }) => {
  if (reviews.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          暂无评论数据
        </Typography>
        <Typography variant="body2" color="text.secondary">
          还没有学生提交评论
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer 
      component={Paper} 
      elevation={0}
      sx={{ 
        border: 1, 
        borderColor: 'grey.200',
        borderRadius: 2,
        overflow: 'hidden'
      }}
    >
      <Table>
        <TableHead sx={{ bgcolor: 'grey.50' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>教师</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>评价者</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>内容摘要</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>评分</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>课程</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>时间</TableCell>
            <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>操作</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reviews.map((review) => (
            <TableRow 
              key={review.id} 
              hover
              sx={{ 
                '&:hover': { bgcolor: 'grey.50' },
                transition: 'background-color 0.15s'
              }}
            >
              <TableCell>
                <Typography variant="body2" fontWeight="600">
                  {review.teacher_name || 
                   (typeof review.teacher === 'object' 
                     ? review.teacher.name 
                     : `教师ID: ${review.teacher}`)
                  }
                </Typography>
              </TableCell>
              
              <TableCell>
                <Typography variant="body2">
                  {review.student_name || '匿名'}
                </Typography>
              </TableCell>
              
              <TableCell>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    maxWidth: 200, 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap' 
                  }}
                >
                  {review.content}
                </Typography>
              </TableCell>
              
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Rating value={review.overall_rating} readOnly size="small" />
                  <Typography variant="caption" sx={{ ml: 1 }}>
                    ({review.overall_rating})
                  </Typography>
                </Box>
              </TableCell>
              
              <TableCell>
                <Chip 
                  label={getCourseFullName(review.course)} 
                  size="small" 
                  variant="outlined" 
                  sx={{ fontSize: '0.75rem' }}
                />
              </TableCell>
              
              <TableCell>
                <Typography variant="caption" color="text.secondary">
                  {new Date(review.created_at).toLocaleDateString()}
                </Typography>
              </TableCell>
              
              <TableCell>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                  <Tooltip title="查看详情" arrow>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => onView(review)}
                      sx={{ 
                        '&:hover': { bgcolor: 'primary.50' },
                        transition: 'all 0.2s'
                      }}
                    >
                      <ViewIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="删除评论" arrow>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onDelete(review.id, review.content.substring(0, 20) + '...')}
                      sx={{ 
                        '&:hover': { bgcolor: 'error.50' },
                        transition: 'all 0.2s'
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ReviewList;
