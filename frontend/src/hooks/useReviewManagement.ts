import { useState, useCallback } from 'react';
import { 
  Review, 
  ReviewFilters, 
  SnackbarState 
} from '../types';
import { reviewsApi } from '../services/api';

interface UseReviewManagementProps {
  showSnackbar: (message: string, severity?: SnackbarState['severity']) => void;
  onReviewDeleted?: () => void; // 回调函数，用于刷新教师统计
}

interface UseReviewManagementReturn {
  // 状态
  reviews: Review[];
  reviewsLoading: boolean;
  openReviewDialog: boolean;
  selectedReview: Review | null;
  reviewFilters: ReviewFilters;
  
  // 操作函数
  loadReviews: () => Promise<void>;
  handleViewReview: (review: Review) => void;
  handleCloseReviewDialog: () => void;
  handleDeleteReview: (reviewId: number, reviewTitle: string) => Promise<void>;
  handleReviewFilterChange: (field: keyof ReviewFilters, value: string) => void;
  applyReviewFilters: () => void;
}

const initialReviewFilters: ReviewFilters = {
  teacher: '',
  course: '',
  min_rating: '',
};

export const useReviewManagement = ({ 
  showSnackbar,
  onReviewDeleted
}: UseReviewManagementProps): UseReviewManagementReturn => {
  // 状态管理
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [reviewFilters, setReviewFilters] = useState<ReviewFilters>(initialReviewFilters);

  // 加载评论列表
  const loadReviews = useCallback(async () => {
    try {
      setReviewsLoading(true);
      const params = {
        page_size: 100,
        teacher: reviewFilters.teacher ? parseInt(reviewFilters.teacher) : undefined,
        course: reviewFilters.course || undefined,
        min_rating: reviewFilters.min_rating ? parseInt(reviewFilters.min_rating) : undefined,
        ordering: '-created_at',
      };
      const response = await reviewsApi.getReviewsForAdmin(params);
      setReviews(response.results || []);
    } catch (error) {
      showSnackbar('加载评论列表失败', 'error');
      console.error('Error loading reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  }, [reviewFilters.teacher, reviewFilters.course, reviewFilters.min_rating, showSnackbar]);

  // 查看评论详情
  const handleViewReview = useCallback((review: Review) => {
    setSelectedReview(review);
    setOpenReviewDialog(true);
  }, []);

  // 关闭评论对话框
  const handleCloseReviewDialog = useCallback(() => {
    setOpenReviewDialog(false);
    setSelectedReview(null);
  }, []);

  // 删除评论
  const handleDeleteReview = useCallback(async (reviewId: number, reviewTitle: string) => {
    if (!window.confirm(`确定要删除评价 "${reviewTitle}" 吗？此操作将影响教师的评分统计。`)) {
      return;
    }

    try {
      await reviewsApi.deleteReview(reviewId);
      showSnackbar('评价删除成功', 'success');
      await loadReviews();
      // 通知父组件刷新教师数据
      if (onReviewDeleted) {
        onReviewDeleted();
      }
    } catch (error) {
      showSnackbar('删除失败，请检查网络连接', 'error');
      console.error('Error deleting review:', error);
    }
  }, [showSnackbar, loadReviews, onReviewDeleted]);

  // 评论过滤器变化
  const handleReviewFilterChange = useCallback((field: keyof ReviewFilters, value: string) => {
    setReviewFilters(prev => ({ ...prev, [field]: value }));
  }, []);

  // 应用过滤器
  const applyReviewFilters = useCallback(() => {
    loadReviews();
  }, [loadReviews]);

  return {
    // 状态
    reviews,
    reviewsLoading,
    openReviewDialog,
    selectedReview,
    reviewFilters,
    
    // 操作函数
    loadReviews,
    handleViewReview,
    handleCloseReviewDialog,
    handleDeleteReview,
    handleReviewFilterChange,
    applyReviewFilters,
  };
};
