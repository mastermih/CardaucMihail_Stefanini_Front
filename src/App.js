import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Orders from './pages/Orders/Orders';
import UserOrders from './pages/UserOrders/UserOrders';
import Catalog from './pages/Catalog/Catalog';
import ProductPage from './pages/ProductPage/ProductPage';
import MakeOrder from './pages/MakeOrder/MakeOrder';
import OrderProducts from './pages/OrderProducts/OrderProducts';
import ConfirmOrderEmail from './pages/ConfirmOrderEmail/ConfirmOrderEmail';
import ConfirmUserEmail from './pages/ConfirmUserEmail/ConfirmUserEmail';
import UserCreation from './pages/UserCreation/UserCreation';
import Registration from './pages/Registration/Registration';
import Login from './pages/Login/Login';
import UserProfile from './pages/UserProfile/UserProfile';


import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/userOrders/UserLastCreated" element={<UserOrders />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/MakeOrder" element={<MakeOrder />} />
          <Route path="/MakeOrder/:id" element={<MakeOrder />} />
          <Route path="/orderProduct" element={<OrderProducts />} />
          <Route path="/CreateUser/Superior" element={<UserCreation />} />
          <Route path="/CreateUser" element={<Registration />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/UserProfile/:id" element={<UserProfile />} />
          <Route path="/sendMail/confirm/:id" element={<ConfirmOrderEmail />} />
          <Route path="/sendMail/confirm/user/:id" element={<ConfirmUserEmail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
