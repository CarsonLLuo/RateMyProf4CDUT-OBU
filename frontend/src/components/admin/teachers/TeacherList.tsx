import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

import { Teacher } from '../../../types';

interface TeacherListProps {
  teachers: Teacher[];
  onEdit: (teacher: Teacher) => void;
  onDelete: (teacherId: number, teacherName: string) => void;
}

const TeacherList: React.FC<TeacherListProps> = ({ teachers, onEdit, onDelete }) => {
  if (teachers.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          暂无教师数据
        </Typography>
        <Typography variant="body2" color="text.secondary">
          点击上方"添加教师"按钮来添加第一位教师
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
            <TableCell sx={{ fontWeight: 600 }}>头像</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>姓名</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>系别</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>教授课程</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>评价数</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>平均评分</TableCell>
            <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>操作</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {teachers.map((teacher) => (
            <TableRow 
              key={teacher.id} 
              hover
              sx={{ 
                '&:hover': { bgcolor: 'grey.50' },
                transition: 'background-color 0.15s'
              }}
            >
              <TableCell>
                <Avatar 
                  src={teacher.image} 
                  sx={{ width: 48, height: 48 }}
                  alt={teacher.name}
                >
                  {teacher.name.charAt(0)}
                </Avatar>
              </TableCell>
              
              <TableCell>
                <Typography variant="body1" fontWeight="600">
                  {teacher.name}
                </Typography>
              </TableCell>
              
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {teacher.department}
                </Typography>
              </TableCell>
              
              <TableCell>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxWidth: 250 }}>
                  {teacher.subjects_list?.slice(0, 3).map((subject, index) => (
                    <Chip
                      key={index}
                      label={subject}
                      size="small"
                      variant="outlined"
                      sx={{ 
                        fontSize: '0.75rem',
                        height: 24,
                        '& .MuiChip-label': { px: 1 }
                      }}
                    />
                  ))}
                  {teacher.subjects_list && teacher.subjects_list.length > 3 && (
                    <Chip
                      label={`+${teacher.subjects_list.length - 3}`}
                      size="small"
                      variant="filled"
                      color="primary"
                      sx={{ 
                        fontSize: '0.75rem',
                        height: 24,
                        '& .MuiChip-label': { px: 1 }
                      }}
                    />
                  )}
                  {(!teacher.subjects_list || teacher.subjects_list.length === 0) && (
                    <Typography variant="caption" color="text.secondary">
                      暂无课程信息
                    </Typography>
                  )}
                </Box>
              </TableCell>
              
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography 
                    variant="body2" 
                    fontWeight="600"
                    color={teacher.total_reviews > 0 ? 'text.primary' : 'text.secondary'}
                  >
                    {teacher.total_reviews}
                  </Typography>
                  {teacher.total_reviews === 0 && (
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                      条
                    </Typography>
                  )}
                </Box>
              </TableCell>
              
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography 
                    variant="body2" 
                    fontWeight="600"
                    color={teacher.average_rating > 0 ? 'warning.main' : 'text.secondary'}
                  >
                    {parseFloat(String(teacher.average_rating || 0)).toFixed(1)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                    /5.0
                  </Typography>
                </Box>
              </TableCell>
              
              <TableCell>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                  <Tooltip title="编辑教师信息" arrow>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => onEdit(teacher)}
                      sx={{ 
                        '&:hover': { bgcolor: 'primary.50' },
                        transition: 'all 0.2s'
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="删除教师" arrow>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onDelete(teacher.id, teacher.name)}
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

export default TeacherList;
