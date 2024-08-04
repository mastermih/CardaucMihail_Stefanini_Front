import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Container from 'react-bootstrap/Container';
import { fetchProductByCategory } from '../../components/dataService';
import Row from 'react-bootstrap/Row';
import { Link } from 'react-router-dom';
import './Catalog.css';
import Col from 'react-bootstrap/Col';
import Footer from '../../components/Footer';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [price, setPrice] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { data } = await fetchProductByCategory(5, "Elevator");
        setProducts(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <Header />
      <div className="catalog-content">
        <Container>
          <Row>
            <Col md={9}>
              <div className="row">
                {products.map(product => {

                  const price = product.price && typeof product.price === 'number' ? product.price : 0;
                  const productBrand = product.productBrand && typeof product.productBrand === 'string' ? product.productBrand : 'No brand available';
                  const productName = product.productName && typeof product.productName === 'string' ? product.productName : 'No name available';
                  const electricityConsumption = product.electricityConsumption && typeof product.electricityConsumption === 'number' ? product.electricityConsumption : 0;
                  const imagePath = product.image_path && typeof product.image_path === 'string' ? product.image_path : '';

                  //debug
                  console.log('imagePath:', imagePath);

                  return (
                    <div key={product.id} className="col-md-4 mb-4">
                      <div className="card">
                        <img className="card-img-top" src={imagePath} />
                        <div className="card-body">
                          <h5 className="card-text">{productName}</h5>
                          <p className='card-text'>Brand: {productBrand}</p>
                          <p className="card-text">Electricity Consumption: {electricityConsumption}kWh</p>
                          <p className="card-text">Price: ${price.toFixed(2)}</p>
                          <Link to={`/product/${product.id}`} className="btn btn-primary">View Details</Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Col>
            <Col md={3}>
              <div className="search-filter">
                <div className="search-bar custom-margin">
                  <select className="form-control" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    <option value="" disabled selected hidden>Select Category ...</option>
                    <option value="">HESOYAM</option>
                    <option value="">JUMBJET</option>
                    <option value="">AEZAKMY</option>
                  </select>
                </div>
                <div className="search-bar custom-margin">
                  <input type="text" placeholder="Name" className="form-control" />
                </div>
                <div className="search-bar custom-margin">
                  <input type="text" placeholder="Brand" className="form-control" />
                </div>
                <div className="price-bar custom-marginZ">
                  <select className="form-control" value={selectedPrice} onChange={(e) => setSelectedPrice(e.target.value)}>
                    <option value="" disabled selected hidden>Price (min/max)</option>
                    <option value="">MIN</option>
                    <option value="">MAX</option>
                  </select>
                </div>
                <div className="filter-options">
                </div>
              </div>
              <button type="button" class="btn btn-secondary">Submit</button>
            </Col>
          </Row>
        </Container>
      </div>
      <Footer/>
    </>
  );
};

export default Catalog;
