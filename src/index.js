import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import App from './App';
import reportWebVitals from './reportWebVitals';
import { CartProvider } from './components/cartContext'; // Import CartProvider
import { setupInterceptors } from './axiosConfig';  // Import the Axios config to set up interceptors globally

// Import the Axios config to set up interceptors globally
import './axiosConfig';

setupInterceptors();  // Setup Axios interceptors globally

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 // <React.StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
 // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
