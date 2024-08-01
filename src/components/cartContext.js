import React, { createContext, useState, useContext } from 'react';
import { updateOrderStatus } from './dataService'; // Ensure you import your updateOrderStatus function

export const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product, orderId) => {
    console.log(`Adding to cart: Product ID = ${product.id}, Order ID = ${orderId}`);
    setCartItems([...cartItems, { ...product, orderId }]);
  };

  const removeFromCart = async (orderId) => {
    console.log(`Removing from cart: Order ID = ${orderId}`);
    setCartItems(cartItems.filter(item => item.orderId !== orderId));

    const orderItem = cartItems.find(item => item.orderId === orderId);
    if (!orderItem) {
      console.log(`Order ID ${orderId} not found in cart.`);
      return;
    }

    const order = {
      orderId: { id: orderItem.orderId },
      orderStatus: "CANCELED",
      productId: orderItem.id 
    };

    try {
      const result = await updateOrderStatus(order);
      console.log('Order status updated:', result);
    } catch (error) {
      console.log('Error updating order status:', error);
    }
  };

  const removeFromCartAproved = async (orderId) => {
    console.log(`Removing from cart: Order ID = ${orderId}`);
    setCartItems(cartItems.filter(item => item.orderId !== orderId));

    const orderItem = cartItems.find(item => item.orderId === orderId);
    if (!orderItem) {
      console.log(`Order ID ${orderId} not found in cart.`);
      return;
    }

    const order = {
      orderId: { id: orderItem.orderId },
      orderStatus: "NEW",
      productId: orderItem.id 
    };

    try {
      const result = await updateOrderStatus(order);
      console.log('Order status updated:', result);
    } catch (error) {
      console.log('Error updating order status:', error);
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};