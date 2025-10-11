import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  Grid,
  useTheme,
} from '@mui/material';

const Footer: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: theme.palette.primary.main,
        color: 'white',
        py: 4,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              CDUT-OBU 教师评价系统
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
              成都理工大学与牛津布鲁克斯大学合作办学软件工程专业教师评价平台，
              为学生提供客观、真实的教师教学反馈信息。
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              快速链接
            </Typography>
            <Box>
              <Link 
                href="/teachers" 
                color="inherit" 
                sx={{ display: 'block', mb: 1, opacity: 0.9, textDecoration: 'none' }}
              >
                教师列表
              </Link>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              联系我们
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              成都理工大学
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              牛津布鲁克斯学院
            </Typography>
          </Grid>
        </Grid>
        
        <Box 
          sx={{ 
            borderTop: '1px solid rgba(255, 255, 255, 0.2)', 
            mt: 4, 
            pt: 3, 
            textAlign: 'center' 
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © 2024 成都理工大学与牛津布鲁克斯大学合作办学 教师评价系统
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
