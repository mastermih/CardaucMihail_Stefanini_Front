import React, { useContext } from 'react';
import { CartContext } from '../../components/cartContext'; // Correct import path

const Cart = () => {
  const { cartItems, removeFromCart } = useContext(CartContext);

  return (
    <div>
      <h1>Shopping Cart</h1>
      <ul>
        {cartItems.map((item) => (
          <li key={item.id}>
            {item.productName} - ${item.price.toFixed(2)}
            <button onClick={() => removeFromCart(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Cart;
