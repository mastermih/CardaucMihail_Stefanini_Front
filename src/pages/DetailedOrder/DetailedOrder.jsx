import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation to read query parameters
import './DetailedOrder.css';
import { fetchOrderProductAndExtraProduct } from '../../components/dataService';

const DetailedOrder = () => {
  const location = useLocation(); // Get the location object
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Extract the orderId from the query string
  const searchParams = new URLSearchParams(location.search); // Create a URLSearchParams object
  const orderId = searchParams.get('orderId'); // Get the 'orderId' parameter from the URL

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/", { state: { showLoginForm: true } });
    }
  }, [navigate]);

  useEffect(() => {
    if (!orderId) {
      console.error("No orderId found in the URL"); // Debugging step
      return;
    }

    const fetchOrderDetails = async () => {
      console.log("Fetching order details for orderId:", orderId); // Debugging step
      try {
        setLoading(true);
        const response = await fetchOrderProductAndExtraProduct(orderId);
        console.log("Order details fetched:", response.data); // Debugging step
        setOrderDetails(response.data); // Set the fetched order details
        setLoading(false);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError('Failed to load order details.');
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return <div>Loading order details...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

// Separate products by categoryType
const mainProducts = orderDetails.filter(product => product.categoryType === "Elevator");
const extraProducts = orderDetails.filter(product => product.categoryType !== "Elevator");

console.log(mainProducts);  // Check the products that are categorized as "Elevator"
console.log(extraProducts); // Check the products that are not categorized as "Elevator"


  return (
    <>
      <div className="content-section">
        <Container>
          <Row>
            <Col md={8} className="description-section">
              <h3>Order Details for Order ID: {orderId}</h3>
              {mainProducts.map((product, index) => (
                <div key={index}>
                  <h4>Product Name: {product.productName}</h4>
                  <p>Quantity: {product.quantity}</p>
                  <p>Price: ${product.price}</p>
                </div>
              ))}
            </Col>
            <Col md={4} className="partners-section">
              <div className="Partners">
                <h2>Extra Products</h2>
              </div>
              <br />
              <div className="partners-logos">
  {/* Display extra products in the extra product section */}
  {extraProducts.length > 0 ? (
    extraProducts.map((extra, index) => (
      <div key={index}>
        <h4>Extra Product Name: {extra.productName}</h4>
        <p>Extra Quantity: {extra.quantity}</p>
        <p>Extra Price: ${extra.price}</p>
      </div>
    ))
  ) : (
    <p>No extra products.</p>
  )}
</div>

            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default DetailedOrder;

