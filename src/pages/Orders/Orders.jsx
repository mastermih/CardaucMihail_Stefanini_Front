import React, { useEffect, useState } from 'react';
import BasicTable from '../../components/BasicTable';
import { fetchDataByDateAndStatus, fetchDataByDateInterval, fetchDataByLastOrders, assigneeOperatorToOrder } from '../../components/dataService'; // Correct import

const Orders = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Function to handle role selection and assign the operator to the order
  const handleRoleSelection = async (orderId, role) => {
    if (!orderId) {
      console.error('Order ID is missing');
      return;
    }

    try {
      const response = await assigneeOperatorToOrder(role, orderId); // Ensure this function is correctly imported
      console.log(`Assigned ${role} to order ${orderId}. Response:`, response);
    } catch (error) {
      console.error('Error assigning role:', error);
    }
  };

  // Function to fetch filtered data based on date and status
  const handleFetchData = async () => {
    setLoading(true);
    try {
      let result;
      if (selectedStatus) {
        result = await fetchDataByDateAndStatus(startDate, endDate, selectedStatus, 5, 1);
      } else {
        result = await fetchDataByDateInterval(startDate, endDate, 5, 1);
      }
      setData(result.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch the last 5 orders
  useEffect(() => {
    handleFetchDataByLastOrders();
  }, []);

  const handleFetchDataByLastOrders = async () => {
    setLoading(true);
    try {
      const result = await fetchDataByLastOrders(5);
      setData(result.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Orders</h1>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="startDate">Start Date:</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ width: '150px', padding: '6px', marginRight: '10px' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="endDate">End Date:</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ width: '150px', padding: '6px', marginRight: '10px' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{ width: '150px', padding: '6px' }}
          >
            <option value="">Select Status</option>
            <option value="CLOSED">Closed</option>
            <option value="OPEN">Open</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
          </select>
        </div>

        <button
          onClick={handleFetchData}
          style={{
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '22px'
          }}
        >
          Filter
        </button>
      </div>

      {loading ? (
  <div>Loading...</div>
) : (
  <BasicTable data={data} handleRoleSelection={handleRoleSelection} />
)}

    </div>
  );
};

export default Orders;

