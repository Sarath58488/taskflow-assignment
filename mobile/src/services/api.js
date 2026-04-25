import AsyncStorage from '@react-native-async-storage/async-storage';

// ⚠️  Change this to your actual backend URL
// Local dev: 'http://192.168.X.X:5000/api'  (use your machine's LAN IP, not localhost)
// Deployed:  'https://your-backend.onrender.com/api'
const BASE_URL = 'https://taskflow-assignment.onrender.com/api';
const TOKEN_KEY = '@tm_token';
const USER_KEY = '@tm_user';

// ─── Token helpers ─────────────────────────────────────────────
export const saveToken = async (token) => AsyncStorage.setItem(TOKEN_KEY, token);
export const getToken = async () => AsyncStorage.getItem(TOKEN_KEY);
export const removeToken = async () => AsyncStorage.removeItem(TOKEN_KEY);

export const saveUser = async (user) => AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
export const getSavedUser = async () => {
  const u = await AsyncStorage.getItem(USER_KEY);
  return u ? JSON.parse(u) : null;
};
export const removeUser = async () => AsyncStorage.removeItem(USER_KEY);

// ─── Core fetch wrapper ────────────────────────────────────────
const api = async (endpoint, options = {}) => {
  const token = await getToken();

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    if (error.message === 'Network request failed') {
      throw new Error('Cannot connect to server. Please check your internet connection.');
    }
    throw error;
  }
};

// ─── Auth APIs ─────────────────────────────────────────────────
export const authAPI = {
  login: (email, password) =>
    api('/auth/login', { method: 'POST', body: { email, password } }),

  signup: (name, email, password, role) =>
    api('/auth/signup', { method: 'POST', body: { name, email, password, role } }),

  getMe: () => api('/auth/me'),
};

// ─── Task APIs ─────────────────────────────────────────────────
export const taskAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== ''))
    ).toString();
    return api(`/tasks${query ? `?${query}` : ''}`);
  },

  getOne: (id) => api(`/tasks/${id}`),

  create: (taskData) =>
    api('/tasks', { method: 'POST', body: taskData }),

  update: (id, updates) =>
    api(`/tasks/${id}`, { method: 'PUT', body: updates }),

  delete: (id) =>
    api(`/tasks/${id}`, { method: 'DELETE' }),

  getUsers: () => api('/tasks/users'),
};
