import API_BASE_URL from '../config/api';

/**
 * Creates headers for authenticated API requests
 * Includes Authorization header with token from localStorage
 */
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

/**
 * Makes an authenticated fetch request
 * Automatically includes the token from localStorage
 */
export const authenticatedFetch = async (url, options = {}) => {
  const headers = getAuthHeaders();
  
  // Merge with any existing headers
  const mergedHeaders = {
    ...headers,
    ...(options.headers || {}),
  };
  
  return fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: mergedHeaders,
    credentials: 'include',
  });
};

