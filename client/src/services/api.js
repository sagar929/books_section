import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API functions
export const bookAPI = {
  getAll: (page = 1) => api.get(`/books/all?page=${page}`),
  getById: (id) => api.get(`/books/${id}`),
  create: (data) => api.post('/books/add', data),
  update: (id, data) => api.patch(`/books/edit/${id}`, data),
  delete: (id) => api.delete(`/books/delete/${id}`)
};

export const reviewAPI = {
  getByBook: (bookId) => api.get(`/reviews/book/${bookId}`),
  create: (bookId, data) => api.post(`/reviews/book/${bookId}`, data),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`)
};