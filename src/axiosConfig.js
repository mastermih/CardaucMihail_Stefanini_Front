import axios from 'axios';

export const setupInterceptors = (navigate) => {
  // Request Interceptor
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      // Ensure we don't send the token for login and createUser requests
      if (token && !config.url.includes('/login') && !config.url.includes('/createUser')) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response Interceptor
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // Handle 401 (Unauthorized) and redirect to login
      if (error.response && error.response.status === 401) {
        console.error('Unauthorized or forbidden access - redirecting to login');
        localStorage.removeItem('token'); // Clear token
        navigate("/", { state: { showLoginForm: true } }); // Redirect to login
      }
      return Promise.reject(error);
    }
  );
};

