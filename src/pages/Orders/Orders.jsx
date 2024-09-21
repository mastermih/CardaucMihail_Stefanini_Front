import React, { useEffect, useState } from 'react';
import BasicTable from '../../components/BasicTable';
import { fetchDataByDateAndStatus, fetchDataByDateInterval, fetchDataByLastOrders, assigneeOperatorToOrder, getOperatorNameByRole, setOperatorNameToOrder  } from '../../components/dataService'; 
import { useNavigate } from 'react-router-dom'; // For navigating to the home page

const Orders = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRoles, setSelectedRoles] = useState({});
  const [operators, setOperators] = useState({});
  const [operatorsName, setOperatorsNames] = useState({});
  const navigate = useNavigate();

  const handleRoleSelection = async (orderId, role) => {
    if (!orderId) {
      console.error('Order ID is missing');
      return;
    }
  
    try {
      const response = await assigneeOperatorToOrder(orderId, role);
      console.log(`Assigned ${role} to order ${orderId}. Response:`, response);
  
      let operatorNames = await getOperatorNameByRole(role);
      console.log('Fetched operator names:', operatorNames);

    
  
      // Update selected role and operators
      setSelectedRoles((prev) => ({ ...prev, [orderId]: role }));
      setOperators((prev) => ({ ...prev, [orderId]: operatorNames }));
  
      // Log the updated operators state
      console.log('Updated operators state:', operators);
    } catch (error) {
      console.error('Error assigning role or fetching operators:', error);
    }
  };
  
  

  const handleOperatorSelection = async (orderId, userName) => {
    if (!orderId || !userName) {
      console.error('Order ID or username is missing');
      return;
    }
  
    try {
      await setOperatorNameToOrder(userName, orderId);
  
      // Update the operator names state
      setOperatorsNames(prev => ({ ...prev, [orderId]: userName }));
  
      // Log the updated operator names to ensure the state is updated
      console.log(`Set operator ${userName} for order ${orderId}`);
      console.log('Updated operatorsName state:', operatorsName);
    } catch (error) {
      console.error('Error setting operator for order:', error);
    }
  };
  

  const handleRedirectToHome = () => {
    navigate("/");
  };

  const handleFetchData = async (page = 1) => {
    console.log("Fetching data for page:", page);
    setLoading(true);
    try {
      let result;
      if (selectedStatus) {
        console.log("Fetching with status:", selectedStatus); 
        result = await fetchDataByDateAndStatus(startDate, endDate, selectedStatus, 5, page); 
      } else {
        console.log("Fetching by date interval");
        result = await fetchDataByDateInterval(startDate, endDate, 5, page); 
      }
      
      if (result && result.data) {
        console.log("Data fetched:", result);
        setData(result.data);
        setCurrentPage(result.currentPage || page); 
        setTotalPages(result.totalPages || 1);
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
      console.log('Last 5 orders fetched:', result);
      setData(result.data);
      setCurrentPage(result.currentPage || 1); 
      setTotalPages(result.totalPages || 1);
    } catch (error) {
      console.error('Error fetching last 5 orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (!isNaN(newPage) && newPage >= 1 && newPage <= totalPages) {
      console.log("Changing to page:", newPage); 
      setCurrentPage(newPage);
      handleFetchData(newPage);
    } else {
      console.error("Invalid page number:", newPage);
    }
  };

  return (
    <div className="container">
      <h1>Orders</h1>
      <button onClick={handleRedirectToHome} className="btn btn-link"> Back to Home</button>
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
          <BasicTable 
            data={data} 
            handleRoleSelection={handleRoleSelection} 
            handleOperatorSelection={handleOperatorSelection} 
            operators={operators}
            operatorsName={operatorsName} 
          />

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