import React, { useState } from 'react';
import { createUserUnauthorized } from '../../components/dataService';
import { useNavigate } from 'react-router-dom';
import './Registration.css'; 

const Registration = () => {
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); 

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};

    if (userName.length < 2 || userName.length > 20) {
      newErrors.userName = "Name must be between 2 and 20 characters";
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = "Email should be valid";
    }

    if (password.length < 5 || password.length > 30) {
      newErrors.password = "Password must be between 5 and 30 characters";
    }

    if (password !== verifyPassword) {
      newErrors.verifyPassword = "Passwords do not match";
    }

    if (phoneNumber.length < 5 || phoneNumber.length > 15) {
      newErrors.phoneNumber = "Phone number must be between 5 and 15 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegisterUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    const user = {
      name: {
        name: userName,
      },
      email: {
        email: email,
      },
      password: password,
      phoneNumber: phoneNumber
    };

    try {
      const response = await createUserUnauthorized(user, verifyPassword); 
      setMessage(`User registered successfully with ID: ${response}`);
      setUserName('');
      setEmail('');
      setPassword('');
      setVerifyPassword('');
      setPhoneNumber('');
      
      navigate('/catalog');
    } catch (error) {
      setMessage('Error registering user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-container">
      <div className="form-section">
        <h1 className="title">Welcome</h1>
        <form onSubmit={handleRegisterUser}>
          <div className="input-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              placeholder="First Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
            {errors.userName && <span className="error">{errors.userName}</span>}
          </div>

          <div className="input-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="text"
              id="phoneNumber"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
            {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}
          </div>

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
            {errors.email && <span className="error">{errors.email}</span>}
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
            {errors.password && <span className="error">{errors.password}</span>}
          </div>

          <div className="input-group">
            <label htmlFor="verifyPassword">Verify Password</label>
            <input
              type="password"
              id="verifyPassword"
              placeholder="Verify Password"
              value={verifyPassword}
              onChange={(e) => setVerifyPassword(e.target.value)}
              required
            />
            {errors.verifyPassword && <span className="error">{errors.verifyPassword}</span>}
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Registering...' : 'Lets go big MAN'}
          </button>
        </form>

        {message && <div className="message">{message}</div>}
        <p className="login-prompt" onClick={() => navigate("/", { state: { showLoginForm: true } })}>
          Already registered? Log in
        </p>
      </div>

      <div className="image-section">
        <img src="\images\MainPage.jpg" alt="background" className="background-image" />
      </div>
    </div>
  );
};

export default Registration;
