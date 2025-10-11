import React from 'react';
import AdminLayout from '../components/admin/AdminLayout';

/**
 * 管理面板页面
 * 
 * 这是重构后的AdminPage，完全使用TypeScript和模块化组件构建。
 * 替代了原来1603行的巨型AdminPage.js组件。
 * 
 * 新架构优势：
 * - 100% TypeScript类型安全
 * - 模块化组件设计
 * - 可复用的业务逻辑hooks
 * - 清晰的职责分离
 * - 易于维护和扩展
 */
const AdminPage: React.FC = () => {
  return <AdminLayout />;
};

export default AdminPage;
