import React, { useEffect, useState } from 'react';
import BasicTable from '../../components/BasicTable';
import { fetchOrderProductByPriceInterval, fetchDataByLastOrderProducts } from '../../components/dataService';

const Orders = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [startPrice, setStartPrice] = useState('');
  const [endPrice, setEndPrice] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);  // Default items per page
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

  // Fetch data for the current page
  const fetchPageData = async (page) => {
    console.log(`Fetching data for page: ${page}, startPrice: ${startPrice}, endPrice: ${endPrice}, itemsPerPage: ${itemsPerPage}`);
    setLoading(true);
    try {
        const result = await fetchOrderProductByPriceInterval(startPrice, endPrice, itemsPerPage, page);
        if (result && result.data) {
            setData(result.data);
            console.log("Backend Response:", result);  // Log the full response
            setTotalPages(result.totalPages || 1); // Ensure total pages are set
            setCurrentPage(result.currentPage || page); // Set current page
            console.log("Total Pages:", result.totalPages, "Current Page:", result.currentPage);
        } else {
            console.error('No data returned');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        setLoading(false);
    }
  };


  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
        fetchPageData(newPage);
    }
};

  return (
    <div className="container">
      <h1>OrderProduct</h1>
      <div className="controls">
        <div className="form-group">
          <label>Start Price:</label>
          <input
            type="number"
            value={startPrice}
            onChange={(e) => setStartPrice(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>End Price:</label>
          <input
            type="number"
            value={endPrice}
            onChange={(e) => setEndPrice(e.target.value)}
            className="form-control"
          />
        </div>
        <button onClick={() => fetchPageData(1)} className="btn btn-primary">Filter</button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <BasicTable data={data} columnsType="COLUMNS2" />
          {totalPages > 1 && (
            <div className="pagination">
              <button className="btn btn-secondary" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button className="btn btn-secondary" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages}>Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Orders;