import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Container from 'react-bootstrap/Container';
import { fetchProductByCategory, filterProducts } from '../../components/dataService';
import Row from 'react-bootstrap/Row';
import { Link } from 'react-router-dom';
import './Catalog.css';
import Col from 'react-bootstrap/Col';
import Footer from '../../components/Footer';
import Pagination from 'react-bootstrap/Pagination';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom'; 
import { setupInterceptors } from '../../axiosConfig'; // Import the interceptors

const Catalog = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [productName, setProductName] = useState('');
  const [productBrand, setProductBrand] = useState('');
  const [electricityConsumption, setElectricityConsumption] = useState('');
  const [selectedPrice, setSelectedPrice] = useState({ min: '', max: '' });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const navigate = useNavigate();

  // Call interceptors with the navigate function
  useEffect(() => {
    setupInterceptors(navigate);
  }, [navigate]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const result = await fetchProductByCategory(pageSize, "Elevator");
        setProducts(result.data);
        setCurrentPage(1);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [pageSize]);

  const handleBigFilter = async (page = 1) => {
    setLoading(true);
    try {
      let params = {
        page: page,
        pageSize: pageSize,
        category_type: selectedCategory,
        product_name: productName,
        product_brand: productBrand,
        minPrice: selectedPrice.min,
        maxPrice: selectedPrice.max,
        electricity_consumption: electricityConsumption,
      };
      params = Object.fromEntries(Object.entries(params).filter(([key, value]) => value));

      const result = await filterProducts(params);

      setProducts(result.data);
      setTotalPages(result.totalPages || 1);  // Use the totalPages from the API response
      setCurrentPage(page);
    } catch (error) {
      console.error('Error filtering products:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      await handleBigFilter(newPage);
      setCurrentPage(newPage);
    }
  };

  const handleRefresh = () => {
    setSelectedCategory('');
    setProductName('');
    setProductBrand('');
    setElectricityConsumption('');
    setSelectedPrice({ min: '', max: '' });
    handleBigFilter(1);
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
                  const productName = product.productName && typeof product.productName === 'string' ? product.productName : 'No name available';
                  const productBrand = product.productBrand && typeof product.productBrand === 'string' ? product.productBrand : 'No brand available';
                  const electricityConsumption = product.electricityConsumption && typeof product.electricityConsumption === 'number' ? product.electricityConsumption : 0;
                  const imagePath = product.image_path && typeof product.image_path === 'string' ? product.image_path : '';

                  return (
                    <div key={product.id} className="col-md-4 mb-4">
                      <div className="card">
                        <img className="card-img-top" src={imagePath} alt={productName} />
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
                <div className="search-bar-custom-margin1">
                  <select className="form-control" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    <option value="" disabled>Select Category ...</option>
                    <option value="Elevator">Elevator</option>
                    <option value="AirSystem">Air System</option>
                    <option value="EmergensySystem">Emergency System</option>
                  </select>
                </div>
                <div className="search-bar-custom-margin2">
                  <input 
                    type="text" 
                    placeholder="Name" 
                    className="form-control" 
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)} 
                  />
                </div>
                <div className="search-bar-custom-margin3">
                  <input 
                    type="text" 
                    placeholder="Brand" 
                    className="form-control" 
                    value={productBrand}
                    onChange={(e) => setProductBrand(e.target.value)} 
                  />
                </div>
                <div className="search-bar-custom-margin4">
                  <input 
                    type="text" 
                    placeholder="Electricity Consumption" 
                    className="form-control" 
                    value={electricityConsumption}
                    onChange={(e) => setElectricityConsumption(e.target.value)} 
                  />
                </div>
                <div className="price-bar-custom-margin5">
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
                <Button type="button" className="btn btn-secondary mt-3" onClick={() => handleBigFilter(1)}>Submit</Button>
                <Button type="button" className="btn btn-secondary mt-3" onClick={handleRefresh}>Refresh</Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      {totalPages > 1 && (
        <div className="pagination-controls mt-4 d-flex justify-content-between" style={{ padding: '20px 0', textAlign: 'center' }}>
          <Pagination>
            <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
            <Form.Control
              type="number"
              value={currentPage}
              onChange={(e) => handlePageChange(Number(e.target.value))}
              style={{ width: '75px', display: 'inline-block', margin: '0 10px' }}
            />
            <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
          </Pagination>
        </div>
      )}
      <Footer />
    </>
  );
};

export default Catalog;
