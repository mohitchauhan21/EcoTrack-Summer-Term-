import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

/**
 * AuthProvider — manages authentication state across the app.
 * Provides user, token, loading state, and auth methods.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  /**
   * Load user from token on mount.
   */
  const loadUser = useCallback(async () => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.get('/auth/me');
      setUser(data.data.user);
      setToken(storedToken);
    } catch {
      localStorage.removeItem('token');
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  /**
   * Register a new user.
   */
  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    const { user: newUser, token: newToken } = data.data;
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(newUser);
    toast.success('Account created successfully!');
    return newUser;
  };

  /**
   * Log in an existing user.
   */
  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    const { user: loggedInUser, token: newToken } = data.data;
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(loggedInUser);
    toast.success('Welcome back!');
    return loggedInUser;
  };

  /**
   * Log out the current user.
   */
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  /**
   * Update user in state (e.g., after profile update).
   */
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    loadUser,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to access auth context.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
