import axios from 'axios';

// Setup Axios interceptor to automatically attach token to every request
export const setupInterceptors = () => {
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');  // Get the token from localStorage
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;  // Set Authorization header
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        console.error('Unauthorized access - possibly due to an expired token');
        localStorage.removeItem('token');  // Optionally remove expired token
        window.location.href = '/login';  // Redirect to login page if unauthorized
      }
      return Promise.reject(error);
    }
  );
};
