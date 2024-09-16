import React, { useState, useContext, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { CartContext } from './cartContext';
import './Header.css';
import {jwtDecode} from 'jwt-decode';  // Correct import for jwt-decode
import { login } from './dataService'; // Since `dataService.js` is in the same folder as `Header.jsx`
import { setupInterceptors } from '../axiosConfig'; // Move one directory up to reach `src` and then access `axiosConfig.js`




const Header = () => {
  const { cartItems, removeFromCart } = useContext(CartContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false); // State for login modal visibility
  const navigate = useNavigate();
  const [userRoles, setUserRoles] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');

  // Use the useEffect hook to get the roles on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded);
        setUserRoles(decoded.roles || []);  // Set the roles into state
      } catch (error) {
        console.error('Failed to decode token:', error);
        setUserRoles([]);
      }
    }
  }, []);  // The empty dependency array ensures this runs only once on mount

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
    setShowLoginModal(true); // Show login modal instead of navigating
  };

  const handleCloseLoginModal = () => {
    setShowLoginModal(false); // Close the login modal
  };

  const handleRemoveFromCart = (event, orderId) => {
    event.stopPropagation();
    removeFromCart(orderId);
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

    const user = {
      email: email,
      password: password,
    };

    try {
      const response = await login(user);

      const token = response.data;  // Token is directly inside response.data
      if (token) {
        // Save the token in localStorage
        localStorage.setItem('token', token);
        setupInterceptors(); // Call interceptors after saving token

        setTimeout(() => {
          navigate('/catalog');
          setShowLoginModal(false); // Close the modal on successful login
        }, 200);
      } else {
        setLoginMessage('No token found in response');
      }
    } catch (error) {
      setLoginMessage('Error during login');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
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
                <Nav.Link onClick={handleSignUpClick}>
                  <i className="fas fa-user-plus"></i> Sign Up
                </Nav.Link>              
                <Nav.Link onClick={handleLoginClick}><i className="fas fa-sign-in-alt"></i> Log In</Nav.Link>
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
                          <br />
                          <hr />
                          <div className="cart-item-description">
                            {item.description ? item.description : 'No description available'}
                          </div>
                          <br />
                          <button onClick={(event) => handleRemoveFromCart(event, item.orderId)}>Remove</button>
                        </Dropdown.Item>
                      ))
                    ) : (
                      <Dropdown.Item>No items in cart</Dropdown.Item>
                    )}
                  </Dropdown.Menu>
                </Dropdown>
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
              {userRoles.includes('ADMIN') && (
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

      {/* Login Modal */}
      <Modal show={showLoginModal} onHide={handleCloseLoginModal}>
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
