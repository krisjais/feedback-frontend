'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from './api';

const AuthContext = createContext(null);

const normalizeRole = (role) => {
  if (role === 'hr') return 'hr_officer';
  if (role === 'superadmin') return 'super_admin';
  return role;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize session from server-side HTTP-only cookie or fallback token
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const res = await api.get('/auth/me');
        if (res.data.success && res.data.user) {
          const normalizedUser = {
            ...res.data.user,
            role: normalizeRole(res.data.user.role),
          };
          setUser(normalizedUser);
          if (typeof window !== 'undefined') {
            localStorage.setItem('cv_user', JSON.stringify(normalizedUser));
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        // Fallback: check localStorage if server cookie failed
        if (typeof window !== 'undefined') {
          const savedUser = localStorage.getItem('cv_user');
          const savedToken = localStorage.getItem('cv_token');
          if (savedUser && savedToken) {
            try {
              const parsed = JSON.parse(savedUser);
              parsed.role = normalizeRole(parsed.role);
              setUser(parsed);
              setToken(savedToken);
            } catch (e) {
              logout();
            }
          } else {
            setUser(null);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      const { token: newToken, user: newUser } = res.data;
      const normalizedUser = {
        ...newUser,
        role: normalizeRole(newUser.role),
      };
      setToken(newToken);
      setUser(normalizedUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('cv_token', newToken);
        localStorage.setItem('cv_user', JSON.stringify(normalizedUser));
      }
      return normalizedUser;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  const demoLogin = async (role) => {
    const res = await api.post('/auth/demo-login', { role });
    if (res.data.success) {
      const { token: newToken, user: newUser } = res.data;
      const normalizedUser = {
        ...newUser,
        role: normalizeRole(newUser.role),
      };
      setToken(newToken);
      setUser(normalizedUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('cv_token', newToken);
        localStorage.setItem('cv_user', JSON.stringify(normalizedUser));
      }
      return normalizedUser;
    }
    throw new Error(res.data.message || 'Demo login failed');
  };

  const register = async (studentData) => {
    // SECURITY: Ensure client never passes a privileged role
    const sanitizedData = { ...studentData };
    delete sanitizedData.role;
    delete sanitizedData.accountStatus;
    delete sanitizedData.status;

    const res = await api.post('/auth/register', sanitizedData);
    if (res.data.success) {
      const { token: newToken, user: newUser } = res.data;
      const normalizedUser = {
        ...newUser,
        role: normalizeRole(newUser.role),
      };
      setToken(newToken);
      setUser(normalizedUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('cv_token', newToken);
        localStorage.setItem('cv_user', JSON.stringify(normalizedUser));
      }
      return normalizedUser;
    }
    throw new Error(res.data.message || 'Registration failed');
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Ignore network errors on logout
    } finally {
      setToken(null);
      setUser(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cv_token');
        localStorage.removeItem('cv_user');
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        demoLogin,
        register,
        logout,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
