import React, { useContext, useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown'; 
import '@fortawesome/fontawesome-free/css/all.min.css';
import { CartContext } from './cartContext';
import './Header.css';
import { jwtDecode } from 'jwt-decode';

const Header = () => {
  const { cartItems, removeFromCart } = useContext(CartContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const [userRoles, setUserRoles] = useState([]);

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
    navigate('/login');
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

  console.log("User Roles in component:", userRoles); // Log the roles right before rendering

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

                    {/* Conditionally render the "View Orders" option for ADMIN users */}
                    {userRoles.includes('ADMIN') && (
                    <Dropdown.Item as={NavLink} to="/orders">
                      <i className="fas fa-list-alt"></i> View Orders
                     </Dropdown.Item>
                      )}

                    {/* Check for 'ADMIN' role specifically for 'Options' */}
                    {userRoles.includes('ADMIN') && (
                      <Nav.Link href="#options">Options</Nav.Link>
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
    </>
  );
};

export default Header;
