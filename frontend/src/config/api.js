// API Configuration for Production and Development
export const API_CONFIG = {
  // Use environment variable or fallback to localhost for development
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  
  // API endpoints
  ENDPOINTS: {
    PRODUCTS: '/api/products',
    ORDERS: '/api/orders', 
    AUTH: '/api/auth'
  }
};

// Helper function to build API URLs
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Pre-built API URLs for common endpoints
export const API_URLS = {
  PRODUCTS: getApiUrl(API_CONFIG.ENDPOINTS.PRODUCTS),
  ORDERS: getApiUrl(API_CONFIG.ENDPOINTS.ORDERS),
  AUTH_LOGIN: getApiUrl(`${API_CONFIG.ENDPOINTS.AUTH}/login`),
  AUTH_REGISTER: getApiUrl(`${API_CONFIG.ENDPOINTS.AUTH}/register`),
};
