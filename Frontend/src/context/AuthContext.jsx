import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { AuthContext } from './authContextInstance';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('bunnybook_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('bunnybook_token') || null);
  const [loading, setLoading] = useState(true);

  // Logout handler
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('bunnybook_token');
    localStorage.removeItem('bunnybook_user');
  };

  // Check current session on mount
  useEffect(() => {
    let isMounted = true;

    const verifyUser = async () => {
      if (token) {
        try {
          const res = await API.get('/auth/me');
          if (isMounted) {
            setUser(res.data.user);
            localStorage.setItem('bunnybook_user', JSON.stringify(res.data.user));
          }
        } catch {
          if (isMounted) {
            logout();
          }
        }
      }
      if (isMounted) {
        setLoading(false);
      }
    };

    verifyUser();

    return () => {
      isMounted = false;
    };
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('bunnybook_token', res.data.token);
      localStorage.setItem('bunnybook_user', JSON.stringify(res.data.user));
      return res.data.user;
    }
  };

  // Register handler
  const register = async (userData) => {
    const res = await API.post('/auth/register', userData);
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('bunnybook_token', res.data.token);
      localStorage.setItem('bunnybook_user', JSON.stringify(res.data.user));
      return res.data.user;
    }
  };

  // Update profile handler
  const updateProfile = async (profileData) => {
    const res = await API.put('/auth/profile', profileData);
    if (res.data.success) {
      setUser(res.data.user);
      localStorage.setItem('bunnybook_user', JSON.stringify(res.data.user));
      return res.data;
    }
    return res.data;
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    updateProfile,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
