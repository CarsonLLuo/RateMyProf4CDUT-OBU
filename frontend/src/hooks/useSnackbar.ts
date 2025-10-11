import { useState, useCallback } from 'react';
import { SnackbarState } from '../types';

interface UseSnackbarReturn {
  snackbar: SnackbarState;
  showSnackbar: (message: string, severity?: SnackbarState['severity']) => void;
  hideSnackbar: () => void;
}

const initialSnackbarState: SnackbarState = {
  open: false,
  message: '',
  severity: 'success'
};

export const useSnackbar = (): UseSnackbarReturn => {
  const [snackbar, setSnackbar] = useState<SnackbarState>(initialSnackbarState);

  const showSnackbar = useCallback((message: string, severity: SnackbarState['severity'] = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  }, []);

  const hideSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  return {
    snackbar,
    showSnackbar,
    hideSnackbar,
  };
};
