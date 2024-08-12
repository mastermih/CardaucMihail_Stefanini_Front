import React from 'react';
import Header from '../../components/Header';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './Home.css';
import Footer from '../../components/Footer';

const Home = () => {
  return (
    <>
      <Header />
      <div className="content-section">
        <Container>
          <Row>
            <Col md={8} className="description-section">

           <h3>Welcome to Elevate Solutions Inc</h3>
Your Trusted Partner in Elevator Excellence

At Elevate Solutions Inc., we are dedicated to providing top-tier elevator systems and components, tailored to meet the unique needs of our clients. With a rich legacy of innovation and a commitment to quality, we ensure that every product we deliver stands up to the highest standards of safety, reliability, and performance.

Our Products
Elevators: State-of-the-art elevators designed for residential, commercial, and industrial use. Our range includes passenger elevators, freight elevators, and customized solutions to fit specific requirements.
Components: A comprehensive selection of high-quality elevator components including motors, control panels, doors, and safety systems. Our components are engineered to enhance the efficiency and longevity of your elevator systems.
            </Col>
            <Col md={4} className="partners-section">
              <h2>Partners</h2>
              <div className="partners-logos">
                <img src="\partnerImages\McNally-Elevator.png" alt="Partner 1" className="partner-logo" />
                <img src="\partnerImages\e9_AEG_Logo__Square_MASTER_MAIN_LOGO_Logo.jpg" alt="Partner 2" className="partner-logo" />
                <img src="\partnerImages\pincus-logo.png" alt="Partner 3" className="partner-logo" />
                {/* Add more logos as needed */}
              </div>
            </Col>
          </Row>
        </Container>
        <Footer/>
      </div>
    </>
  );
}

export default Home;
