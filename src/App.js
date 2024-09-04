import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Orders from './pages/Orders/Orders';
import Catalog from './pages/Catalog/Catalog';
import ProductPage from './pages/ProductPage/ProductPage';
import MakeOrder from './pages/MakeOrder/MakeOrder';
import OrderProducts from './pages/OrderProducts/OrderProducts';
import ConfirmOrderEmail from './pages/ConfirmOrderEmail/ConfirmOrderEmail';
import UserCreation from './pages/UserCreation/UserCreation';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/MakeOrder" element={<MakeOrder />} /> {/* Handles all cart items */}
          <Route path="/MakeOrder/:id" element={<MakeOrder />} /> {/* Handles a specific cart item */}
          <Route path="/orderProduct" element={<OrderProducts />} />
          <Route path="/CreateUser/Superior" element={<UserCreation />} />
          <Route path="/sendMail/confirm/:id" element={<ConfirmOrderEmail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
