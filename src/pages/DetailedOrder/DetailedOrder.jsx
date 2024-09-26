import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation to read query parameters
import './DetailedOrder.css';
import { fetchOrderProductAndExtraProduct, getOperatorForOrder} from '../../components/dataService';

const DetailedOrder = () => {
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState([]);
  const [operatorNames, setOperatorNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/", { state: { showLoginForm: true } });
    }
  }, [navigate]);

  useEffect(() => {
    if (!orderId) {
      console.error("No orderId found in the URL");
      return;
    }

    const fetchOrderDetails = async () => {
      console.log("Fetching order details for orderId:", orderId);
      try {
        setLoading(true);
        const response = await fetchOrderProductAndExtraProduct(orderId);
        console.log("Order details fetched:", response.data);
        setOrderDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError('Failed to load order details.');
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  useEffect(() => {
    const fetchOperatorName = async () => {
      console.log("Fetching operator names for order:", orderId);
      try {
        const response = await getOperatorForOrder(orderId);
        
        console.log("Operator names response:", response);
  
        setOperatorNames(response);
        
        console.log("Operator names set in state:", response);
  
      } catch (error) {
        console.error('Error fetching operator names:', error);
        setOperatorNames([]);
      }
    };
  
    if (orderId) {
      fetchOperatorName();
    }
  }, [orderId]);
  
  

  
  
  if (loading) {
    return <div>Loading order details...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const mainProducts = orderDetails.filter(product => product.categoryType === "Elevator");
  const extraProducts = orderDetails.filter(product => product.categoryType !== "Elevator");

  const totalPrice = [...mainProducts, ...extraProducts].reduce((sum, product) => sum + product.price, 0);

  console.log(mainProducts);
  console.log(extraProducts);

  return (
    <>
      <div className="content-section">
        <Container>
          <Row>
            <Col md={8} className="description-section">
              <h3>Order Details for Order ID: {orderId}</h3>
              {/* <h5>Operator: {operatorName}</h5> */}
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
            </Col>
          </Row>
          <Row>
  <Col md={12} className="total-price-section">
    <h5>Operator(s): {operatorNames.length > 0 ? operatorNames.join(', ') : 'N/A'}</h5>
  </Col>
</Row>
          {/* Total Price */}
          <Row>
            <Col md={12} className="total-price-section">
              <h3>Total Price: ${totalPrice}</h3>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default DetailedOrder;