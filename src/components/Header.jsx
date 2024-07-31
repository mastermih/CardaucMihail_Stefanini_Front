import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown'; 
import '@fortawesome/fontawesome-free/css/all.min.css';
import { CartContext } from './cartContext';
import './Header.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook


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

  return (
    <>
      <header className="top-header">
        <Container>
          <div className="brand-search-contact">
            <div className="brand">
              <img src="/path/to/logo.png" alt="Logo" className="logo" />
            </div>
            <div className="search-bar">
              <input type="text" placeholder="Search model" />
              <button><i className="fas fa-search"></i></button>
            </div>
            <div className="contact-info">
              <p>Need Some Help<br /> or mood</p>
              <p>045-151-48-220</p>
              <Nav className="ml-auto">
                <Nav.Link href="#sign-up"><i className="fas fa-user-plus"></i> Sign Up</Nav.Link>
                <Nav.Link href="#log-in"><i className="fas fa-sign-in-alt"></i> Log In</Nav.Link>
              
                <Dropdown show={showDropdown} onToggle={toggleDropdown} onClick={() => navigate(`/MakeOrder/2`)}>
                  <Dropdown.Toggle as={Nav.Link} onMouseEnter={handleMouseEnter}>
                    <i className="fas fa-shopping-cart"></i> Cart ({cartItems.length})
                  </Dropdown.Toggle>
                  
                  <Dropdown.Menu>
                    {cartItems.length > 0 ? (
                      cartItems.map((item) => (
                        <Dropdown.Item key={item.id} onClick={() => navigate(`/MakeOrder/${item.id}`)}>
                          <img className="card-img-top"  src={item.image_path}  style={{ width: '100px', height: '100px', marginRight: '10px' } }  />
                          {item.productName} - ${item.price.toFixed(2)}
                          <br></br>
                          <hr></hr>
                          {item.description}
                          <br></br>
                          <button onClick={(event) => handleRemoveFromCart(event, item.orderId)}>Remove</button>
                          <button onClick={() => navigate(`/MakeOrder/${item.id}`)}>Make Orders</button>
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
              <Nav.Link href="#how-to-find-us">HOW TO FIND US</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
