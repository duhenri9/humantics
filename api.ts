// API Configuration for production deployment

// Determine API base URL based on environment
export const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'production' 
    ? 'https://humantic-api.railway.app' // Replace with your production API URL
    : 'http://localhost:5000');

// Helper function for API calls
export const apiUrl = (path: string) => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
};

// Configuration for fetch with credentials
export const fetchConfig: RequestInit = {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
};