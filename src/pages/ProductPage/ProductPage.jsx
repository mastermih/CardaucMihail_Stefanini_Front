import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Container from 'react-bootstrap/Container';
import { fetchProductPageById } from '../../components/dataService';
import { useParams } from 'react-router-dom';
import './ProductPage.css';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';



const ProductPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    const imagePath = image_path ? `/images/${image_path}` : '/images/placeholder.png';

    return (
        <>
            <Header />
            <div className="productPage-content">
                <Container>
                    <Row>
                        <Col md={20}>
                    <div className="row">
                        <div className="col-md-4 mb-4">
                            <div className="card">
                                <img className="card-img-top" src={imagePath}/>
                                <div className="card-body">
                                    <h5 className="card-text">{productName}</h5>
                                    <p className="card-text">Brand: {productBrand}</p>
                                    <p className="card-text">Description: {description}</p>
                                    <p className="card-text">Electricity Consumption: {electricityConsumption} kWh</p>
                                    <p className="card-text">Price: ${price.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    </Col>
                    </Row>
                </Container>
                    <Container>
                <Row>
                    <button type="button" class="btn btn-secondary btn-lg btn-block">Add to cart</button>
                </Row> 
                </Container>
            </div>
        </>
    );
};

export default ProductPage;
