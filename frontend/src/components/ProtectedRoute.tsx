import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // 检查用户是否已登录
  const isAuthenticated = () => {
    const userType = localStorage.getItem('userType');
    const accessToken = localStorage.getItem('accessToken');
    return userType && accessToken;
  };

  // 如果未登录，重定向到登录页
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // 如果已登录，渲染子组件
  return children;
};

export default ProtectedRoute;
