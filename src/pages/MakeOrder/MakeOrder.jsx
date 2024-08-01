import React, { useEffect, useState, useRef } from 'react';
import Header from '../../components/Header';
import Container from 'react-bootstrap/Container';
import { fetchProductPageById, fetchProductPageByProductName, updateOrderStatus } from '../../components/dataService';
import { useParams } from 'react-router-dom';
import { Row, Col, Dropdown, Nav } from 'react-bootstrap';
import { useCart } from '../../components/cartContext';
import Footer from '../../components/Footer';
import { FaPlus } from 'react-icons/fa';
import './MakeOrder.css';

const MakeOrder = () => {
  const { id } = useParams();
  const { cartItems, removeFromCartAproved } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [error, setError] = useState(null);
  const [productOptions, setProductOptions] = useState([]);
  const [inputName, setInputName] = useState('');
  const [showInputForm, setShowInputForm] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [fetchClicked, setFetchClicked] = useState(false);
  const [totalPrice, setTotalPrice] = useState('0.00');
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);

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

  useEffect(() => {
    if (inputName.length >= 2) {
      handleGetProduct();
    }
  }, [inputName]);

  useEffect(() => {
    if (showInputForm && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showInputForm]);

  const handleGetProduct = async () => {
    if (inputName.length < 2) {
      console.log('Input name must be at least 2 characters long');
      return;
    }
    setFetchClicked(true);
    try {
      const response = await fetchProductPageByProductName(id, inputName); // Fetches by name with product ID
      console.log('Fetched product by name:', response);
      if (Array.isArray(response)) {
        setProductOptions(response.slice(0, 5)); // Limit to 5 products
      } else if (response && typeof response === 'object') {
        setProductOptions([response]);
      } else {
        setProductOptions([]);
      }
      console.log('Product options set:', response);
      setShowDropdown(true);
    } catch (error) {
      console.error('Error fetching product names:', error);
      setProductOptions([]);
    }
  };
  
const ProductDetailsCard = ({ product }) => (
  <div className="product-cardo">
    {product.path && (
      <img 
        src={product.path.path} 
        alt={product.productName.productName} 
        style={{ width: '50px', height: '50px' }} 
      />
    )}
    <div className="product-details">
      <h5>{product.productName ? product.productName.productName : 'No name available'}</h5>
      <p>{product.description ? product.description.description : 'No description available'}</p>
      <p>Price: ${product.price ? product.price.price.toFixed(2) : 'N/A'}</p>
    </div>
  </div>
);

  const handleProductSelect = (selectedProduct) => {
    console.log('Selected product data:', selectedProduct);
    setSelectedProducts([...selectedProducts, selectedProduct]); // Add to list of selected products
    setQuantity(1);
    setTotalPrice(selectedProduct.price.price.toFixed(2));
  };

  const handleConfirmOrder = async () => {
    if (!product) return;

    // Log cartItems to ensure it contains the expected data
    console.log('Cart items:', cartItems);

    // Find the order item that matches the product
    const orderItem = cartItems.find(item => item.id === product.id);

    // Log orderItem to ensure it's found correctly
    console.log('Order item:', orderItem);

    // Ensure the order ID is valid
    if (!orderItem || !orderItem.orderId || orderItem.orderId === 0) {
      console.error('Order ID is 0 or undefined, cannot update order status.');
      return;
    }

    // Prepare the order update object
    const orderUpdate = {
      orderId: { id: orderItem.orderId },  // Adjusting to the expected structure
      orderStatus: "NEW",
      productId: id  // Ensuring productId is correctly structured
    };

    // Attempt to update the order status
    try {
      const result = await updateOrderStatus(orderUpdate);
      console.log(result);
      removeFromCartAproved(product.id);
      console.log('Order status updated:', orderUpdate);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setQuantity(value);
    if (selectedProducts.length > 0) {
      setTotalPrice((selectedProducts.reduce((total, product) => total + product.price.price, 0) * value).toFixed(2));
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!product) return <p>No product found.</p>;

  return (
    <>
      <Header />
      <div className="productPage-content">
        <Container>
          <div className="productPageText-content">
            <h4>Description: {product.description ? product.description.description : 'No description available'}</h4>

            <button
              className="btn btn-outline-secondary mb-3"
              type="button"
              onClick={() => setShowInputForm(!showInputForm)}
            >
              <FaPlus /> Add option
            </button>

            {showInputForm && (
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter product name"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  ref={inputRef}
                />
                <div className="input-group-append">
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={handleGetProduct}
                  >
                    Fetch Product
                  </button>
                </div>
              </div>
            )}

            {fetchClicked && (
              <Dropdown show={showDropdown} onToggle={() => setShowDropdown(!showDropdown)}>
                <Dropdown.Toggle as={Nav.Link}>
                  Select Product
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {productOptions.length > 0 ? (
                    productOptions.slice(0, 5).map((option) => (
                      <Dropdown.Item key={option.productId.id} onClick={() => handleProductSelect(option)}>
                        <img src={option.path.path} alt={option.productName.productName} className="product-option-image" />
                        <div className="product-option-details">
                          <h5>{option.productName.productName}</h5>
                          <p>{option.description.description}</p>
                          <p>Price: ${option.price.price.toFixed(2)}</p>
                        </div>
                      </Dropdown.Item>
                    ))
                  ) : (
                    <Dropdown.Item>No products found.</Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>

          <Col md={5} className="mb-3">
            <h3 className="cardMakeOrder-text">{product.productName ? product.productName.productName : 'No name available'}</h3>
            <div className="card">
              {product.image_path && (
                <img className="card-img-top" src={product.image_path} alt={product.productName} />
              )}
              <div className="card-body">
                <p className="card-text">Price: ${product.price ? product.price.toFixed(2) : 'N/A'}</p>
                <div className="form-group">
                  <label htmlFor="quantity">Quantity:</label>
                  <input
                    type="number"
                    className="form-control"
                    id="quantity"
                    value={quantity}
                    onChange={handleQuantityChange}
                    min="1"
                  />
                </div>
                <p className="card-text">Total Price: ${(selectedProducts.reduce((total, product) => total , product.price) * quantity)}</p>
              </div>
            </div>
          </Col>
          <hr />
          <Col>
            <div className="order_square">
              <h3>Extra product</h3>
              <Row>
                {selectedProducts.map((product, index) => (
                  <Col key={index} md={4}>
                    <ProductDetailsCard product={product} />
                  </Col>
                ))}
              </Row>
            </div>
          </Col>
          <p>Total Price: ${(selectedProducts.reduce((total, product) => total + product.price.price, product.price) * quantity).toFixed(2)}</p>

          <Row>
            <Col>
              <button onClick={handleConfirmOrder} className="btn btn-primary mt-3">Confirm Order</button>
            </Col>
          </Row>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default MakeOrder;