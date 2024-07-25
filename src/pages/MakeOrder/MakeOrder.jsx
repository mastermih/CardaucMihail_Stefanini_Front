import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Container from 'react-bootstrap/Container';
import './MakeOrder.css';
import { fetchProductPageById, postOrder } from '../../components/dataService';
import { useParams } from 'react-router-dom';
import { Row } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';

const MakeOrder = () => {
  const { id } = useParams();
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
    const order = {
      userId: { id: 2 },
      productId: product.id,
      orderStatus: "NEW"
    };
    try {
        const result = await postOrder(order);
        console.log('Order successfully created', result);
    } catch (error) {
      console.log('Error creating order', error);
    }
  }

  return (
    <>
      <Header />
      <div className="productPage-content">
        <Container>
          <Row>
            <Col md={5} className="mb-4">
              <h3 className="card-text">{productName}</h3>
              <div className="card">
                <img className="card-img-top" src={`/images/${image_path}`} alt={productName} />
                <div className="card-body">
                </div>
              </div>
            </Col>
            <Col md={4} className="text-right">
              <div className="price-section">
                <h4>Price: ${price.toFixed(2)}</h4>
              </div>
            </Col>
            <button className='btn btn-primary' onClick={handleConfirmOrder}>Confirm Order</button>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default MakeOrder;
