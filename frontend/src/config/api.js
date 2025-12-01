// API Base URL Configuration
// In development: uses localhost
// In production: uses Render backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.DEV 
    ? 'http://localhost:5001' 
    : 'https://focusly-efcu.onrender.com');

export default API_BASE_URL;

