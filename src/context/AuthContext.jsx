import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register'
  const [redirectAfterAuth, setRedirectAfterAuth] = useState(null);

  // Initialize auth state from localStorage and verify session
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');

    if (savedToken && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } catch (err) {
        console.error('Error parsing stored user data:', err);
      }
    }

    if (savedToken) {
      api.get('/auth/me')
        .then(res => {
          if (res.data && res.data.success && res.data.data) {
            setUser(res.data.data);
            localStorage.setItem('user', JSON.stringify(res.data.data));
          }
        })
        .catch(err => {
          // Token invalid or expired
          if (err.response && err.response.status === 401) {
            logout();
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateUser = (updatedData) => {
    setUser(prev => {
      const merged = { ...prev, ...updatedData };
      localStorage.setItem('user', JSON.stringify(merged));
      return merged;
    });
  };

  const openAuthModal = (mode = 'login', redirectPath = null) => {
    setAuthModalMode(mode);
    setRedirectAfterAuth(redirectPath);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setRedirectAfterAuth(null);
  };

  const isLoggedIn = !!token && !!user;
  const isAdmin = isLoggedIn && (user?.role === 'admin' || user?.role === 'superadmin' || user?.role === 'staff');
  const isCustomer = isLoggedIn && user?.role === 'customer';

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      isLoggedIn,
      isAdmin,
      isCustomer,
      isAuthModalOpen,
      authModalMode,
      redirectAfterAuth,
      login,
      logout,
      updateUser,
      openAuthModal,
      closeAuthModal,
      setAuthModalMode
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
