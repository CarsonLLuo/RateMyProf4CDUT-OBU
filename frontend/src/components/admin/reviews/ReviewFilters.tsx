import React from 'react';
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

import { ReviewFilters } from '../../../types';

interface ReviewFiltersProps {
  filters: ReviewFilters;
  onFilterChange: (field: keyof ReviewFilters, value: string) => void;
  onApply: () => void;
}

const ReviewFiltersComponent: React.FC<ReviewFiltersProps> = ({
  filters,
  onFilterChange,
  onApply,
}) => {
  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={12} md={4}>
        <FormControl fullWidth size="small">
          <InputLabel>筛选教师</InputLabel>
          <Select
            value={filters.teacher || ''}
            onChange={(e) => onFilterChange('teacher', e.target.value)}
            label="筛选教师"
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="">全部教师</MenuItem>
            {/* 这里应该动态加载教师列表 */}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={3}>
        <FormControl fullWidth size="small">
          <InputLabel>课程</InputLabel>
          <Select
            value={filters.course || ''}
            onChange={(e) => onFilterChange('course', e.target.value)}
            label="课程"
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="">全部课程</MenuItem>
            <MenuItem value="问题解决与编程">问题解决与编程</MenuItem>
            <MenuItem value="面向对象编程">面向对象编程</MenuItem>
            <MenuItem value="软件工程">软件工程</MenuItem>
            <MenuItem value="人机交互">人机交互</MenuItem>
            <MenuItem value="DevOps">DevOps</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={3}>
        <FormControl fullWidth size="small">
          <InputLabel>最低评分</InputLabel>
          <Select
            value={filters.min_rating || ''}
            onChange={(e) => onFilterChange('min_rating', e.target.value)}
            label="最低评分"
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="">全部评分</MenuItem>
            <MenuItem value="1">1分以上</MenuItem>
            <MenuItem value="2">2分以上</MenuItem>
            <MenuItem value="3">3分以上</MenuItem>
            <MenuItem value="4">4分以上</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={2}>
        <Button
          fullWidth
          variant="outlined"
          onClick={onApply}
          startIcon={<SearchIcon />}
          sx={{ borderRadius: 2, height: 40 }}
        >
          筛选
        </Button>
      </Grid>
    </Grid>
  );
};

export default ReviewFiltersComponent;
