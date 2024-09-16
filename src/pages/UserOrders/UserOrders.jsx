import React, { useEffect, useState } from 'react';
import BasicTable from '../../components/BasicTable';
import { fetchDataByDateIntervalUserRole } from '../../components/dataService'; // Updated import

const UserOrders = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const limit = 5; // For example, fetch 5 orders at a time
  const userId = 144; // Example user ID

  const handleButtonClick = (row) => {
    console.log('Button clicked for row:', row);
    // Implement your action here, e.g., open a modal, navigate to a page, etc.
  };

  const handleFetchData = async (page = 1) => {
    setLoading(true);
    try {
      const result = await fetchDataByDateIntervalUserRole(userId, startDate, endDate, limit, page); // Fetching data based on pagination and filters
      setData(result.data);
      setTotalPages(result.totalPages);
      setCurrentPage(page);
      console.log('Data received:', result);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      handleFetchData(newPage); // Fetch data for the new page
    }
  };

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
          <BasicTable data={data} columnsType="COLUMNS" handleButtonClick={handleButtonClick} />
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
