import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Container from 'react-bootstrap/Container';
import { confirmUserEmail, uploadImage } from '../../components/dataService'; // Assuming you have an uploadImage function in dataService
import { useParams } from 'react-router-dom';
import Footer from '../../components/Footer';
import './ConfirmUserEmail.css';

const ConfirmUserEmail = () => {
    const { id } = useParams(); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [confirmationStatus, setConfirmationStatus] = useState(null);
    const [image, setImage] = useState(null); 
    const [uploadMessage, setUploadMessage] = useState("");

    useEffect(() => {
      const confirmUser = async () => {
        try {
          const data = await confirmUserEmail(id);
          setConfirmationStatus(data);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      };
  
      confirmUser();
    }, [id]);
  
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
  
    return (
      <>
        <Header />
        <div className="confirmation-content">
          <Container>
            {confirmationStatus ? (
              <>
                <p>Your User has been confirmed successfully.</p>
              </>
            ) : (
              <p>There was an issue confirming the user. Please try again later.</p>
            )}
          </Container>
        </div>
        <Footer />
      </>
    );
  };
  
  export default ConfirmUserEmail;
