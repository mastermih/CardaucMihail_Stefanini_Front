import axios from 'axios';

export const setupInterceptors = (navigate) => {
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token && !config.url.includes('/login') && !config.url.includes('/createUser')) {
        config.headers['Authorization'] = `Bearer ${token}`;
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
        console.error('Unauthorized or forbidden access - redirecting to login');
        localStorage.removeItem('token'); // Clear token
        navigate("/", { state: { showLoginForm: true } }); // Redirect to login
      }
      return Promise.reject(error);
    }
  );
};

