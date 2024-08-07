// import React, { useEffect, useState } from 'react';
// import Header from '../../components/Header';
// import Container from 'react-bootstrap/Container';
// import { updateOrderStatus } from '../../components/dataService';
// import { useCart } from '../../components/cartContext';
// import { Row, Col } from 'react-bootstrap';
// import Footer from '../../components/Footer';
// import './MakeOrders.css';

// const MakeOrders = () => {
//   const { cartItems, removeFromCartAproved } = useCart();
//   const [quantity, setQuantity] = useState(1);
//   const [totalPrice, setTotalPrice] = useState('0.00');

//   useEffect(() => {
//     setTotalPrice(
//       (cartItems.reduce((total, product) => total + (product.price || 0), 0) * quantity).toFixed(2)
//     );
//   }, [cartItems, quantity]);

//   const ProductDetailsCard = ({ product }) => (
//     <div className="product-cardo">
//       {product.path && (
//         <img 
//           src={product.path} 
//           alt={product.productName} 
//           style={{ width: '50px', height: '50px' }} 
//         />
//       )}
//       <div className="product-details">
//         <h5>{product.productName || 'No name available'}</h5>
//         <p>{product.description || 'No description available'}</p>
//         <p>Price: ${product.price ? product.price.toFixed(2) : 'N/A'}</p>
//       </div>
//     </div>
//   );

//   const handleConfirmOrder = async () => {
//     for (const product of cartItems) {
//       const orderItem = cartItems.find(item => item.id === product.id);

//       if (!orderItem || !orderItem.orderId || orderItem.orderId === 0) {
//         console.error('Order ID is 0 or undefined, cannot update order status.');
//         continue;
//       }

//       const orderUpdate = {
//         orderId: { id: orderItem.orderId },
//         orderStatus: "NEW",
//         productId: product.id
//       };

//       try {
//         const result = await updateOrderStatus(orderUpdate);
//         console.log(result);
//         removeFromCartAproved(orderItem.orderId);
//         console.log('Order status updated:', orderUpdate);
//       } catch (error) {
//         console.error('Error updating order status:', error);
//       }
//     }
//   };

//   const handleQuantityChange = (e) => {
//     const value = parseInt(e.target.value, 10);
//     setQuantity(value);
//     setTotalPrice(
//       (cartItems.reduce((total, product) => total + (product.price || 0), 0) * value).toFixed(2)
//     );
//   };

//   if (!cartItems || cartItems.length === 0) return <p>No products found in cart.</p>;

//   return (
//     <>
//       <Header />
//       <div className="productPage-content">
//         <Container>
//           <Row>
//             {cartItems.map((product, index) => (
//               <Col key={index} md={5} className="mb-3">
//                 <h3 className="cardMakeOrder-text">{product.productName || 'No name available'}</h3>
//                 <div className="card">
//                   {product.image_path && (
//                     <img className="card-img-top" src={product.image_path} alt={product.productName} />
//                   )}
//                   <div className="card-body">
//                     <p className="card-text">Price: ${product.price ? product.price.toFixed(2) : 'N/A'}</p>
//                     <div className="form-group">
//                       <label htmlFor="quantity">Quantity:</label>
//                       <input
//                         type="number"
//                         className="form-control"
//                         id="quantity"
//                         value={quantity}
//                         onChange={handleQuantityChange}
//                         min="1"
//                       />
//                     </div>
//                     <p className="card-text">Total Price: ${(product.price ? product.price * quantity : 0).toFixed(2)}</p>
//                   </div>
//                 </div>
//               </Col>
//             ))}
//           </Row>

//           <Row>
//             <Col>
//               <p>Total Price: ${totalPrice}</p>
//               <button onClick={handleConfirmOrder} className="btn btn-primary mt-3">Confirm Order</button>
//             </Col>
//           </Row>
//         </Container>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default MakeOrders;
