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
    quantity,
    categoryType,
  } = product;

  const handleAddOrder = async () => {
    try {
      const orderWithProductsDTO = {
        order: {
          userId: { id: 2 },
          orderStatus: "INITIALISED",
          productId: product.id,
        },
        orderProducts: [
          {
            product: {
              productName: { product_name: product.productName },
              productId: { id: product.id }
            },
            quantity: { quantity: 1 },
            priceOrder: { price: product.price },
            parentProductId: { id: null }
          }
        ]
      };

      // Make the API call to create the order and products
      const response = await postOrder(orderWithProductsDTO);
      console.log("Order with Products API Response:", response);

      // Check if the response contains the orderId
      if (response && response.orderId) {
        const orderId = response.orderId;
        console.log("Created Order ID:", orderId);

        // Now add the product to the cart with the orderId
        addToCart(product, orderId);
      } else {
        console.error("Failed to get orderId from response or response format is incorrect");
      }

    } catch (error) {
      console.error("Error creating order with products:", error);
    }
  };

  return (
    <>
      <Header />
      <div className="productPage-content">
        <Container>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card">
                <img className="card-img-top" src={`${image_path}`} alt={productName} style={{ width: '350px', height: '400px', objectFit: 'cover' }} />
                <div className="card-body">
                  <h5 className="card-text">{productName}</h5>
                  <p className="card-text">Brand: {productBrand}</p>
                  <p className="card-text">Electricity Consumption: {electricityConsumption} kWh</p>
                  <p className="card-text">Price: ${price.toFixed(2)}</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      handleAddOrder();
                    }}>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-8">
              <div className="cardZZZ">
                <div className="card-body-description">
                  <h5 className="card-title">Description</h5>
                  <p className="card-text">{description}</p>
                  <button
                    className="pricol-button"
                    onClick={() => {
                      handleAddOrder();
                    }}>
                      Add to Cart :/
                  </button>
                  <p className="pacanele-mici">The final price is going to include extra expenses like delivery and installation 
                  (you can get a discount if you have the premium version). </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default ProductPage;
