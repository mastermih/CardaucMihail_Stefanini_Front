import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/Header';
import Container from 'react-bootstrap/Container';
import { fetchOrderProductAndExtraProduct, fetchProductPageByProductName, updateOrderStatus, postOrderProduct, sendOrderEmail } from '../../components/dataService';
import { Row, Col, Dropdown, Nav } from 'react-bootstrap';
import { useCart } from '../../components/cartContext';
import Footer from '../../components/Footer';
import { FaPlus } from 'react-icons/fa';
import './MakeOrder.css';

const MakeOrder = () => {
    const { id } = useParams();
    const { cartItems, clearCart } = useCart();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPrice, setTotalPrice] = useState('0.00');
    const [inputName, setInputName] = useState('');
    const [showInputForm, setShowInputForm] = useState(false);
    const [fetchClicked, setFetchClicked] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [productOptions, setProductOptions] = useState([]);
    const [currentProductId, setCurrentProductId] = useState([]);

    const inputRef = useRef(null);
    const navigate = useNavigate();

    const transformData = (data) => {
        console.log("Data in transformData:", data); // For debugging
        
        if (!Array.isArray(data) || data.length < 2) {
            console.error("Invalid data format");
            return null;
        }
    
        const orderInfo = data[0];  // The first element in the array is the order information
        const productInfo = data[1];  // The second element is the main product information
    
        console.log("Order Info:", orderInfo); // For debugging
        console.log("Product Info:", productInfo); // For debugging
    
        // Assuming extra products are part of the orderData after the main product info
        const extraProducts = data.slice(2).map(extraproduct => {
            console.log("Raw extra product data:", extraproduct);
            return {
                orderId: extraproduct.orderId,  
                productName: extraproduct.productName,  
                quantity: extraproduct.quantity,  
                price: extraproduct.price,  
                productId: extraproduct.productId,  
                parentProductId: extraproduct.parentProductId,  
                imagePath: extraproduct.imagePath || extraproduct.someOtherKeyForImagePath,  // Use the correct key here
                categoryType: extraproduct.categoryType  
            };
        });
        
    
        return {
            orderId: orderInfo.orderId,  // Order ID of the main product
            orderStatus: orderInfo.productName,  // Order status of the main product
            createdDate: orderInfo.quantity,  // Created date of the main product
            updatedDate: orderInfo.price,  // Updated date of the main product
            productId: productInfo.productId,  // Main product ID
            productName: productInfo.productName,  // Main product name
            quantity: productInfo.quantity,  // Main product quantity
            price: productInfo.price,  // Main product price
            parentProductId: productInfo.extraProductId,  // Parent product ID (if any)
            imagePath: productInfo.extraQuantity,  // Main product image path
            categoryType: productInfo.extraPrice,  // Main product category type
            extraProducts: extraProducts  // Attach the extra products here
        };
    };
    
    
    
    useEffect(() => {
        const loadOrders = async () => {
            try {
                console.log('Fetching order and extra product details...');
                const fetchedOrders = await Promise.all(
                    cartItems.map(async (cartItem) => {
                        const orderResponse = await fetchOrderProductAndExtraProduct(cartItem.orderId);
                        const orderData = orderResponse.data;
    
                        console.log("Raw order data:", orderData);
    
                        // Transform the data into the desired format
                        const transformedOrder = transformData(orderData);
                        console.log("Transformed order data:", transformedOrder);
    
                        if (transformedOrder) {
                            return transformedOrder;
                        } else {
                            console.error("Order data transformation failed.");
                            return null;
                        }
                    })
                );
    
                const validOrders = fetchedOrders.filter(order => order !== null);
                setOrders(validOrders);  // Ensure this is called after filtering
                setLoading(false);  // Stop loading after state is set
    
            } catch (error) {
                console.error('Error fetching orders:', error);
                setError(error);  // Handle errors and stop loading
                setLoading(false);
            }
        };
    
        loadOrders();
    }, [cartItems]);
    
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
        const total = orders.reduce((total, order) => {
            const mainProductTotal = (order.quantity * order.price) || 0;
            const extraProductTotal = order.extraProducts.reduce((acc, extraProduct) => acc + (extraProduct.price * extraProduct.quantity), 0) || 0;
            return total + mainProductTotal + extraProductTotal;
        }, 0);

        setTotalPrice(total.toFixed(2));
    }, [orders]);

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

    const isElevator = (transformedOrder) => {
        if (transformedOrder.categoryType === 'Elevator') {
            return true;
        }
        console.log("Nuuuuuuuuuuuuu ",  transformedOrder.categoryType); // Debugging output if it's not an elevator
        return false;
    };
    
    
    const ExtraItemForMainProduct = ({ product, onRemove }) => {
        const imageUrl = product.imagePath || product.path?.path || null;
    
        const productName = typeof product.productName === 'string' ? product.productName : 'No name available';
        const productPrice = product.price && typeof product.price === 'number'
            ? `$${product.price.toFixed(2)}`
            : '$0.00';
    
        return (
            <div className="extraItemForMain">
                {imageUrl ? (
                    <img src={imageUrl} style={{ width: '50px', height: '50px' }} alt={productName} />
                ) : (
                    <div style={{ width: '50px', height: '50px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        No Image Available
                    </div>
                )}
                <div className="extra-item-details">
                    <button className="RemoveButton" onClick={onRemove}>Remove</button>
                    <p>Price: {productPrice}</p>
                    <h6>{productName}</h6>
                </div>
            </div>
        );
    };
    

    const handleRemoveExtraProduct = (mainProductId, extraProductId) => {
        setOrders(prevOrders => prevOrders.map(order => {
            if (order.productId === mainProductId) {
                return {
                    ...order,
                    extraProducts: order.extraProducts.filter(extraProduct => extraProduct.productId !== extraProductId)
                };
            }
            return order;
        }));
    };

    const handleProductSelect = async (mainProductId, selectedProduct) => {
        console.log('Selected product data:', selectedProduct);
    
        // Access the price correctly by navigating the nested object
        const price = selectedProduct.price && typeof selectedProduct.price.price === 'number'
            ? parseFloat(selectedProduct.price.price)
            : 0;
    
        // Find the main product's order item by its ID
        const orderItem = cartItems.find(item => item.id === mainProductId);
    
        if (!orderItem || !orderItem.orderId || orderItem.orderId === 0) {
            console.error('Order ID is 0 or undefined, cannot update order status.');
            return;
        }
    
        // Construct the productName object as expected by the backend
        const productName = {
            product_name: selectedProduct.productName.product_name // Ensure this matches the backend structure
        };
    
        // Prepare the extra product to be added, including the parent product ID
        const extraOrderProduct = {
            order: { orderId: { id: orderItem.orderId } },
            product: {
                productName: productName, // Send as an object
                productId: {id:selectedProduct.productId.id} // Accessing nested product ID correctly
            },
            quantity: {quantity: 1}, // Assuming the quantity is 1 for extra products
            priceOrder: {price: price}, // Using the correctly accessed price
            parent_product_id: { id: mainProductId } // Set the parent product ID to the main product's ID
        };
    
        try {
            // Post the extra product order
            await postOrderProduct(extraOrderProduct);
            console.log('Extra product added:', extraOrderProduct);
    
            // Update the orders state to include the new extra product
            setOrders(prevOrders => prevOrders.map(order => {
                if (order.productId === mainProductId) {
                    return {
                        ...order,
                        extraProducts: [...order.extraProducts, { ...selectedProduct, price }]
                    };
                }
                return order;
            }));
    
        } catch (error) {
            console.error('Error adding extra product:', error);
        }
    };
    
    const handleConfirmOrder = async () => {
        try {
            for (const order of orders) {
                const orderItem = cartItems.find(item => item.id === order.productId);

                if (!orderItem || !orderItem.orderId || orderItem.orderId === 0) {
                    console.error('Order ID is 0 or undefined, cannot update order status.');
                    continue;
                }

                const orderUpdate = {
                    orderId: { id: orderItem.orderId },
                    orderStatus: "NEW",
                    productId: order.productId
                };

                const mainOrderProduct = {
                    order: { orderId: { id: orderItem.orderId } },
                    product: { productId: { id: order.productId } },
                    quantity: order.quantity,
                    priceOrder: order.price
                };

                const confirmationLink = `http://localhost:3000/sendMail/confirm/${orderItem.orderId}`;

                const sendOrderEmailConfirm = {
                    recipient: "cardaucmihai@gmail.com",
                    msgBody: `This is a test email from Spring Boot. Please confirm your order by clicking the link below:\n\n${confirmationLink}`,
                    subject: "Order Confirmation",
                    orderId: orderItem.orderId
                };

                await updateOrderStatus(orderUpdate);
                await sendOrderEmail(sendOrderEmailConfirm);
            }
            clearCart();
            navigate('/');
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    const handleQuantityChange = (mainProductId, value) => {
        setOrders(prevOrders => prevOrders.map(order => {
            if (order.productId === mainProductId) {
                return {
                    ...order,
                    quantity: value
                };
            }
            return order;
        }));
    };

    const handleAddOptionClick = (mainProductId) => {
        setCurrentProductId(mainProductId);
        setShowInputForm(true);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    if (!orders || orders.length === 0) return <p>No orders found.</p>;

    return (
        <>
            <Header />
            <div className="productPage-content">
                <Container>
                {orders.map((order, orderIndex) => (
    <Row key={orderIndex}>
        <Col md={5} className="mb-3">
            <h3>{order.productName || 'Product Name Not Available'}</h3>
            <div className="card custom-card">
                {order.imagePath && (
                    <img
                        className="card-img-top"
                        src={order.imagePath}
                        alt={order.productName}
                        style={{ width: '350px', height: '400px', objectFit: 'cover' }}
                    />
                )}
             <div className="card-body">
    <p>Price: ${typeof order.price === 'number' ? order.price.toFixed(2) : 'N/A'}</p>
    <div className="form-group">
        <label htmlFor={`quantity-${order.productId}`}>Quantity:</label>
        <input
            type="number"
            className="form-control short-input"
            id={`quantity-${order.productId}`}
            value={order.quantity || 1}
            onChange={(e) => handleQuantityChange(order.productId, parseInt(e.target.value))}
            min="1"
        />
    </div>
    <p className="card-text">
        Total Price: ${(
            (order.price * (order.quantity || 1)) +
            (order.extraProducts.reduce((acc, extraProduct) => acc + extraProduct.price * extraProduct.quantity, 0) || 0)
        ).toFixed(2)}
    </p>
    {isElevator(order) && (
        <>
            <h5>Extra options</h5>
            <div className="FacemRama">
                {order.extraProducts.map((extraProduct, extraIndex) => {
                    console.log("Rendering extra product:", extraProduct);  // Debugging each extra product
                    return (
                        <ExtraItemForMainProduct
                            key={extraIndex}
                            product={extraProduct}
                            onRemove={() => handleRemoveExtraProduct(order.productId, extraProduct.productId)}
                        />
                    );
                })}
            </div>
            <button
                className="btn btn-outline-secondary mb-3"
                type="button"
                onClick={() => {
                    setShowInputForm(!showInputForm);
                    handleAddOptionClick(order.productId);
                }}>
                <FaPlus /> Add option
            </button>
        </>
    )}
</div>

                            </div>
                        </Col>
                    </Row>
                ))}
    
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
                  {/* E imaginea ce apare nupa ce introduc mai mult de 2 litere */}
                    {fetchClicked && (
                        <Dropdown show={showDropdown} onToggle={() => setShowDropdown(!showDropdown)}>
                            <Dropdown.Toggle as={Nav.Link}>
                                Select Product
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {productOptions.length > 0 ? (
                                    productOptions.map((option) => (
                                        <Dropdown.Item
                                            key={option.productId || option.productName}
                                            onClick={() => handleProductSelect(currentProductId, option)}
                                        >
                                            <img
                                                src={option.path?.path || option.imagePath}
                                                alt={typeof option.productName === 'string' ? option.productName : 'Product Image'}
                                                className="product-option-image"
                                            />
                                            <div className="product-option-details">
                                                <h5>{typeof option.productName === 'string' ? option.productName : 'No Name Available'}</h5>
                                                <div className="Mihailll-item-description">
                                                    <p>{typeof option.description?.description === 'string' ? option.description?.description : 'No Description Available'}</p>
                                                </div>
                                                <p>Price: ${typeof option.price === 'number' ? option.price.toFixed(2) : 'N/A'}</p>
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
                </Container>
            </div>
            <Footer />
        </>
    );
};    

export default MakeOrder;
