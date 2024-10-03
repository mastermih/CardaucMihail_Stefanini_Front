import React, { useEffect, useState, useRef,useCallback  } from 'react';
import BasicTable from '../../components/BasicTable';
import {jwtDecode} from 'jwt-decode';
import SidebarManagement from '../../components/SidebarManagement';
import {
  fetchDataByDateAndStatus,
  fetchDataByDateInterval,
  fetchDataByLastOrders,
  assignOperatorToOrder,
  getOperatorName,
  deleteOperatorFromTheOrder,
  deleteAllOperatorsFromTheOrder,
  assineOperatorToMe
} from '../../components/dataService';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';

const Orders = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [operatorID, setOperatorId] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  const handleRedirectToHome = () => {
    navigate('/');
  };
  const getRoleFromToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      const roles = decodedToken.roles || [];
      if (roles.includes('ADMIN')){
        return 'ADMIN';
      }else if (roles.includes('MANAGER')){
        return 'MANAGER';
      }else if (roles.includes('SALESMAN')){
        return 'SALESMAN'
      }
      return 'USER';
    }
    return 'USER';
  };

  const role = getRoleFromToken();
  console.log('User role: ', role);
  useEffect(() => {
    const userId = getUserIdFromToken();
    if (userId) {
      handleFetchDataByLastOrders();
    }
  }, []);
  const getUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id || decodedToken.userId; 
    setOperatorId(userId);
    return userId;
  };
  const handleFetchData = async (page = 1) => {
    setLoading(true);
    try {
      let result;
      console.log('Selected Status:', selectedStatus);
      console.log('Start Date:', startDate);
      console.log('End Date:', endDate);
  
      // Ensure all conditions are correctly handled
      if (selectedStatus && startDate && endDate) {
        result = await fetchDataByDateAndStatus(startDate, endDate, selectedStatus, 5, page);
      } else if (startDate && endDate) {
        result = await fetchDataByDateInterval(startDate, endDate, 5, page);
      } else {
        result = await fetchDataByLastOrders(5, page);
      }
  
      // Set the fetched data correctly
      if (result && result.data) {
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
  
  
  

  useEffect(() => {
    handleFetchDataByLastOrders();
  }, []);

  const handleFetchDataByLastOrders = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchDataByLastOrders(5);
      setData(result.data);
      setCurrentPage(result.currentPage || 1);
      setTotalPages(result.totalPages || 1);
    } catch (error) {
      console.error('Error fetching last 5 orders:', error);
    } finally {
      setLoading(false);
    }
  }, []);
  

  const handlePageChange = (newPage) => {
    if (!isNaN(newPage) && newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      handleFetchData(newPage);
    } else {
      console.error('Invalid page number:', newPage);
    }
  };
  const handleDeleteOperatorFromTheOrder = async (orderId, operatorName) => {
    try {
        const order = data.find(orderItem => orderItem.id === orderId);

        console.log('Order found:', order);

        if (!order) {
            console.error('Order not found for orderId:', orderId);
            return;
        }

        if (!order.operatorUserIds || order.operatorUserIds === "N/A" || !order.userName) {
            console.error('Valid OperatorUserId or userName is missing for this order:', order);
            return;
        }

        const operatorIds = order.operatorUserIds.split(', ');
        const operatorNames = order.userName.split(', ');

        const operatorIndex = operatorNames.indexOf(operatorName);

        const operatorId = operatorIds[operatorIndex];

        if (!operatorId) {
            console.error('Operator ID not found for', operatorName);
            return;
        }
        
    

        console.log('Order ID:', orderId);
        console.log('Operator Name:', operatorName);
        console.log('Operator ID:', operatorId);

        const response = await deleteOperatorFromTheOrder(orderId, operatorId);
        console.log('Operator deleted successfully:', response);

    } catch (error) {
        console.error('Error deleting operator:', error);
    }
};


