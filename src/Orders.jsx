import React, { useEffect, useState } from 'react';
import BasicTable from './BasicTable';
import fetchData from './dataService';

const Orders = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchData('2024-07-01T14:30:50', 'CLOSED', 5, 2);
        console.log('Fetched and Flattened data:', result);  // Log the fetched data
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Orders</h1>
      <BasicTable data={data} />
    </div>
  );
};

export default Orders;
