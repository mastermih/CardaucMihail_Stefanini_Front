import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/Header';
import Container from 'react-bootstrap/Container';
import {
    deltedTheExtraProductFromMainProduct,
    fetchOrderProductAndExtraProduct,
    fetchProductPageByProductName,
    updateOrderStatus,
    postOrderProduct,
    sendOrderEmail
} from '../../components/dataService';
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
    const [currentProductId, setCurrentProductId] = useState(null);

    const inputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/", { state: { showLoginForm: true } });
        }
      }, [navigate]);

    const transformData = (data) => {
        try {
            const orderProductsArray = Array.isArray(data) ? data : [];
            if (orderProductsArray.length === 0) {
                return null;
            }
    
            const mainProduct = orderProductsArray[0];
            if (!mainProduct) {
                return null;
            }
    
            const transformedExtraProducts = orderProductsArray.slice(1).map(extraproduct => {
                return {
                    orderId: extraproduct.orderId || null,
                    productName: extraproduct.productName || 'Unknown Product',
                    quantity: extraproduct.quantity || 0,
                    price: extraproduct.price || 0,
                    productId: extraproduct.productId || null,
                    parentProductId: extraproduct.parent_product_id || null,
                    imagePath: extraproduct.product?.path?.path || '/default/path/to/image.jpg', // Correctly fetch image path
                    categoryType: extraproduct.categoryType || 'Unknown Category',
                };
            });
    
            return {
                orderId: mainProduct.orderId || null,
                orderStatus: data.orderStatus || 'Unknown Status',
                createdDate: data.createdDate || 'Unknown Date',
                updatedDate: data.updatedDate || 'Unknown Date',
                productId: mainProduct.productId || null,
                productName: mainProduct.productName || 'Unknown Product',
                quantity: mainProduct.quantity || 0,
                price: mainProduct.price || 0,
                parentProductId: mainProduct.parent_product_id || null,
                imagePath: mainProduct.path || '/default/path/to/image.jpg',
                categoryType: mainProduct.categoryType || 'Unknown Category',
                extraProducts: transformedExtraProducts.length > 0 ? transformedExtraProducts : []
            };
        } catch (error) {
            console.error("Error during data transformation:", error.message);
            return null;
        }
    };
    
    

    useEffect(() => {
        const loadAllOrders = async () => {
            try {
                setLoading(true);
                const fetchedOrders = await Promise.all(
                    cartItems.map(async (cartItem) => {
                        const orderResponse = await fetchOrderProductAndExtraProduct(cartItem.orderId);
                        const transformedOrder = transformData(orderResponse.data);
                        return transformedOrder || null;
                    })
                );
                const validOrders = fetchedOrders.filter(order => order !== null);
                setOrders(validOrders);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching all orders:', error);
                setError(error);
                setLoading(false);
            }
        };

        if (!id) {
            loadAllOrders(); // Load all orders when no ID is provided in the URL
        }
    }, [cartItems, id]);

    useEffect(() => {
        const loadSpecificOrder = async () => {
            try {
                setLoading(true);
                const orderResponse = await fetchOrderProductAndExtraProduct(id);
                const transformedOrder = transformData(orderResponse.data);
                if (transformedOrder) {
                    setOrders([transformedOrder]);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching specific order:', error);
                setError(error);
                setLoading(false);
            }
        };

        if (id) {
            loadSpecificOrder();
        }
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

    useEffect(() => {
        const total = orders.reduce((total, order) => {
            const mainProductTotal = (order.quantity * order.price) || 0;
            const extraProductTotal = Array.isArray(order.extraProducts)
                ? order.extraProducts.reduce((acc, extraProduct) => acc + (extraProduct.price * extraProduct.quantity), 0)
                : 0;
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
        return transformedOrder.categoryType === 'Elevator';
    };

    const ExtraItemForMainProduct = ({ product, onRemove }) => {
        if (!product) {
            console.error("Product is null or undefined.");
            return null;
        }
    
        const imageUrl = product.imagePath || '/default/path/to/image.jpg';  // Ensure the correct path
    
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
    
    

    const handleProductSelect = async (mainProductId, selectedProduct) => {
        console.log('Selected product data:', selectedProduct);

        if (!selectedProduct.categoryType) {
            console.error('Invalid or missing category type:', selectedProduct.categoryType);
            return;
        }

        const price = selectedProduct.price?.price || 0;

        const orderItem = cartItems.find(item => item.id === mainProductId);

        if (!orderItem || !orderItem.orderId || orderItem.orderId === 0) {
            console.error('Order ID is 0 or undefined, cannot update order status.');
            return;
        }

        const extraOrderProduct = {
            order: { orderId: { id: orderItem.orderId } },
            product: {
                productName: selectedProduct.productName || 'Unknown Product',
                productId: { id: selectedProduct.productId.id }
            },
            quantity: { quantity: 1 },
            priceOrder: { price: price },
            parent_product_id: { id: mainProductId },
            categoryType: selectedProduct.categoryType // Pass the categoryType as is
        };

        try {
            const response = await postOrderProduct(extraOrderProduct);
            console.log('Extra product added:', response.data);

            const updatedOrders = await fetchOrderProductAndExtraProduct(orderItem.orderId);
            const transformedOrder = transformData(updatedOrders.data);

            setOrders(prevOrders => prevOrders.map(order => {
                if (order.productId === mainProductId) {
                    return {
                        ...transformedOrder,
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
    
                await updateOrderStatus(orderUpdate);
            }
            clearCart();
            navigate('/');
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    const handleRemoveExtraProduct = async (mainProductId, extraProductId, productName) => {
        try {
            const response = await deltedTheExtraProductFromMainProduct({
                orderId: extraProductId,
                productName: productName
            });
    
            if (response) {
                console.log('Extra product removed:', extraProductId);
    
                // Immediately update the state to remove the extra product from the specific order
                setOrders(prevOrders => prevOrders.map(order => {
                    if (order.productId === mainProductId) {
                        const updatedExtraProducts = order.extraProducts.filter(
                            extraProduct => extraProduct.orderId !== extraProductId
                        );
                        return {
                            ...order,
                            extraProducts: updatedExtraProducts
                        };
                    }
                    return order;
                }));
    
                // Optionally, re-fetch the specific order to ensure the latest state (if needed)
                const updatedOrderResponse = await fetchOrderProductAndExtraProduct(mainProductId);
                const transformedOrder = transformData(updatedOrderResponse.data);
    
                if (transformedOrder) {
                    setOrders(prevOrders => prevOrders.map(order =>
                        order.productId === mainProductId ? transformedOrder : order
                    ));
                }
    
            } else {
                console.error('Failed to remove extra product:', response.status);
            }
        } catch (error) {
            console.error('Error removing the extra product:', error);
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

    return (
        <>
            <Header />
            <div className="productPage-content">
                <Container>
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p>Error: {error.message}</p>
                    ) : orders.length === 0 ? (
                        <p>No orders available.</p>
                    ) : (
                        orders.map((order, orderIndex) => (
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
                                                    {Array.isArray(order.extraProducts) && order.extraProducts !== null && order.extraProducts.map((extraProduct, extraIndex) => {
            if (!extraProduct || !extraProduct.productName) {
                console.warn("Skipping invalid extra product:", extraProduct);
                return null; // Skip rendering this invalid product
            }
            return (
                <ExtraItemForMainProduct
                    key={extraIndex}
                    product={extraProduct}
                    onRemove={() => handleRemoveExtraProduct(order.productId, extraProduct.orderId, extraProduct.productName)}
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
                        ))
                    )}

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
