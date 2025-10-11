import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Typography,
  Box,
  Rating,
  Chip,
  Paper,
  Button,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

import { Review } from '../../../types';
import { getCourseFullName } from '../../../utils/courseMapping';

interface ReviewDialogProps {
  open: boolean;
  review: Review | null;
  onClose: () => void;
}

const ReviewDialog: React.FC<ReviewDialogProps> = ({
  open,
  review,
  onClose,
}) => {
  if (!review) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle>
        <Typography variant="h6" fontWeight="600">
          评论详情
        </Typography>
        <Typography variant="body2" color="text.secondary">
          查看学生对教师的详细评价
        </Typography>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              教师信息
            </Typography>
            <Typography variant="body1" fontWeight="600">
              {review.teacher_name || 
               (typeof review.teacher === 'object' 
                 ? (review.teacher?.name || '未知教师')
                 : `教师ID: ${review.teacher}`)
              }
            </Typography>
            {typeof review.teacher === 'object' && review.teacher?.department && (
              <Typography variant="body2" color="text.secondary">
                {review.teacher.department}
              </Typography>
            )}
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              评价者
            </Typography>
            <Typography variant="body1">
              {review.student_name || '匿名用户'}
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              总体评分
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Rating value={review.overall_rating} readOnly />
              <Typography variant="body1" sx={{ ml: 1, fontWeight: 600 }}>
                {review.overall_rating}/5
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              难度评分
            </Typography>
            <Typography variant="body1" fontWeight="600">
              {review.difficulty_rating}/5
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              再次选择
            </Typography>
            <Chip
              label={review.would_take_again ? '愿意' : '不愿意'}
              color={review.would_take_again ? 'success' : 'error'}
              size="small"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              课程
            </Typography>
            <Typography variant="body1">
              {getCourseFullName(review.course)}
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              评价时间
            </Typography>
            <Typography variant="body1">
              {new Date(review.created_at).toLocaleString()}
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              评价内容
            </Typography>
            <Paper sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
              <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                {review.content}
              </Typography>
            </Paper>
          </Grid>
          
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
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  标签
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {tagsArray.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                  ))}
                </Box>
              </Grid>
            );
          })()}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button 
          onClick={onClose} 
          startIcon={<CloseIcon />}
          sx={{ borderRadius: 2 }}
        >
          关闭
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewDialog;
