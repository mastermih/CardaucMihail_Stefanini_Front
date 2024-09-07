import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Container from 'react-bootstrap/Container';
import { confirmOrderEmail } from '../../components/dataService';
import { useParams } from 'react-router-dom';
import Footer from '../../components/Footer';
import './ConfirmOrderEmail.css';

//The id is now the token 
const ConfirmOrderEmail = () => {
  const { id } = useParams(); // Retrieve orderId from the URL
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmationStatus, setConfirmationStatus] = useState(null);

  useEffect(() => {
    const confirmOrder = async () => {
      try {
        const data = await confirmOrderEmail(id); // Pass orderId to the API call
        setConfirmationStatus(data); // Store confirmation response
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    confirmOrder();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <Header />
      <div className="confirmation-content">
        <Container>
          {confirmationStatus ? (
            <p>Your order has been confirmed successfully.</p>
          ) : (
            <p>There was an issue confirming your order. Please try again later.</p>
          )}
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default ConfirmOrderEmail;
