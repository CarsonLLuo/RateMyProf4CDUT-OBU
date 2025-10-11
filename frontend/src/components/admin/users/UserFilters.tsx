import React from 'react';
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

import { UserFilters } from '../../../types';

interface UserFiltersProps {
  filters: UserFilters;
  onFilterChange: (field: keyof UserFilters, value: string | boolean) => void;
  onApply: () => void;
}

const UserFiltersComponent: React.FC<UserFiltersProps> = ({
  filters,
  onFilterChange,
  onApply,
}) => {
  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={12} md={4}>
        <FormControl fullWidth size="small">
          <InputLabel>用户类型</InputLabel>
          <Select
            value={filters.user_type || ''}
            onChange={(e) => onFilterChange('user_type', e.target.value)}
            label="用户类型"
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="">全部类型</MenuItem>
            <MenuItem value="student">学生</MenuItem>
            <MenuItem value="admin">管理员</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          size="small"
          label="搜索用户"
          value={filters.search || ''}
          onChange={(e) => onFilterChange('search', e.target.value)}
          placeholder="输入用户名或邮箱进行搜索"
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
      </Grid>

      <Grid item xs={12} md={2}>
        <Button
          fullWidth
          variant="outlined"
          onClick={onApply}
          startIcon={<SearchIcon />}
          sx={{ borderRadius: 2, height: 40 }}
        >
          搜索
        </Button>
      </Grid>
    </Grid>
  );
};

export default UserFiltersComponent;
