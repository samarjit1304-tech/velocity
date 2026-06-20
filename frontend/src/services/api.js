import axios from 'axios';
import { store } from '../store';
import { setCredentials, logout } from '../store/slices/authSlice';

// Create Axios Instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('vibe_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Auto Refresh Tokens on 401 Expiry
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if error status is 401 and not retried yet
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // Check if code matches TOKEN_EXPIRED or if it was a protected request
      const isTokenExpired = error.response.data && error.response.data.code === 'TOKEN_EXPIRED';
      const hasRefreshToken = !!localStorage.getItem('vibe_refresh_token');

      if ((isTokenExpired || error.response.data.message === 'Not authorized, token failed') && hasRefreshToken) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = 'Bearer ' + token;
              return api(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = localStorage.getItem('vibe_refresh_token');
        try {
          // Attempt token refresh
          // NOTE: we use standard axios (not api instance) to avoid circular request interceptors
          const response = await axios.post('/api/auth/refresh', { refreshToken });
          
          if (response.data.success) {
            const { accessToken, refreshToken: newRefreshToken } = response.data;
            
            // Update localStorage
            localStorage.setItem('vibe_token', accessToken);
            localStorage.setItem('vibe_refresh_token', newRefreshToken);
            
            // Update Redux state
            const user = JSON.parse(localStorage.getItem('vibe_user'));
            store.dispatch(setCredentials({ user, accessToken, refreshToken: newRefreshToken }));
            
            api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
            
            processQueue(null, accessToken);
            isRefreshing = false;
            
            return api(originalRequest);
          }
        } catch (refreshError) {
          processQueue(refreshError, null);
          isRefreshing = false;
          // Refresh token expired or revoked, force logout user
          store.dispatch(logout());
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
export { axios }; // Export plain axios just in case
