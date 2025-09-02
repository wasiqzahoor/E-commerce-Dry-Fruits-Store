import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. Context banayein
const AuthContext = createContext();

// 2. Provider Component banayein
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Taake initial check ke waqt UI disturb na ho

  // Ye effect component ke mount hone par aik baar chalega
  useEffect(() => {
    try {
      // localStorage se user ka data nikalne ki koshish karein
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        setUser(JSON.parse(userInfo));
      }
    } catch (error) {
      console.error("Failed to parse user info from localStorage", error);
      localStorage.removeItem('userInfo'); // Agar data corrupt hai to usay hata dein
    } finally {
      setLoading(false); // Check complete, loading band kar dein
    }
  }, []);

  // Login function
  const login = (userData) => {
    // User data ko state mein set karein
    setUser(userData);
    // User data ko localStorage mein save karein taake page refresh par login state bani rahe
    localStorage.setItem('userInfo', JSON.stringify(userData));
  };

  // Logout function
  const logout = () => {
    // State se user data hata dein
    setUser(null);
    // localStorage se user data hata dein
    localStorage.removeItem('userInfo');
  };

  // 3. Context ki value provide karein
  const value = {
    user,
    isAuthenticated: !!user, // Ye true hoga agar user object mojood hai, warna false
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 4. Ek custom hook banayein
export const useAuth = () => {
  return useContext(AuthContext);
};