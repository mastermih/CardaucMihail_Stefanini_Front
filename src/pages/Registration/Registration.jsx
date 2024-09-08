import React, { useState } from 'react';
import { createUser } from '../../components/dataService';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
import './Registration.css'; // Assuming CSS for styling

const Registration = () => {
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigate = useNavigate(); 
  
  // Handle user registration
  const handleRegisterUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

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
      const response = await createUser(user); 
      setMessage(`User registered successfully with ID: ${response}`);
      setUserName('');
      setEmail('');
      setPassword('');
      setPhoneNumber('');
      
      // Redirect to /catalog after successful registration
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
            {loading ? 'Registering...' : ' Lets go big MAN '}
          </button>
        </form>

        {message && <div className="message">{message}</div>}
        <p className="login-prompt">Already registered? <a href="/login">Log in</a></p>
      </div>

      <div className="image-section">
        <img src="\images\pexels-albinberlin-919073.jpg" alt="background" className="background-image" />
      </div>
    </div>
  );
};

export default Registration;
