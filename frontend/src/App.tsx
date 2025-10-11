import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';

import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import TeachersPage from './pages/TeachersPage';
import TeacherDetailPage from './pages/TeacherDetailPage';
import AddReviewPage from './pages/AddReviewPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';

const App: React.FC = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      backgroundColor: 'background.default'
    }}>
      {/* 不在登录页时显示Header */}
      {!isLoginPage && <Header />}
      
      <Box sx={{ flex: 1, pt: isLoginPage ? 0 : 2, pb: isLoginPage ? 0 : 4 }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          {/* 所有其他路由都需要登录保护 */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teachers" 
            element={
              <ProtectedRoute>
                <TeachersPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teachers/:id" 
            element={
              <ProtectedRoute>
                <TeacherDetailPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teachers/:id/add-review" 
            element={
              <ProtectedRoute>
                <AddReviewPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Box>
      
      {/* 不在登录页时显示Footer */}
      {!isLoginPage && <Footer />}
    </Box>
  );
};

export default App;
