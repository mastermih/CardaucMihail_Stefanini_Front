import React, { useEffect, useState } from 'react';
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
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState(null);
  const [productOptions, setProductOptions] = useState([]);
  const [inputName, setInputName] = useState('');
  const [showInputForm, setShowInputForm] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [fetchClicked, setFetchClicked] = useState(false);
  const [totalPrice, setTotalPrice] = useState('0.00');
  const [showDropdown, setShowDropdown] = useState(false);

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

  const handleGetProduct = async () => {
    setFetchClicked(true);
    setLoading(true);
    try {
      const productNameObj = { productId: id, name: inputName };
      const response = await fetchProductPageByProductName(productNameObj);
      console.log('Fetched product by name:', response); 

      if (Array.isArray(response)) {
        setProductOptions(response);
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
    } finally {
      setLoading(false);
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
    setSelectedProduct(selectedProduct);
    setQuantity(1); 
    setTotalPrice(selectedProduct.price.price.toFixed(2));
  };

  const handleConfirmOrder = async () => {
    if (!selectedProduct) return;

    const orderItem = cartItems.find(item => item.id === selectedProduct.id);

    if (!orderItem || !orderItem.orderId) {
      console.error('Order ID is 0, cannot update order status.');
      return;
    }

    const order = {
      orderId: { id: orderItem.orderId },
      orderStatus: "NEW",
      productId: selectedProduct.id
    };

    try {
      const result = await updateOrderStatus(order);
      removeFromCartAproved(orderItem.orderId);
    } catch (error) {
      console.log('Error updating order status:', error);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setQuantity(value);
    if (selectedProduct) {
      setTotalPrice((selectedProduct.price.price * value).toFixed(2));
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
                    productOptions.map((option) => (
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

          {selectedProduct && (
            <div className="product-card">
            </div>
          )}

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
                <p className="card-text">Total Price: ${(selectedProduct && selectedProduct.price ? selectedProduct.price.price : product.price) * quantity}</p>
              </div>
            </div>
          </Col>
          <hr />
          <Col>
        
            <div className="order_square">
              <h3>Order Summary</h3>
              {selectedProduct && (
            <ProductDetailsCard product={selectedProduct} />
          )}
              <p>
                Total Price: ${(
                  (selectedProduct && selectedProduct.price ? selectedProduct.price.price : 0) + (product.price || 0)
                ) * quantity}
              </p> 
               </div>
              
          </Col>

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
