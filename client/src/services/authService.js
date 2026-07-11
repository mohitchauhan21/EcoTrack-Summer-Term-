import api from './api';

/**
 * Register a new user
 * @param {string} name 
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<Object>}
 */
export const register = async (name, email, password) => {
  const response = await api.post('/auth/register', { name, email, password });
  return response.data.data;
};

/**
 * Login user
 * @param {string} email 
 * @param {string} password 
 * @param {boolean} rememberMe 
 * @returns {Promise<Object>}
 */
export const login = async (email, password, rememberMe = false) => {
  const response = await api.post('/auth/login', { email, password, rememberMe });
  return response.data.data;
};

/**
 * Logout user
 * @returns {Promise<void>}
 */
export const logout = async () => {
  await api.post('/auth/logout');
};

/**
 * Get current authenticated user
 * @returns {Promise<Object>}
 */
export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data.data;
};

export default {
  register,
  login,
  logout,
  getMe,
};
