import React, { createContext, useState, useContext } from 'react';

export const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product, orderId) => {
    console.log(`Adding to cart: Product ID = ${product.id}, Order ID = ${orderId}`);
    setCartItems([...cartItems, { ...product, orderId }]);
  };

  const removeFromCart = (orderId) => {
    console.log(`Removing from cart: Order ID = ${orderId}`);
    setCartItems(cartItems.filter(item => item.orderId !== orderId));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
