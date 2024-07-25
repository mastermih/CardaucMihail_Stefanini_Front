import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Orders from './pages/Orders/Orders';
import Catalog from './pages/Catalog/Catalog';
import ProductPage from './pages/ProductPage/ProductPage';
import MakeOrder from './pages/MakeOrder/MakeOrder';




function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Va trebui sa fie scoasa*/}
          <Route path="/orders" element={<Orders />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/product/:id" element={<ProductPage/>} />
          <Route path="/MakeOrder/:id" element={<MakeOrder />} />

          </Routes>
      </div>
    </Router>
  );
}

export default App;
