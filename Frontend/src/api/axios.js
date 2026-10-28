import axios from 'axios';

// API base client (defaults to 5001 to avoid macOS AirTunes port 5000 conflict)
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
});

// Auto-attach JWT token from localStorage to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('bunnybook_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
