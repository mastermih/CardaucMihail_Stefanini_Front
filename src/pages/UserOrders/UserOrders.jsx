import React, { useEffect, useState } from 'react';
import BasicTable from '../../components/BasicTable';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { fetchDataByDateIntervalUserRole, fetchOrdersByLastOnesUserRole, fetchNotificationsOfCustomerCreateOrder,notificationIsRead,notificationDisable } from '../../components/dataService';
import {jwtDecode} from 'jwt-decode'; 
import { useNavigate } from 'react-router-dom'; 
import { FaBell } from 'react-icons/fa';

const UserOrders = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [operatorID, setOperatorId] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const limit = 5; 
  const navigate = useNavigate();

  const getUserIdFromToken = () => {
    const token = localStorage.getItem('token'); 
    if (token) {
      const decodedToken = jwtDecode(token); 
      return decodedToken.id;
    }
    return null;
  };

  const getRoleFromToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      const roles = decodedToken.roles || [];
      return roles.includes('ADMIN') ? 'ADMIN' : 'USER';
    }
    return 'USER';
  };

  const role = getRoleFromToken();
  const userId = getUserIdFromToken();

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
        const flattenedData = result.data.map(order => ({
          id: order.id,
          user_id: order.user_id?.id || 'N/A', // Accessing nested 'user_id'
          created_date: order.created_date,
          updated_date: order.updated_date,
          order_status: order.order_status,
        }));
        
        setData(flattenedData); // Set the valid data
      } else {
        setData([]); 
      }

      setTotalPages(result.totalPages || 1);
      setCurrentPage(page);
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
    const fetchNotifications = async () => {
      try {
        const data = await fetchNotificationsOfCustomerCreateOrder(userId);
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [userId]);


  useEffect(() => {
    const userId = getUserIdFromToken();
  
    if (userId) {
      const interval = setInterval(async () => {
        const newNotifications = await fetchNotificationsOfCustomerCreateOrder(userId);
        setNotifications(newNotifications);
      }, 60000);
  
      return () => clearInterval(interval); 
    }
  }, [operatorID]);  


  const handleBellClick = async () => {
    try {
      if (userId) {
        console.log("Is read", userId)

        await notificationIsRead(userId);
        console.log("Is read", userId)

        const updatedNotifications = await fetchNotificationsOfCustomerCreateOrder(userId);
        
        console.log("Is read", userId)

        setNotifications(updatedNotifications);
      }
  
      setNotificationOpen(!isNotificationOpen);
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  const handleRemoveNotification = async (notificationId) => {
    try {
      await notificationDisable(notificationId, userId);
  
      const updatedNotifications = notifications.filter(notification => notification.notificationId !== notificationId);
      setNotifications(updatedNotifications);
    } catch (error) {
      console.error('Error disabling the notification:', error);
    }
  };
  


  useEffect(() => {
    handleFetchData();
  }, []);


  return (
    <>
      <Header />
      <div className="container">
        <h1>Orders</h1>

        {/* Controls Section */}
        <div className="controls d-flex justify-content-between align-items-center mb-4" style={{ gap: '20px' }}>
          <div style={{ display: 'flex', gap: '20px' }}>
            {/* Start Date Filter */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label htmlFor="startDate">Start Date:</label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{ width: '150px', padding: '6px' }}
              />
            </div>

            {/* End Date Filter */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label htmlFor="endDate">End Date:</label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{ width: '150px', padding: '6px' }}
              />
            </div>

            {/* Status Filter */}
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
              </select>
            </div>

            {/* Filter Button */}
            <button onClick={() => handleFetchData(1)} className="btn btn-primary" style={{ padding: '6px 12px' }}>
              Filter
            </button>
          </div>

          {/* Bell Icon for Notifications */}
          <div className="bell-container" style={{ position: 'relative' }}>
            <FaBell size={24} color="#36485a" onClick={handleBellClick} />
            {/* Notification Badge */}
            {notifications.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-5px',
                right: '-10px',
                backgroundColor: 'red',
                color: 'white',
                borderRadius: '50%',
                padding: '4px 7px',
                fontSize: '12px'
              }}>
                {notifications.length}
              </span>
            )}

            {/* Notification Dropdown */}
            {isNotificationOpen && (
  <div style={{
    position: 'absolute',
    top: '30px',
    right: '0',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '4px',
    width: '300px',
    padding: '10px',
    zIndex: 1000,
    maxHeight: '400px', 
    overflowY: 'auto'  
  }}>
    <h3>Notifications</h3>
    {notifications.length === 0 ? (
      <p>No notifications yet</p>
    ) : (
      <ul>
        {notifications.map((notification, index) => (
          <li key={index} style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
            {notification.message}
            <span style={{ fontSize: '12px', color: 'gray' }}>
                      {new Date(notification.createdDate).toLocaleDateString()} - {new Date(notification.createdDate).toLocaleTimeString()}
                    </span>
            <button
                        onClick={() => handleRemoveNotification(notification.notificationId)}
                        style={{
                background: 'none',
                border: 'none',
                color: 'red',
                marginLeft: '10px',
                cursor: 'pointer'
              }}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    )}
  </div>
)}

          </div>
        </div>

        {/* Table and pagination */}
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <BasicTable data={data} role={role} />
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
      <Footer />
    </>
  );
};

export default UserOrders;