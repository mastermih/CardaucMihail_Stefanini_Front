import React from 'react';
import Header from '../../components/Header';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './Home.css';

const Home = () => {
  return (
    <>
      <Header />
      <div className="content-section">
        <Container>
          <Row>
            <Col md={8} className="description-section">
              <h2>Description</h2>
              <p>FAEFAFEAF ANCAOBCa ACAOSCbac CACACsac ADsad</p>
              <p>In a quiet village nestled between rolling hills...</p>
              <p>In a quiet village nestled between rolling hills...</p>
              <p>In a quiet village nestled between rolling hills...</p>
              <p>In a quiet village nestled between rolling hills...</p>
              <p>In a quiet village nestled between rolling hills...</p>
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
      </div>
    </>
  );
}

export default Home;
