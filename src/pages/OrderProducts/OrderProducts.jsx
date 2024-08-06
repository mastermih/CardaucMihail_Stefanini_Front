import React, { useEffect, useState } from 'react';
import BasicTable from '../../components/BasicTable';
import { fetchDataByLastOrderProducts } from '../../components/dataService';

const OrderProducts = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const result = await fetchDataByLastOrderProducts(5);
        console.log('Data received:', result.data);
        setData(result.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container">
      <h1>OrderProducts</h1>
      <div className="controls">
        {/* Additional filters can be added here */}
      </div>
      <BasicTable data={data} columnsType="COLUMNS2" />
    </div>
  );
};

export default OrderProducts;
