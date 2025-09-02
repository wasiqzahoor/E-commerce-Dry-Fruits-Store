import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Jab AuthContext initial check kar raha ho, to kuch na dikhayein
  if (loading) {
    return <div>Loading...</div>; // Ya ek proper spinner component
  }

  // Agar check ho chuka hai aur user logged in nahi hai, to usay auth page par bhej dein
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Agar user logged in hai, to usay woh page dikhayein jis par woh jana chahta tha
  return children;
};

export default ProtectedRoute;