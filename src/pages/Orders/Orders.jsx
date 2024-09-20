import React, { useEffect, useState } from 'react';
import BasicTable from '../../components/BasicTable';
import { fetchDataByDateAndStatus, fetchDataByDateInterval, fetchDataByLastOrders, assigneeOperatorToOrder } from '../../components/dataService'; 
import { useNavigate } from 'react-router-dom'; // For navigating to the home page

const Orders = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  // Function to handle role selection and assign the operator to the order
  const handleRoleSelection = async (orderId, role) => {
    if (!orderId) {
      console.error('Order ID is missing');
      return;
    }

    try {
      const response = await assigneeOperatorToOrder(role, orderId);
      console.log(`Assigned ${role} to order ${orderId}. Response:`, response);
    } catch (error) {
      console.error('Error assigning role:', error);
    }
  };

  const handleRedirectToHome = () => {
    navigate("/");
  };

  const handleFetchData = async (page = 1) => {
    console.log("Fetching data for page:", page); // Debugging
    setLoading(true);
    try {
      let result;
      if (selectedStatus) {
        console.log("Fetching with status:", selectedStatus); // Debugging
        result = await fetchDataByDateAndStatus(startDate, endDate, selectedStatus, 5, page); // Pass the correct page
      } else {
        console.log("Fetching by date interval"); // Debugging
        result = await fetchDataByDateInterval(startDate, endDate, 5, page); // Pass the correct page
      }
      
      if (result && result.data) {
        console.log("Data fetched:", result); // Check what data is returned
        setData(result.data); // Set fetched data
        setCurrentPage(result.currentPage || page); // Ensure currentPage is updated correctly
        setTotalPages(result.totalPages || 1); // Ensure totalPages is set
      }
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
      console.log('Last 5 orders fetched:', result);  // Debugging
      setData(result.data);
      setCurrentPage(result.currentPage || 1); // Ensure currentPage is a valid number
      setTotalPages(result.totalPages || 1); // Ensure totalPages is a valid number
    } catch (error) {
      console.error('Error fetching last 5 orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fix handlePageChange to prevent NaN and ensure a valid page is passed
  const handlePageChange = (newPage) => {
    if (!isNaN(newPage) && newPage >= 1 && newPage <= totalPages) {
      console.log("Changing to page:", newPage); // Debugging
      setCurrentPage(newPage); // Update the current page
      handleFetchData(newPage); // Fetch data for the new page
    } else {
      console.error("Invalid page number:", newPage); // If page is invalid
    }
  };

  return (
    <div className="container">
      <h1>Orders</h1>
      <button onClick={handleRedirectToHome} className="btn btn-link">← Back to Home</button>
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
          onClick={() => handleFetchData(1)}
          style={{
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '22px',
          }}
        >
          Filter
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <BasicTable data={data} handleRoleSelection={handleRoleSelection} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1} // Disable if on the first page
                style={{ marginRight: '10px' }}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages} // Disable if on the last page
                style={{ marginLeft: '10px' }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Orders;