const handleDeleteAllOperatorsFromTheOrder = async (orderId) => {
  try {
    const response = await deleteAllOperatorsFromTheOrder(orderId);
    console.log('Operators deleted successfully:', response);
    let allOrdersData;
    if (selectedStatus && (startDate || endDate)) {
      allOrdersData = await fetchDataByDateAndStatus(startDate, endDate, selectedStatus, 5, currentPage);
    } else if (startDate && endDate) {
      allOrdersData = await fetchDataByDateInterval(startDate, endDate, 5, currentPage);
    } else {
      allOrdersData = await fetchDataByLastOrders(5, currentPage);
    }
    const updatedOrder = allOrdersData.data.find(order => order.id === orderId);
    if (!updatedOrder) {
      throw new Error(`Order with ID ${orderId} not found in the fetched data`);
    }
    setData(prevData => 
      prevData.map(order => order.id === orderId ? updatedOrder : order)
    );

    console.log(`Updated order: ${JSON.stringify(updatedOrder)}`);
  } catch (error) {
    console.error('Error deleting operators or fetching updated orders:', error);
  }
};

const handleOperatorSelection = (orderId, operatorName) => {
  assignOperatorToOrder(orderId, operatorName)
    .then(() => {
      if (selectedStatus && (startDate || endDate)) {
        return fetchDataByDateAndStatus(startDate, endDate, selectedStatus, 5, currentPage);
      } else if (startDate && endDate) {
        return fetchDataByDateInterval(startDate, endDate, 5, currentPage);
      } else {
        return fetchDataByLastOrders(5, currentPage); 
      }
    })
    .then((allOrdersData) => {
      const updatedOrder = allOrdersData.find(order => order.id === orderId);
      
      setData(prevData => 
        prevData.map(order => order.id === orderId ? updatedOrder : order)
      );
            console.log(`Updated order: ${updatedOrder}`);
    })
    .catch(error => {
      console.error('Error assigning operator:', error);
    });
};


const handleAddMeAsOperatorToOrder = (orderId) => {
  if (!operatorID) {
    console.error("Operator ID is undefined. Please check the token or user ID.");
    return;
  }

  console.log(`Set me ${operatorID} for order ${orderId}`);

  assineOperatorToMe(orderId, operatorID)
    .then(response => {
      console.log('Operator assigned successfully:', response);

      if (selectedStatus && (startDate || endDate)) {
        return fetchDataByDateAndStatus(startDate, endDate, selectedStatus, 5, currentPage);
      } else if (startDate && endDate) {
        return fetchDataByDateInterval(startDate, endDate, 5, currentPage);
      } else {
        return fetchDataByLastOrders(5, currentPage);
      }
    })
    .then((allOrdersData) => {
      const updatedOrder = allOrdersData.data.find(order => order.id === orderId);

      if (!updatedOrder) {
        throw new Error(`Order with ID ${orderId} not found in the fetched data`);
      }
      setData(prevData => 
        prevData.map(order => order.id === orderId ? updatedOrder : order)
      );

      console.log(`Updated order: ${JSON.stringify(updatedOrder)}`);
    })
    .catch(error => {
      console.error('Error assigning operator or fetching updated orders:', error);
    });
};

  
return (
  <div style={{ display: 'flex' }}>
    <SidebarManagement /> 
    <div className="container" style={{ marginLeft: '10px', padding: '20px', flexGrow: 1 }}>
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
            data={data || []}
            role={role}
            operatorID={operatorID}
            handleOperatorSelection={handleOperatorSelection}
            getOperatorName={getOperatorName}
            handleDeleteOperatorFromTheOrder={handleDeleteOperatorFromTheOrder}
            handleDeleteAllOperatorsFromTheOrder={handleDeleteAllOperatorsFromTheOrder}
            handleAddMeAsOperatorToOrder={handleAddMeAsOperatorToOrder}
          />

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{ marginRight: '10px' }}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{ marginLeft: '10px' }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  </div>
);
};

export default Orders;