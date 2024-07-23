// src/components/Header.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import FontAwesome
import './Header.css'; // Common CSS for Header

const Header = () => {
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
                <Nav.Link href="#cart">
                  <i className="fas fa-shopping-cart"></i> Cart
                </Nav.Link>
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
}

export default Header;
