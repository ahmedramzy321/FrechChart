import axios from 'axios';

export const API_BASE_URL = 'https://ecommerce.routemisr.com/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach token header automatically
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('freshcart_token');
    if (token) {
      config.headers.token = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle expired / invalid token
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || '';

    // If token is invalid or expired
    if (
      status === 401 ||
      (status === 498 && (message.includes('expired') || message.includes('invalid') || message.includes('token')))
    ) {
      if (localStorage.getItem('freshcart_token')) {
        localStorage.removeItem('freshcart_token');
        localStorage.removeItem('freshcart_user');
        window.dispatchEvent(new Event('auth:expired'));
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
