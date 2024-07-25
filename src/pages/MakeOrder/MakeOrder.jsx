import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Container from 'react-bootstrap/Container';
import './MakeOrder.css';
import { fetchProductPageById, updateOrderStatus } from '../../components/dataService';
import { useParams, useNavigate } from 'react-router-dom';
import { Row } from 'react-bootstrap';
import { useCart } from '../../components/cartContext';
import Col from 'react-bootstrap/Col';
import Footer from '../../components/Footer';

const MakeOrder = () => {
  const { id } = useParams();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const { data } = await fetchProductPageById(id);
        setProduct(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!product) return <p>No product found.</p>;

  const { productName, image_path, price } = product;

  const handleConfirmOrder = async () => {
    console.log('Cart Items:', cartItems); // Log the cart items to check their content

    const orderItem = cartItems.find(item => item.id === product.id);
    console.log('Order Item:', orderItem); // Log the order item to check if it is found

    if (!orderItem || !orderItem.orderId) {
      console.error('Order ID is 0, cannot update order status.');
      return;
    }

    const order = {
      orderId: { id: orderItem.orderId },
      orderStatus: "NEW",
      productId: product.id
    };

    try {
      const result = await updateOrderStatus(order);
      console.log('Order status updated:', result);
    } catch (error) {
      console.log('Error updating order status:', error);
    }
  };

  return (
    <>
      <Header />
      <div className="productPage-content">
        <Container>
          <Row>
            <Col md={5} className="mb-4">
              <h3 className="card-text">{productName}</h3>
              <div className="card">
                <img className="card-img-top" src={`${image_path}`} alt={productName} />
                <div className="card-body">
                </div>
              </div>
            </Col>
            <Col md={4} className="text-right">
              <div className="price-section">
                <h4>Price: ${price.toFixed(2)}</h4>
              </div>
            </Col>
            <button onClick={handleConfirmOrder}>Confirm Order</button>
          </Row>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default MakeOrder;
