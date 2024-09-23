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
import { login, getUser } from './dataService'; // Ensure this import is correct
import { setupInterceptors } from '../axiosConfig'; 

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
          setUserProfile(user);
          console.log('User details fetched successfully:', user);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      };

      fetchUserProfile(userId); // Trigger the profile fetch
    }
  }, [userId]); // Trigger when userId changes

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
    return Object.keys(newErrors).length === 0; // Return true if no errors
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
    navigate(`/UserProfile/${userId}`); // Navigate to the user profile page using the extracted user ID
  };

  const handleCartClick = () => {
    if (cartItems.length > 0) {
      navigate(`/MakeOrder`); // Navigate to load all products
    } else {
      alert('Your cart is empty!');
      navigate('/catalog');
    }
  };

  const handleItemClick = (orderId) => {
    navigate(`/MakeOrder/${orderId}`); // Navigate to load a specific product
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginMessage('');

    const isValid = validateLogin();  // Ensure validation happens
    if (!isValid) {
      setLoading(false);  // Stop loading if validation fails
      return;
    }

    const user = {
      email: email,
      password: password,
    };
    
    try {
      const response = await login(user);
      const token = response.data;

      if (token) {
        localStorage.setItem('token', token);
        setupInterceptors(navigate);
        
        const decodedToken = jwtDecode(token);
        const roles = decodedToken.roles || [];
        if (roles.includes('ADMIN')) {
          navigate("/admin-dashboard");
        } else {
          navigate('/user-dashboard');
        }
      } else {
        setLoginMessage('No token found in response');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setLoginMessage(error.response.data); // Show server response
      } else {
        setLoginMessage('Error during login');
      }
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
              <img src="/images/Logo.jpg" alt="Logo" className="logo" style={{ width: '100px', height: '100px', marginRight: '10px' }} />
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
                    <img
                      src={`http://localhost:8080/${userProfile?.image}`} 
                      alt="Profile"
                      className="profile-image"
                      onClick={handleUserProfilePictureClick}  // Correct camelCase
                      style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                    />

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

              {/* Conditionally render "Options" for only "ADMIN" */}
              {['ADMIN', 'MANAGER', 'SALESMAN'].some(role => userRoles.includes(role)) && (
                <Nav.Link href="orders/">ORDERS</Nav.Link>
              )}
              {/* Conditionally render "Options" for only "USER" */}
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
