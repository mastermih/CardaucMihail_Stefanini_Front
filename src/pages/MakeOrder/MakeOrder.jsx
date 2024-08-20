import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/Header';
import Container from 'react-bootstrap/Container';
import { fetchProductPageById, fetchProductPageByProductName, updateOrderStatus, postOrderProduct, sendOrderEmail} from '../../components/dataService';
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
  const [currentProductId, setCurrentProductId] = useState(null);
  const [productOptions, setProductOptions] = useState([]);
  const [inputName, setInputName] = useState('');
  const [showInputForm, setShowInputForm] = useState(false);
  const [fetchClicked, setFetchClicked] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [extraProducts, setExtraProducts] = useState({});
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
    const total = products.reduce((total, product) => {
      const quantityer = quantity[product.id] || 1; // Default quantity to 1 if not set
      return total + (quantityer * (product.price || 0));
    }, 0);
  
    setTotalPrice(total.toFixed(2));
  }, [products, quantity]);
  
  const handleGetProduct = async () => {
    const productId = id === 'cart' ? 42 : id; // Use 42 if id is 'cart'
    if (inputName.length < 2) {
      console.log('Input name must be at least 2 characters long');
      return;
    }
    setFetchClicked(true);
    try {
      const response = await fetchProductPageByProductName(productId, inputName);
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
      {/* Nu uita sa stergi asta  */}
      <div className="product-details">
        <h5>{product.productName ? product.productName.productName : 'No name available'}</h5>
        <p>{product.description ? product.description.description : 'No description available'}</p>
        <p>Price: ${typeof product.price === 'number' ? product.price.toFixed(2) : 'N/A'}</p>
      </div>
    </div>
  );

  const ExtraItemForMainProdct = ({ product }) => (
    <div className="extraItemForMain">

      <img src={product.path.path} 
      alt={product.productName.productName}
      style={{ width: '50px', height: '50px' }}/> 
      <div className="extra-item-details">
       <p>Price: $ {product.price}</p>
      <h6>{product.productName ? product.productName.productName : 'No name available'}</h6>
      <br></br>
          <hr></hr>
         </div>
      <hr></hr>
    </div>
  )
  

  const handleProductSelect = (productId, selectedProduct) => {
    console.log('Selected product data:', selectedProduct);
  
    // Ensure the price is a number, fallback to 0 if it's not a valid number
    const price = selectedProduct.price && typeof selectedProduct.price.price === 'number'
      ? parseFloat(selectedProduct.price.price)
      : 0;
  
    setExtraProducts(prevExtraProducts => ({
      ...prevExtraProducts,
      [productId]: [...(prevExtraProducts[productId] || []), { ...selectedProduct, price }]
    }));
    setTotalPrice(
      (products.reduce((total, product) => total + (product.price || 0), 0)).toFixed(2)
    );
  };

  const handleConfirmOrder = async () => {
    try {
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
  
        const mainOrderProduct = {
          order: { orderId: { id: orderItem.orderId } },
          product: { productId: { id: product.id } },
          quantity: { quantity: quantity[product.id] || 1 },
          priceOrder: { price: product.price }
        };
  
        const confirmationLink = `http://localhost:3000/sendMail/confirm/${orderItem.orderId}`;
  
        const sendOrderEmailConfirm = {
          recipient: "cardaucmihai@gmail.com",
          msgBody: `This is a test email from Spring Boot. Please confirm your order by clicking the link below:\n\n${confirmationLink}`,
          subject: "Order Confirmation",
          orderId: orderItem.orderId
        };
  
        // Send the order update and email confirmation
        const result = await updateOrderStatus(orderUpdate);
        const resultEmail = await sendOrderEmail(sendOrderEmailConfirm);
  
        console.log(resultEmail);
        console.log(result);
        console.log('Order status updated:', orderUpdate);
  
        // Post the main product order
        await postOrderProduct([mainOrderProduct]);
        console.log('Main product added:', mainOrderProduct);
  
        // Post each associated extra product
        if (extraProducts[product.id]) {
          for (const extraProduct of extraProducts[product.id]) {
            const extraOrderProduct = {
              order: { orderId: { id: orderItem.orderId } },
              product: { productId: { id: extraProduct.productId.id } },
              quantity: { quantity: 1 }, // Assuming a quantity of 1 for extra products
              priceOrder: { price: extraProduct.price }
            };
            await postOrderProduct([extraOrderProduct]);
            console.log('Extra product added:', extraOrderProduct);
          }
        }
      }
      clearCart();
      navigate('/');
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };
  

  const handleQuantityChange = (productId, value) => {
    setQuantity(prevQuantities => ({
      ...prevQuantities,
      [productId]: value
    }));
  
    // Update the total price for that product
    setTotalPrice(
      (products.reduce((total, product) => 
        total + ((quantity[product.id] || 1) * (product.price || 0)), 0)
      ).toFixed(2)
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
  {products
    .filter(product => product.image_path) // Filter out products without an image_path
    .map((product, index) => (
      <Col key={index} md={5} className="mb-3">
        <h3>{product.productName}</h3> 

        <div className="card custom-card">
          {product.image_path && (
            <img 
              className="card-img-top" 
              src={product.image_path} 
              alt={product.productName} 
              style={{ width: '350px', height: '400px', objectFit: 'cover' }} 
            />
          )}
          <div className="card-body">
            <p>Price: ${typeof product.price === 'number' ? product.price.toFixed(2) : 'N/A'}</p>
            <div className="form-group">
            <label htmlFor={`quantity-${product.id}`}>Quantity:</label>
              <input
                type="number"
                className="form-control short-input" 
                id={`quantity-${product.id}`}
                value={quantity[product.id] || 1}
                onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                min="1"
              />
            </div>
            <p className="card-text">Total Price: ${(product.price ? product.price * (quantity[product.id] || 1) : 0).toFixed(2)}</p>
            <h5>Extra options</h5>
            <div className="FacemRama">
            {extraProducts[product.id]?.map((extraProduct, extraIndex) => (
              <ExtraItemForMainProdct key={extraIndex} product={extraProduct}/>
            ))}
            </div>
            <button
              className="btn btn-outline-secondary mb-3"
              type="button"
              onClick={() => {
                setShowInputForm(!showInputForm);
                setCurrentProductId(product.id);
              }}>
                
              <FaPlus /> Add option
            </button>
          </div>
        </div>
      </Col>
    ))}
</Row>


          <div className="product-actions mt-3">
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
<Dropdown.Item key={option.productId.id} onClick={() => handleProductSelect(currentProductId, option)}>
  <img src={option.path.path} alt={option.productName.productName} className="product-option-image" />
  <div className="product-option-details">
    <h5>{option.productName.productName}</h5>
    <div className="Mihailll-item-description">
      <p>{option.description.description}</p>
    </div>
    <p>Price: ${typeof option.price.price === 'number' ? option.price.price.toFixed(2) : 'N/A'}</p>
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
            {newProducts.map((product, index) => (
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
