// import React, { useState, useEffect } from 'react';
// import { login } from '../../components/dataService';
// import { useNavigate, useLocation } from 'react-router-dom'; 
// import './Login.css'; 
// import { setupInterceptors } from '../../axiosConfig';

// const Login = () => {
//   const [loading, setLoading] = useState(false);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();
//   const location = useLocation(); 
//   const [showLoginModal, setShowLoginModal] = useState(false);

//   // Check if we need to show the login form based on the navigation state
//   useEffect(() => {
//     if (location.state && location.state.showLoginForm) {
//       setShowLoginModal(true); // Show login modal if state is passed during navigation
//     }
//   }, [location.state]);

//   const handleLoginUser = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage('');

//     const user = {
//       email: email,
//       password: password,
//     };

//     try {
//       const response = await login(user);
//       const token = response.data;

//       if (token) {
//         // Save token in localStorage
//         localStorage.setItem('token', token);

//         // Set up interceptors after login
//         setupInterceptors();

//         // Delay navigation until token is saved and interceptors are set up
//         setTimeout(() => {
//           navigate('/catalog');
//           setShowLoginModal(false); // Close the login modal
//         }, 200);
//       } else {
//         setMessage('No token found in response');
//       }
//     } catch (error) {
//       setMessage('Error during login');
//       console.error('Login error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     showLoginModal ? (
//       <div className="modal-overlay">
//         <div className="modal-content">
//           <button className="close-button" onClick={() => setShowLoginModal(false)}>×</button>
//           <h1 className="title">Login</h1>
//           <form onSubmit={handleLoginUser}>
//             <div className="input-group">
//               <label htmlFor="email">Email</label>
//               <input
//                 type="email"
//                 id="email"
//                 placeholder="Email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>

//             <div className="input-group">
//               <label htmlFor="password">Password</label>
//               <input
//                 type="password"
//                 id="password"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </div>

//             <button type="submit" className="submit-button" disabled={loading}>
//               {loading ? 'Logging in...' : 'Log In'}
//             </button>
//           </form>

//           {message && <div className="message">{message}</div>}
//         </div>
//       </div>
//     ) : null
//   );
// };

// export default Login;
