import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate, useLocation } from 'react-router-dom';
import './DetailedOrder.css';
import { fetchOrderProductAndExtraProduct, fetchProductPageById, getOperatorForOrder } from '../../components/dataService';

const DetailedOrder = () => {
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState([]);  
  const [productDetails, setProductDetails] = useState({});
  const [loadingOrder, setLoadingOrder] = useState(true);  
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [operatorNames, setOperatorNames] = useState([]);
  const [error, setError] = useState(null);  
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const orderId = searchParams.get('orderId');

  // Fetch Order Details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setError('Order ID is missing in the URL');
        return;
      }

      try {
        setLoadingOrder(true);
        const orderResponse = await fetchOrderProductAndExtraProduct(orderId);
        const orderData = orderResponse.data;
        console.log('Order API Response:', orderData);

        if (!orderData || orderData.length === 0) {
          setError('No products found in the order.');
          setLoadingOrder(false);
          return;
        }

        setOrderDetails(orderData);

        // Loop through all products and fetch details for each one
        orderData.forEach(async (product) => {
          const productId = product.productId;
          if (productId) {
            fetchProductDetails(productId);
          } else {
            console.error("Product ID is missing in the order details.");
          }
        });

        setLoadingOrder(false);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Failed to load order details.');
        setLoadingOrder(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const fetchProductDetails = async (productId) => {
    try {
      setLoadingProduct(true);
      const productResponse = await fetchProductPageById(productId);
      const productData = productResponse.data;
      console.log('Product details:', productData);
      
      // Save product details using product ID as the key
      setProductDetails(prevDetails => ({
        ...prevDetails,
        [productId]: productData
      }));
      
      setLoadingProduct(false);
    } catch (err) {
      console.error('Error fetching product details:', err);
      setError('Failed to load product details.');
      setLoadingProduct(false);
    }
  };

  useEffect(() => {
    const fetchOperatorName = async () => {
      try {
        const response = await getOperatorForOrder(orderId);
        setOperatorNames(response);
      } catch (error) {
        console.error('Error fetching operator names:', error);
        setOperatorNames([]);
      }
    };

    if (orderId) {
      fetchOperatorName();
    }
  }, [orderId]);

  if (loadingOrder) {
    return <div>Loading order details...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const totalPrice = orderDetails?.reduce((sum, product) => sum + product.price, 0) || 0;

  return (
    <div className="content-section">
      <Container>
        <Row>
          {/* Order Details */}
          <Col md={8} className="order-details">
            <h3>Order Details for Order ID: {orderId}</h3>
            {orderDetails?.length > 0 ? (
              orderDetails.map((product, index) => (
                <div key={index} className="order-product">
                  <h4>Product Name: {product.productName}</h4>
                  <p>Quantity: {product.quantity}</p>
                  <p>Price: ${product.price}</p>

                  {/* Product Details for Each Product */}
                  {productDetails[product.productId] ? (
                    <div className="product-details-section">
                      <div className="product-image">
                        <img
                          src={productDetails[product.productId]?.image_path || '/images/default.jpg'}  // Dynamically use the product image path from the database
                          alt={productDetails[product.productId]?.productName || 'No name'}
                          style={{ width: '100%', maxWidth: '400px' }}
                        />
                      </div>

                      <div className="product-info">
                        <h4>{productDetails[product.productId]?.productName}</h4>
                        <p>Brand: {productDetails[product.productId]?.productBrand || 'N/A'}</p>
                        <p>Electricity Consumption: {productDetails[product.productId]?.electricityConsumption || 'N/A'} kWh</p>
                        <p>Price: ${productDetails[product.productId]?.price || 'N/A'}</p>
                        <p>Description: {productDetails[product.productId]?.description || 'No description available'}</p>
                      </div>
                    </div>
                  ) : (
                    <p>Loading product details...</p>
                  )}
                </div>
              ))
            ) : (
              <p>No products found in this order.</p>
            )}
          </Col>

          {/* Operator Names */}
          <Col md={4} className="operator-details">
            <h5>Operator(s):</h5>
            {operatorNames.length > 0 ? (
              operatorNames.map((name, index) => (
                <div key={index} className="operator-badge">
                  {name}
                </div>
              ))
            ) : (
              <p>No operators assigned</p>
            )}
          </Col>
        </Row>

        {/* Total Price */}
        <Row>
          <Col md={12}>
            <h3 className="total-price">Total Price: ${totalPrice}</h3>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DetailedOrder;
