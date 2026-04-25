import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  authAPI,
  saveToken,
  saveUser,
  getToken,
  getSavedUser,
  removeToken,
  removeUser,
} from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on app launch
  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = async () => {
    try {
      const [token, savedUser] = await Promise.all([getToken(), getSavedUser()]);
      if (token && savedUser) {
        setUser(savedUser);
      }
    } catch (error) {
      console.log('Session restore failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await authAPI.login(email, password);
    const { token, user: userData } = res.data;
    await saveToken(token);
    await saveUser(userData);
    setUser(userData);
    return userData;
  };

  const signup = async (name, email, password, role = 'user') => {
    const res = await authAPI.signup(name, email, password, role);
    const { token, user: userData } = res.data;
    await saveToken(token);
    await saveUser(userData);
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    await removeToken();
    await removeUser();
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
