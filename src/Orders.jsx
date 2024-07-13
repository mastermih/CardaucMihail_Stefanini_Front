import React, { useEffect, useState } from 'react';
import BasicTable from './BasicTable';
import { fetchDataByDateAndStatus, fetchDataByDateInterval, fetchDataByLastOrders } from './dataService';

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

  const formatDateTimeInput = (date, setSecondsTo) => {
    if (!date) return '';
    const d = new Date(date);
    d.setSeconds(setSecondsTo);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
  };

  const handleDateChange = (setter, setSecondsTo) => (e) => {
    const value = e.target.value;
    const formattedValue = formatDateTimeInput(value, setSecondsTo);
    setter(formattedValue);
  };

  return (
    <div className="container">
      <h1>Orders</h1>
      <div className="controls">
        <label>
          Start Date:
          <input
            type="datetime-local"
            value={formatDateTimeInput(startDate, 59)}
            onChange={handleDateChange(setStartDate, 59)}
          />
        </label>
        <label>
          End Date:
          <input
            type="datetime-local"
            value={formatDateTimeInput(endDate, 59)}
            onChange={handleDateChange(setEndDate, 59)}
          />
        </label>
        <label>
          Status:
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
            <option value="">Select Status</option>
            <option value="CLOSED">Closed</option>
            <option value="OPEN">Open</option>
            <option value="PENDING">Pending</option>
          </select>
        </label>
        <button onClick={handleFetchData}>Filter</button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <BasicTable data={data} />
          {totalPages > 1 && (
            <div className="pagination">
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
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
