import React, { useEffect, useState } from 'react';
import BasicTable from '../../components/BasicTable';
import { fetchDataByDateIntervalUserRole, fetchOrdersByLastOnesUserRole } from '../../components/dataService';
import { jwtDecode } from 'jwt-decode'; // Correct import
import { useNavigate } from 'react-router-dom'; // For navigating to the home page

const UserOrders = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const limit = 5; // Number of orders to fetch per page
  const navigate = useNavigate(); // Initialize the navigate function

  const getUserIdFromToken = () => {
    const token = localStorage.getItem('token'); 
    if (token) {
      const decodedToken = jwtDecode(token); 
      return decodedToken.id;
    }
    return null;
  };

  const userId = getUserIdFromToken();


  const handleButtonClick = (row) => {
    console.log('Button clicked for row:', row);
  };

  const handleFetchData = async (page = 1) => {
    setLoading(true);
    try {
      let result;

      if (!startDate && !endDate && !selectedStatus) {
        result = await fetchOrdersByLastOnesUserRole(userId, limit); 
      } else {
        result = await fetchDataByDateIntervalUserRole(userId, startDate, endDate, limit, page);
      }

      if (result && Array.isArray(result.data)) {
        setData(result.data); // Set the valid data
      } else {
        setData([]); 
      }

      setTotalPages(result.totalPages || 1);
      setCurrentPage(page);
      console.log('Data received:', result);
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      handleFetchData(newPage);
    }
  };

  useEffect(() => {
    handleFetchData();
  }, []);

  const handleRedirectToHome = () => {
    navigate('/'); 
  };

  return (
    <div className="container">
      <h1>Orders</h1>
      
      {/* Add a button to go back to the home page */}
      <button onClick={handleRedirectToHome} className="btn btn-link">← Back to Home</button>

      {/* Filter form */}
      <div className="controls d-flex justify-content-between align-items-center mb-4">
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
