import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  RateReview as ReviewIcon,
} from '@mui/icons-material';

// 导入hooks返回类型
import { useReviewManagement } from '../../../hooks';

// 导入子组件
import ReviewStats from './ReviewStats';
import ReviewFilters from './ReviewFilters';
import ReviewList from './ReviewList';
import ReviewDialog from './ReviewDialog';

type ReviewManagementProps = ReturnType<typeof useReviewManagement>;

const ReviewManagement: React.FC<ReviewManagementProps> = ({
  reviews,
  reviewsLoading,
  openReviewDialog,
  selectedReview,
  reviewFilters,
  loadReviews,
  handleViewReview,
  handleCloseReviewDialog,
  handleDeleteReview,
  handleReviewFilterChange,
  applyReviewFilters,
}) => {
  return (
    <Box>
      {/* 统计卡片 */}
      <ReviewStats reviews={reviews} />

      {/* 评论管理卡片 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <ReviewIcon color="primary" />
            <Typography variant="h6" fontWeight="600">
              评论管理 ({reviews.length})
            </Typography>
          </Box>

          {/* 过滤器 */}
          <ReviewFilters
            filters={reviewFilters}
            onFilterChange={handleReviewFilterChange}
            onApply={applyReviewFilters}
          />

          {reviewsLoading ? (
            <Box display="flex" justifyContent="center" py={8}>
              <CircularProgress size={40} />
            </Box>
          ) : (
            <ReviewList
              reviews={reviews}
              onView={handleViewReview}
              onDelete={handleDeleteReview}
            />
          )}
        </CardContent>
      </Card>

      {/* 评论详情对话框 */}
      <ReviewDialog
        open={openReviewDialog}
        review={selectedReview}
        onClose={handleCloseReviewDialog}
      />
    </Box>
  );
};

export default ReviewManagement;
