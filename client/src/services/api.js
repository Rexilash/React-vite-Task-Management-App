import axios from 'axios';

// Point to your Express backend running on port 5000
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Automatically attach the JWT token from localStorage to every outgoing request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;