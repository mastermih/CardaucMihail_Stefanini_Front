import axios from 'axios';

export const setupInterceptors = (navigate) => {
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
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
      if (error.response && (error.response.status === 401)) {
        console.error('Unauthorized or forbidden access - redirecting to login');
        localStorage.removeItem('token');
        navigate("/", { state: { showLoginForm: true } });
      }
      return Promise.reject(error);
    }
  );
};
