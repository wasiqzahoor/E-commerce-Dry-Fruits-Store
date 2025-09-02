import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  // Agar user logged in hai aur admin hai, tab hi page dikhao
  if (isAuthenticated && user.role === 'admin') {
    return children;
  }

  // Warna usay homepage par bhej do (ya login page par)
  return <Navigate to="/" replace />;
};

export default AdminProtectedRoute;