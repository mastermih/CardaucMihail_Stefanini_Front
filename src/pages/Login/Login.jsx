import React, { useState } from 'react';
import { login } from '../../components/dataService';
import { useNavigate } from 'react-router-dom'; 
import './Login.css'; 
import { setupInterceptors } from '../../axiosConfig';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); 

  // Handle user login
  const handleLoginUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
  
    const user = {
      email: email,
      password: password,
    };
  
    try {
      const response = await login(user);
  
      console.log('Login response:', response);

      const token = response.data;  // Token is directly inside response.data
      if (token) {
        // Save the token in localStorage
        localStorage.setItem('token', token);
        console.log('Token stored in localStorage:', localStorage.getItem('token'));

        // Call interceptors after saving token
        setupInterceptors();
        
        // Delay navigation until the token is stored and interceptors are ready
        setTimeout(() => {
          navigate('/catalog');
        }, 200);
      } else {
        console.error('Token not found in the response:', response);
        setMessage('No token found in response');
      }
    } catch (error) {
      setMessage('Error during login');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="form-section">
        <h1 className="title">Login</h1>
        <form onSubmit={handleLoginUser}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        {message && <div className="message">{message}</div>}
      </div>
    </div>
  );
};

export default Login;
