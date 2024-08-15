import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Container from 'react-bootstrap/Container';
import { fetchProductByCategory,filterProductByCategory, filterProductByName, filterProducts} from '../../components/dataService';
import Row from 'react-bootstrap/Row';
import { Link } from 'react-router-dom';
import './Catalog.css';
import { useParams } from 'react-router-dom';
import Col from 'react-bootstrap/Col';
import Footer from '../../components/Footer';
import axios from 'axios';

const Catalog = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [productName, setProductName] = useState('');
  const [productBrand, setProductBrand] = useState('');
  const [electricityConsumption, setElectricityConsumption] = useState('');
  const [selectedPrice, setSelectedPrice] = useState({ min: '', max: '' });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleFilterProductByCategory = async () => {
    try {
      const params = {
        category_type: selectedCategory
      };

      // Sending a GET request with query parameters
      const response = await filterProductByCategory(params); // Pass the params object
      setProducts(response.data);
      console.log("Filtered Products Response:", response.data);
    } catch (error) {
      console.error("Error filtering products:", error);
    }
  };

  const handleFilterProductByName = async () => {
    try {
      const params = {
        name: productName,
      };

      // Sending a GET request with query parameters
      const response = await filterProductByName(params); // Pass the params object
      setProducts(response.data);
      console.log("Filtered Products Response:", response.data);
    } catch (error) {
      console.error("Error filtering products:", error);
    }
  };
 ///WAAAAAAAAAAAAAAAAAAAAAAAAAAA
  const handleFilterProducts = async () => {
    try {
      let params = {};
  
      // Determine which filters have been applied
      if (selectedCategory) {
        params.category_type  = selectedCategory;
      }
      if (productName) {
        params.name = productName;
      }
      if (productBrand) {
        params.brand = productBrand;
      }
      if (selectedPrice.min || selectedPrice.max) {
        params.priceMin = selectedPrice.min || '';
        params.priceMax = selectedPrice.max || '';
      }
  
      // Call the appropriate filter function based on which parameters are present
      let response;
      if (params.category_type) {
        response = await filterProductByCategory(params);
      } else if (params.name) {
        response = await filterProductByName(params);
      } else {
        // Default case if no specific filters are applied (or add additional logic here)
        response = await fetchProductByCategory(); // Or another fallback function
      }
  
      // Set the products to the response data
      setProducts(response.data);
      console.log("Filtered Products Response:", response.data);
    } catch (error) {
      console.error("Error filtering products:", error);
    }
  };
  
  const haldleBigFilter = async () => {
    setLoading(true);
    try {
      let  params = {
        category_type: selectedCategory,
        product_name: productName,
        product_brand: productBrand,
        priceMin: selectedPrice.min,
        priceMax: selectedPrice.max,
        electricity_consumption: electricityConsumption, // Example value, update according to your UI
      };
      params = Object.fromEntries(Object.entries(params).filter(([key, value]) => value));

      const { data } = await filterProducts(params);
      setProducts(data);
    } catch (error) {
      console.error('Error filtering products:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };


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
                    <option value="" disabled>Select Category ...</option>
                    <option value="Elevator">Elevator</option>
                    <option value="AirSystem">Air System</option>
                    <option value="EmergensySystem">Emergency System</option>
                  </select>
                </div>
                <div className="search-bar custom-margin">
                  <input 
                    type="text" 
                    placeholder="Name" 
                    className="form-control" 
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)} 
                  />
                </div>
                <div className="search-bar custom-margin">
                  <input 
                    type="text" 
                    placeholder="Brand" 
                    className="form-control" 
                    value={productBrand}
                    onChange={(e) => setProductBrand(e.target.value)} 
                  />
                </div>
                <div className="price-bar custom-marginZ">
                  <input 
                    type="number" 
                    placeholder="Min Price" 
                    className="form-control" 
                    value={selectedPrice.min}
                    onChange={(e) => setSelectedPrice({ ...selectedPrice, min: e.target.value })} 
                  />
                  <input 
                    type="number" 
                    placeholder="Max Price" 
                    className="form-control mt-2" 
                    value={selectedPrice.max}
                    onChange={(e) => setSelectedPrice({ ...selectedPrice, max: e.target.value })} 
                  />
                </div>
                <button type="button" className="btn btn-secondary mt-3" onClick={haldleBigFilter}>Submit</button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default Catalog;