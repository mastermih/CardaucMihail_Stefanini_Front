import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown'; 
import '@fortawesome/fontawesome-free/css/all.min.css';
import { CartContext } from './cartContext';
import './Header.css';

const Header = () => {
  const { cartItems, removeFromCart } = useContext(CartContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleMouseEnter = () => {
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    setShowDropdown(false);
  };

  const handleRemoveFromCart = (event, orderId) => {
    event.stopPropagation();
    removeFromCart(orderId);
  };

// Header Component
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
              <p>Need Some Help<br />or mood  </p>
              <p>045-151-48-220</p>
              <Nav className="ml-auto">
                <Nav.Link href="#sign-up"><i className="fas fa-user-plus"></i> Sign Up</Nav.Link>
                <Nav.Link href="#log-in"><i className="fas fa-sign-in-alt"></i> Log In</Nav.Link>
              
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
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Navbar expand="lg" className="custom-navbarZZZ">
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <input type="text" placeholder="Company Name" />              
              <input type="text" placeholder="Name" />              
              <input type="text" placeholder="Email" />              
              <input type="text" placeholder="Phone Number" />
              <select>
                  <option value="">Select Category ...</option>
                  <option value="Elevator">Elevator</option>
                  <option value="AirSystem">Air System</option>
                  <option value="EmergensySystem">Emergency System</option>
              </select>
              <button type="button" className="boton_message">Send</button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
