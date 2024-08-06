import React, { useEffect, useState } from 'react';
import BasicTable from '../../components/BasicTable';
import { fetchDataByDateAndStatus, fetchDataByDateInterval, fetchDataByLastOrders } from '../../components/dataService';

const Orders = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const handlePageChange = async (newPage) => {
    setLoading(true);
    try {
      const result = await fetchDataByDateInterval(startDate, endDate, 5, newPage);
      setData(result.data);
      setTotalPages(result.totalPages);
      setCurrentPage(newPage);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

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
      setTotalPages(result.totalPages);
      setCurrentPage(1);
      console.log('Data received in handleFetchData:', result.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchDataByLastOrders();
  }, []);

  const handleFetchDataByLastOrders = async () => {
    setLoading(true);
    try {
      const result = await fetchDataByLastOrders(5);
      setData(result.data);
      setTotalPages(1); 
      setCurrentPage(1);
      console.log('Data received in handleFetchDataByLastOrders:', result.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
  };

  const handleDateChange = (setter) => (e) => {
    const value = e.target.value;
    setter(value);
  };

  return (
    <div className="container">
      <h1>Orders</h1>
      <div className="controls">
        <div className="form-group">
          <label>Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={handleDateChange(setStartDate, 0)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={handleDateChange(setEndDate, 0)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Status:</label>
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="form-control">
            <option value="">Select Status</option>
            <option value="CLOSED">Closed</option>
            <option value="OPEN">Open</option>
            <option value="PENDING">Pending</option>
          </select>
        </div>
        <button onClick={handleFetchData} className="btn btn-primary">Filter</button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <BasicTable data={data} columnsType="COLUMNS" />
          {totalPages > 1 && (
            <div className="pagination">
              <button className="btn btn-secondary" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button className="btn btn-secondary" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
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
