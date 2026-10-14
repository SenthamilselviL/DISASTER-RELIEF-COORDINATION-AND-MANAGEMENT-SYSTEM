import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: standardize error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If unauthorized or token expired, trigger logout
    if (error.response && error.response.status === 401) {
      if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login?session=expired';
      }
    }
    const message =
      error.response?.data?.message ||
      error.message ||
      'Network error. Please check your connectivity and retry.';
    return Promise.reject(new Error(message));
  }
);

export default api;

// API Service Functions
export const AuthService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me')
};

export const RequestService = {
  create: (requestData) => api.post('/requests', requestData),
  getAll: (params) => api.get('/requests', { params }),
  getById: (id) => api.get(`/requests/${id}`),
  update: (id, data) => api.put(`/requests/${id}`, data),
  claim: (id) => api.post(`/requests/${id}/claim`),
  updateStatus: (id, data) => api.post(`/requests/${id}/status`, data)
};

export const ResourceService = {
  getAll: () => api.get('/resources'),
  create: (data) => api.post('/resources', data),
  allocate: (id, data) => api.post(`/resources/${id}/allocate`, data)
};

export const DashboardService = {
  getStats: () => api.get('/dashboard/stats'),
  getCoverage: () => api.get('/dashboard/coverage'),
  getMapData: (params) => api.get('/dashboard/map', { params })
};

export const UserService = {
  getAll: (params) => api.get('/users', { params }),
  updateRole: (id, role) => api.put(`/users/${id}/role`, { role }),
  toggleStatus: (id) => api.put(`/users/${id}/status`)
};

export const ActivityService = {
  getLogs: (params) => api.get('/activity', { params })
};
