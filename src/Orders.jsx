import React, { useEffect, useState } from 'react';
import BasicTable from './BasicTable';
import { fetchLastDate, fetchData, fetchDataByDateAndStatus } from './dataService';

const Orders = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const handlePageChange = async (newPage) => {//cind alegi pag
    setLoading(true);
    try {
      const result = await fetchData(selectedDate, 5, newPage);
      setData(result.data);
      setTotalPages(result.totalPages);
      setCurrentPage(newPage);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleFetchDataByDateAndStatus = async () => {
    setLoading(true);
    try{
        const result = await fetchDataByDateAndStatus(selectedDate, selectedStatus, 5, 1);
        setData(result.data);
        setTotalPages(result.totalPages);
        setCurrentPage(1);
    } catch (error) {
        console.error('Error fetching data by date and status:', error);
      } finally {
        setLoading(false);
      }
    };

  const handleFetchData = async () => { // bazat pe Data
    setLoading(true);
    try {
      const result = await fetchData(selectedDate, 5, 1);
      setData(result.data);
      setTotalPages(result.totalPages);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getData = async () => {// din dataService prima pag
      try {
        const lastDate = await fetchLastDate();
        setSelectedDate(lastDate);
        const result = await fetchData(lastDate, 5, 1);
        setData(result.data);
        setTotalPages(result.totalPages);
        setCurrentPage(1);
      } catch (error) {
        console.error('Error initializing data:', error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  return (
    <div className="container">
      <h1>Orders</h1>
      <div className="controls">
        <label>
          Date:
          <input
            type="datetime-local"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </label>
        <label>
          Status:
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
            <option value="">Select Status</option>
            <option value="CLOSED">Closed</option>
            <option value="OPEN">Open</option>
            <option value="PENDING">Pending</option>
            {/* Add other statuses as needed */}
          </select>
        </label>
        <button onClick={handleFetchDataByDateAndStatus}>Click me</button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <BasicTable data={data} />
          <div className="pagination">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Orders;
