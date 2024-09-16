import React, { useEffect, useState } from 'react';
import BasicTable from '../../components/BasicTable';
import { fetchDataByDateIntervalUserRole, fetchOrdersByLastOnesUserRole } from '../../components/dataService';
import {jwtDecode} from 'jwt-decode'; // Correct import

const UserOrders = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const limit = 5; // Number of orders to fetch per page

  // Function to extract the userId from the JWT token
  const getUserIdFromToken = () => {
    const token = localStorage.getItem('token'); // Get the JWT token from localStorage
    if (token) {
      const decodedToken = jwtDecode(token); // Decode the token
      return decodedToken.id; // Assuming 'id' is the claim that holds the user ID
    }
    return null;
  };

  const userId = getUserIdFromToken(); // Extract the userId from the token

  // Handle button click for actions on each row
  const handleButtonClick = (row) => {
    console.log('Button clicked for row:', row);
    // Implement your action here, e.g., open a modal, navigate to a page, etc.
  };

  // Function to fetch data (either by filters or by default)
  const handleFetchData = async (page = 1) => {
    setLoading(true);
    try {
      let result;

      // If no filters (date or status) are applied, fetch the last 5 orders
      if (!startDate && !endDate && !selectedStatus) {
        result = await fetchOrdersByLastOnesUserRole(userId, limit); // Fetch the last 5 orders for the user
      } else {
        // Fetch orders based on the selected filters (if applied)
        result = await fetchDataByDateIntervalUserRole(userId, startDate, endDate, limit, page);
      }

      // Set the fetched data and pagination
      if (result && Array.isArray(result.data)) {
        setData(result.data); // Set the valid data
      } else {
        setData([]); // Fallback to empty array if data is not as expected
      }

      setTotalPages(result.totalPages || 1);
      setCurrentPage(page);
      console.log('Data received:', result);
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]); // Ensure data is always an array
    } finally {
      setLoading(false);
    }
  };

  // Handle page change for pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      handleFetchData(newPage); // Fetch data for the new page
    }
  };

  // On component mount, fetch initial data (last 5 orders by default)
  useEffect(() => {
    handleFetchData(); // Fetch initial data on component mount
  }, []); // Empty dependency array ensures it runs only on mount

  return (
    <div className="container">
      <h1>Orders</h1>
      <div className="controls">
        <div className="form-group">
          <label>Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Status:</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="form-control"
          >
            <option value="">Select Status</option>
            <option value="CLOSED">Closed</option>
            <option value="OPEN">Open</option>
            <option value="PENDING">Pending</option>
          </select>
        </div>
        <button onClick={() => handleFetchData(1)} className="btn btn-primary">Filter</button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <BasicTable data={data || []} columnsType="COLUMNS" handleButtonClick={handleButtonClick} />
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn btn-secondary"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button
                className="btn btn-secondary"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
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

export default UserOrders;
