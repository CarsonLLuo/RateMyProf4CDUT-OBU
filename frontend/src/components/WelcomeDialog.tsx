import React, { useEffect } from 'react';
import {
  Dialog,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';

interface WelcomeDialogProps {
  open: boolean;
  onClose: () => void;
}

const WelcomeDialog: React.FC<WelcomeDialogProps> = ({ open, onClose }) => {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onClose();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  return (
    <Dialog
      open={open}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: '0 24px 48px rgba(27, 60, 111, 0.15)',
          p: 4,
          textAlign: 'center',
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }
      }}
    >
      <Box sx={{ 
        color: '#1B3C6F',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        animation: 'scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }}>
        <CheckCircleOutline sx={{ fontSize: 80 }} />
      </Box>
      
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1B3C6F', mb: 1 }}>
          登录成功
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
          正在进入系统
          <CircularProgress size={16} thickness={5} sx={{ color: 'text.secondary' }} />
        </Typography>
      </Box>

      <style>
        {`
          @keyframes scaleIn {
            from { transform: scale(0.5); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </Dialog>
  );
};

export default WelcomeDialog;
