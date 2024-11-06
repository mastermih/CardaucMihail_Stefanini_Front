import React, { useEffect, useState, useContext } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { CartContext } from './cartContext';
import './Header.css';
import { jwtDecode } from 'jwt-decode';
import { login, getUser,fetchNotificationsOfCustomerCreateOrder,notificationIsRead,notificationDisable} from './dataService'; 
import { setupInterceptors } from '../axiosConfig'; 
import { FaBell } from 'react-icons/fa';


const Header = () => {
  const { cartItems, removeFromCart } = useContext(CartContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false); 
  const navigate = useNavigate();
  const [userRoles, setUserRoles] = useState([]);
  const [errors, setErrors] = useState({});
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const location = useLocation();
  const [userId, setUserId] = useState(null);
  const [notifications, setNotifications] = useState([]);
const [isNotificationOpen, setNotificationOpen] = useState(false);

  useEffect(() => {
    if (location.state && location.state.showLoginForm) {
      setShowLoginModal(true);
    }
  }, [location.state]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        console.log('Token found:', token);
        const decodedToken = jwtDecode(token);
        console.log('Decoded Token:', decodedToken);

        const extractedUserId = decodedToken.id;
        if (extractedUserId) {
          setUserId(extractedUserId);
          setUserRoles(decodedToken.roles || []);
          setIsLoggedIn(true);
          console.log('User ID extracted from token:', extractedUserId);
        } else {
          console.error('No id found in token');
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        setIsLoggedIn(false);
      }
    } else {
      console.error('No token found');
    }
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchUserProfile = async (id) => {
        try {
          console.log('Fetching user details for userId:', id);
          const user = await getUser(id);
  
          // Use the correct URL for the user profile image
          let imageUrl;
          if (user.image.startsWith('http://')) {
            // If the backend returns the full URL, replace it with the proxied URL
            imageUrl = user.image.replace('http://cdn-service', 'http://localhost:9090/cdn-service');
          } else {
            // If backend returns only the path, construct the full URL
            imageUrl = `http://localhost:9090/cdn-service${user.image}`;
          }
  
          setUserProfile({ ...user, image: imageUrl });
          console.log('User details fetched successfully:', user);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      };
  
      fetchUserProfile(userId);
    }
  }, [userId]);
  


  const validateLogin = () => {
    const newErrors = {};

   
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (password.length < 5 || password.length > 30) {
      newErrors.password = 'Password must be between 5 and 30 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
  
    if (userId) {
      const interval = setInterval(async () => {
        const newNotifications = await fetchNotificationsOfCustomerCreateOrder(userId);
        setNotifications(newNotifications);
      }, 60000);
  
      return () => clearInterval(interval); 
    }
  }, [userId]);  
  
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const userId = localStorage.getItem('token') ? jwtDecode(localStorage.getItem('token')).id : null;
        if (userId) {
          const data = await fetchNotificationsOfCustomerCreateOrder(userId);
          setNotifications(data);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
  
    fetchNotifications();
  }, []);
  
  const handleBellClick = async () => {
    await notificationIsRead(userId);
    console.log("Is read", userId)
    setNotificationOpen(!isNotificationOpen);
  };
  

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleMouseEnter = () => {
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    setShowDropdown(false);
  };

  const handleSignUpClick = () => {
    navigate('/createUser');
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
  };

  const handleRemoveFromCart = (event, orderId) => {
    event.stopPropagation();
    removeFromCart(orderId);
  };

  const handleUserProfilePictureClick = () => {
    navigate(`/UserProfile/${userId}`);
  };

  const handleCartClick = () => {
    if (cartItems.length > 0) {
      navigate(`/MakeOrder`);
    } else {
      alert('Your cart is empty!');
      navigate('/catalog');
    }
  };

  const handleItemClick = (orderId) => {
    navigate(`/MakeOrder/${orderId}`); 
  };

  const handleRemoveNotification = async (notificationId) => {
    try {
      await notificationDisable(notificationId, userId);
  
      const updatedNotifications = notifications.filter(notification => notification.notificationId !== notificationId);
      setNotifications(updatedNotifications);
    } catch (error) {
      console.error('Error disabling the notification:', error);
    }
  };
  

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginMessage('');
  
    const isValid = validateLogin();
    if (!isValid) {
      setLoading(false);
      return;
    }
  
    const user = {
      email: email,
      password: password,
    };
  
    console.log('Login payload:', user);
  
    try {
      console.log('Response from login:')
      const response = await login(user);
      console.log('Response from login:', response); 
      const token = response.data;
      if (token) {
        console.log('Token received:', token);
        localStorage.setItem('token', token);
  
        setupInterceptors(navigate);
  
        const decodedToken = jwtDecode(token);
        const roles = decodedToken.roles || [];
        if (roles.includes('ADMIN') || roles.includes('MANAGER') || roles.includes('SALESMAN')) {
          navigate("/orders");
        } else {
          setShowDropdown(false);
          setShowLoginModal(false);
          setLoading(false)  
          navigate('/');
          window.location.reload();
        }
      } else {
        setLoginMessage('No token found in response');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setLoginMessage(error.response.data.join(', '));
      } else {
        setLoginMessage('Error during login');
      }
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  

  const handleLogout = () => {
    const confirm = window.confirm("are you sure?");
    if (!confirm) {
      return;
    }

    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserProfile(null);
    setUserId(null);
    navigate('/');
  };

  return (
    <>
    
      <header className="top-header">
        <Container>
          <div className="brand-search-contact">
            <div className="brand">
            <img src="http://localhost:9090/staticFiles/Logo.jpg" alt="Logo" className="logo" style={{ width: '100px', height: '100px', marginRight: '10px' }} /> 
              {/* This one was coll but is beter for static to use just the full url for CDN server */}
            {/* <img src="http://localhost/cdn/static/Logo.jpg" alt="Logo" className="logo" style={{ width: '100px', height: '100px', marginRight: '10px' }} /> */}
            </div>
            <div className="search-bar">
              <input type="text" placeholder="Search model" />
              <button><i className="fas fa-search"></i></button>
            </div>
            <div className="contact-info">
              <p>Need Some Help<br />or mood</p>
              <p>045-151-48-220</p>
              <Nav className="ml-auto">
                {!isLoggedIn ? (
                  <>
                    <Nav.Link onClick={handleSignUpClick}>
                      <i className="fas fa-user-plus"></i> Sign Up
                    </Nav.Link>
                    <Nav.Link onClick={handleLoginClick}><i className="fas fa-sign-in-alt"></i> Log In</Nav.Link>
                  </>
                ) : (
                  <>
{isLoggedIn && userProfile && (
  <img
    src={userProfile.image} 
    alt="Profile"
    className="profile-image"
    onClick={handleUserProfilePictureClick}
    style={{ width: '50px', height: '50px', borderRadius: '50%' }}
  />
)}

{userRoles.includes('USER') && (
  <div className="bell-container" style={{ position: 'relative' }}>
    <FaBell size={24} color="#cfd8e0" onClick={handleBellClick} />
    {/* Notification Badge */}
    {notifications.length > 0 && (
      <span style={{
        position: 'absolute',
        top: '-5px',
        right: '-10px',
        backgroundColor: 'red',
        color: 'white',
        borderRadius: '50%',
        padding: '4px 7px',
        fontSize: '12px'
      }}>
        {notifications.length}
      </span>
    )}

    {/* Notification Dropdown */}
    {isNotificationOpen && (
      <div style={{
        position: 'absolute',
        top: '30px',
        left: '0',  // Positioning the dropdown to the left
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '4px',
        width: '300px',
        padding: '10px',
        zIndex: 1000,
        maxHeight: '400px',
        overflowY: 'auto'
      }}>
        {/* Title with Black Color */}
        <h3 style={{ color: '#000000', textAlign: 'left' }}>Notifications</h3>
        {notifications.length === 0 ? (
          <p style={{ textAlign: 'left' }}>No notifications yet</p>
        ) : (
          <ul style={{ paddingLeft: '20px', listStyleType: 'disc' }}> {/* Added bullets */}
            {notifications.map((notification, index) => (
              <li key={index} style={{ padding: '10px 0', borderBottom: '1px solid #eee', textAlign: 'left' }}> {/* Align text to the left */}
                <span style={{ color: '#000000', display: 'block' }}> {/* Block display for full width */}
                  {notification.message}
                  <span style={{ fontSize: '12px', color: 'gray' }}>
                      {new Date(notification.createdDate).toLocaleDateString()} - {new Date(notification.createdDate).toLocaleTimeString()}
                    </span>
                </span>
                <button
                        onClick={() => handleRemoveNotification(notification.notificationId)}
                        style={{
                    background: 'none',
                    border: 'none',
                    color: 'red',
                    marginLeft: '10px',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    )}
  </div>
)}

                    <Dropdown show={showDropdown} onToggle={toggleDropdown}>
                      <Dropdown.Toggle as={Nav.Link} onMouseEnter={handleMouseEnter} onClick={handleCartClick}>
                        <i className="fas fa-shopping-cart"></i> Cart ({cartItems.length})
                      </Dropdown.Toggle>

                      <Dropdown.Menu onMouseLeave={handleMouseLeave}>
                        {cartItems.length > 0 ? (
                          cartItems.map((item) => (
                            <Dropdown.Item key={item.id} onClick={() => handleItemClick(item.orderId)}>
                              <img className="card-img-top" src={item.image_path} style={{ width: '100px', height: '100px', marginRight: '10px' }} alt="product" />
                              {item.productName} - ${item.price ? item.price.toFixed(2) : 'N/A'}
                              <button
          onClick={(e) => handleRemoveFromCart(e, item.orderId)} // Call remove function
          style={{ marginLeft: '10px', color: 'red' }}
        >
          
          <i className="fas fa-trash-alt"></i> {/* FontAwesome icon */}
        </button>
                            </Dropdown.Item>
                          ))
                        ) : (
                          <Dropdown.Item>No items in cart</Dropdown.Item>
                        )}
                      </Dropdown.Menu>
                    </Dropdown>
                    <Button onClick={handleLogout} variant="danger" className="logout-button" >Logout</Button>
                  </>
                )}
              </Nav>
            </div>
          </div>
        </Container>

      </header>
      <Navbar expand="lg" className="custom-navbar">
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <NavLink to="/" className="nav-link">HOME</NavLink>
              <NavLink to="/catalog" className="nav-link">CATALOG</NavLink>
              <Nav.Link href="#brands">BRANDS</Nav.Link>
              <Nav.Link href="#in-stock">IN STOCK</Nav.Link>
              <Nav.Link href="#elevator-components">ELEVATOR COMPONENTS</Nav.Link>
              {['ADMIN', 'MANAGER', 'SALESMAN'].some(role => userRoles.includes(role)) && (
                <Nav.Link href="orders/">ORDERS</Nav.Link>
              )}
              {userRoles.includes('USER') && (
                <Nav.Link href="/userOrders/UserLastCreated">My ORDERS</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          
          <form onSubmit={handleLoginSubmit}>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <div className="error">{errors.email}</div>}
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <div className="error">{errors.password}</div>}
            </div>

            {loginMessage && <div className="alert alert-danger">{loginMessage}</div>}

            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </Button>
          </form>
          
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseLoginModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Header;
