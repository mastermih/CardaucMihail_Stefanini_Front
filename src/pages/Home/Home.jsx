import React from 'react';
import { NavLink } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import './Home.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import FontAwesome

const Home = () => {
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
      <div className="personal-info-form">
        <Container>
          <Form>
            <Row>
              <Form.Group as={Col} xs={10} sm={6} md={4} lg={2} controlId="formGridCompany">
                <Form.Control type="text" placeholder="Enter company name" />
              </Form.Group>

              <Form.Group as={Col} xs={10} sm={6} md={4} lg={2} controlId="formGridName">
                <Form.Control type="text" placeholder="Enter name" />
              </Form.Group>

              <Form.Group as={Col} xs={10} sm={6} md={4} lg={2} controlId="formGridEmail">
                <Form.Control type="email" placeholder="Enter email" />
              </Form.Group>

              <Form.Group as={Col} xs={10} sm={6} md={4} lg={2} controlId="formGridPhone">
                <Form.Control type="text" placeholder="Enter phone number" />
              </Form.Group>

              <Form.Group as={Col} xs={10} sm={6} md={4} lg={2} controlId="formGridService">
                <Form.Control type="text" placeholder="Enter service" />
              </Form.Group>
              <Form.Group as={Col} xs={12} sm={6} md={4} lg={2} controlId="formGridContact">
                <Button variant="primary" type="submit" className="contact-us-button">
                  Contact Us
                </Button>
              </Form.Group>
            </Row>
          </Form>
        </Container>
      </div>
      <div className="company-info">
        <Container>
          <h2>Company Information</h2>
          <p>FAEFAFEAF ANCAOBCa ACAOSCbac CACACsac ADsad</p>
          <p>In a quiet village nestled between rolling hills...</p>
          <p>In a quiet village nestled between rolling hills...</p>
          <p>In a quiet village nestled between rolling hills...</p>
          <p>In a quiet village nestled between rolling hills...</p>
          <p>In a quiet village nestled between rolling hills...</p>
          <p>In a quiet village nestled between rolling hills...</p>
        </Container>
      </div>
    </>
  );
}

export default Home;
