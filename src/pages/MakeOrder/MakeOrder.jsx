import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/Header';
import Container from 'react-bootstrap/Container';
import { fetchProductPageById, fetchProductPageByProductName, updateOrderStatus, postOrderProduct } from '../../components/dataService';
import { Row, Col, Dropdown, Nav } from 'react-bootstrap';
import { useCart } from '../../components/cartContext';
import Footer from '../../components/Footer';
import { FaPlus } from 'react-icons/fa';
import './MakeOrder.css';

const MakeOrder = () => {
  const { id } = useParams();
  const { cartItems, clearCart } = useCart();
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState('0.00');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productOptions, setProductOptions] = useState([]);
  const [inputName, setInputName] = useState('');
  const [showInputForm, setShowInputForm] = useState(false);
  const [fetchClicked, setFetchClicked] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [newProducts, setNewProducts] = useState([]); // State to track newly added products

  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        if (id === 'cart') {
          setProducts(cartItems);
        } else {
          const { data } = await fetchProductPageById(id);
          setProducts([data]);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [id, cartItems]);

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

  useEffect(() => {
    setTotalPrice(
      (products.reduce((total, product) => total + (product.price || 0), 0) * quantity).toFixed(2)
    );
  }, [products, quantity]);

  const handleGetProduct = async () => {
    if (inputName.length < 2) {
      console.log('Input name must be at least 2 characters long');
      return;
    }
    setFetchClicked(true);
    try {
      const response = await fetchProductPageByProductName(id, inputName);
      console.log('Fetched product by name:', response);
      if (Array.isArray(response)) {
        setProductOptions(response.slice(0, 5));
      } else if (response && typeof response === 'object') {
        setProductOptions([response]);
      } else {
        setProductOptions([]);
      }
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
        <p>Price: ${product.price ? parseFloat(product.price.price).toFixed(2) : 'N/A'}</p>
      </div>
    </div>
  );

  const handleProductSelect = (selectedProduct) => {
    console.log('Selected product data:', selectedProduct);
    
    // Ensure the price is a number
    const price = parseFloat(selectedProduct.price.price);
    
    setProducts([...products, { ...selectedProduct, price }]);
    setNewProducts([...newProducts, { ...selectedProduct, price }]); // Add to newProducts state
    setQuantity(1);
    setTotalPrice(
      (products.reduce((total, product) => total + product.price, 0)).toFixed(2)
    );
  };

  const handleConfirmOrder = async () => {
    for (const product of products) {
      const orderItem = cartItems.find(item => item.id === product.id);

      if (!orderItem || !orderItem.orderId || orderItem.orderId === 0) {
        console.error('Order ID is 0 or undefined, cannot update order status.');
        continue;
      }

      const orderUpdate = {
        orderId: { id: orderItem.orderId },
        orderStatus: "NEW",
        productId: product.id
      };

      const orderProduct = [
        {
          order: {
            orderId: { id: orderItem.orderId }
          },
          product: {
            productId: { id: product.id }
          },
          quantity: {
            quantity: 1
          },
          priceOrder: {
            price: product.price
          }
        }
      ];

      try {
        const result = await updateOrderStatus(orderUpdate);
        console.log(result);
        console.log('Order status updated:', orderUpdate);
        // Post each newly added product
        for (const newProduct of newProducts) {
          const newOrderProduct = [{
            order: { orderId: { id: orderItem.orderId } },
            product: { productId: { id: product.id } },
            quantity: { quantity: 1 },
            priceOrder: { price: newProduct.price }
          }];
          const result2 = await postOrderProduct(newOrderProduct);
          console.log('New product added:', newOrderProduct);
        }
      } catch (error) {
        console.error('Error updating order status:', error);
      }
    }
    clearCart();
    navigate('/');
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setQuantity(value);
    setTotalPrice(
      (products.reduce((total, product) => total + (product.price || 0), 0) * value).toFixed(2)
    );
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!products || products.length === 0) return <p>No product found.</p>;

  return (
    <>
      <Header />
      <div className="productPage-content">
        <Container>
          <Row>
            {products.map((product, index) => (
              <Col key={index} md={5} className="mb-3">
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
                    <p className="card-text">Total Price: ${(product.price ? product.price * quantity : 0).toFixed(2)}</p>
                  </div>
                </div>
              </Col>
            ))}
          </Row>

          <div className="product-actions mt-3">
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
          </div>

          {fetchClicked && (
            <Dropdown show={showDropdown} onToggle={() => setShowDropdown(!showDropdown)}>
              <Dropdown.Toggle as={Nav.Link}>
                Select Product
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {productOptions.length > 0 ? (
                  productOptions.map((option) => (
                    <Dropdown.Item key={option.productId.id} onClick={() => handleProductSelect(option)}>
                      <img src={option.path.path} alt={option.productName.productName} className="product-option-image" />
                      <div className="product-option-details">
                        <h5>{option.productName.productName}</h5>
                        <p>{option.description.description}</p>
                        <p>Price: ${option.price ? option.price.price.toFixed(2) : 'N/A'}</p>
                      </div>
                    </Dropdown.Item>
                  ))
                ) : (
                  <Dropdown.Item>No products found.</Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
          )}

          <Row>
            <Col>
              <p>Total Price: ${totalPrice}</p>
              <button onClick={handleConfirmOrder} className="btn btn-primary mt-3">Confirm Order</button>
            </Col>
          </Row>

          <div className="order_square mt-5">
            <h3>Extra products</h3>
            <Row>
              {products.slice(1).map((product, index) => (
                <Col key={index} md={4}>
                  <ProductDetailsCard product={product} />
                </Col>
              ))}
            </Row>
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default MakeOrder;
