import React, { useEffect, useState, useContext } from 'react';
import Header from '../../components/Header';
import Container from 'react-bootstrap/Container';
import { fetchProductPageById, postOrder } from '../../components/dataService';
import { useParams } from 'react-router-dom';
import { CartContext } from '../../components/cartContext';
import Footer from '../../components/Footer';
import './ProductPage.css';

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const { data } = await fetchProductPageById(id);
        setProduct(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!product) return <p>No product found.</p>;

  const {
    productName,
    productBrand,
    description,
    electricityConsumption,
    image_path,
    price,
  } = product;

  const handleAddOrder = async () => {
    const order = {
        userId: { id:2 },
        productId: product.id,
        price: product.price,
        orderStatus: "INITIALISED"
    };
    try {
        const result  = await postOrder(order); 
        console.log('Order successfully created:', result );
        addToCart(product, result ); 
      } catch (error) {
        console.log('Error creating order', error);
      }
    }
  

  return (
    <>
      <Header />
      <div className="productPage-content">
        <Container>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card">
                <img className="card-img-top" src={`${image_path}`} alt={productName} />
                <div className="card-body">
                  <h5 className="card-text">{productName}</h5>
                  <p className="card-text">Brand: {productBrand}</p>
                  <p className="card-text">Description: {description}</p>
                  <p className="card-text">Electricity Consumption: {electricityConsumption} kWh</p>
                  <p className="card-text">Price: ${price.toFixed(2)}</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                    addToCart(product); 
                    handleAddOrder();}}>   
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <Footer/>
    </>
  );
};
export default ProductPage;
