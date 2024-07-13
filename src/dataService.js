import axios from 'axios';

export const fetchDataByLastOrders = async (limit) => {
  try {
    const response = await axios.get('http://localhost:8080/orders/lastCreated', {
      params: {
        limit
      }
    });

    console.log('Raw response data:', response.data);

    const items = response.data || [];

    const flattenedData = items.map(item => ({
      id: item.orderId.id,
      user_id: item.userId.userId.id,
      created_date: item.createdDate.createDateTime,
      updated_date: item.updatedDate.updateDateTime,
      order_status: item.orderStatus,
    }));

    console.log('Flattened data:', flattenedData);

    return { data: flattenedData, totalPages: 1 };
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const fetchDataByDateAndStatus = async (startDate, endDate, status, numberOfOrders, page) => {
  try {
    const response = await axios.get('http://localhost:8080/orders/status-createDate', {
      params: {
        startDate,
        endDate,
        status,
        numberOfOrders,
        page
      }
    });
    console.log('Raw response data:', response.data);

    const items = response.data.items || [];

    const flattenedData = items.map(item => ({
      id: item.orderId.id,
      user_id: item.userId.userId.id,
      created_date: item.createdDate.createDateTime,
      updated_date: item.updatedDate.updateDateTime,
      order_status: item.orderStatus,
    }));
    console.log('Flattened data:', flattenedData);

    return { data: flattenedData, totalPages: response.data.totalPages };
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const fetchDataByDateInterval = async (startDate, endDate, numberOfOrders, page) => {
  try {
    const response = await axios.get('http://localhost:8080/orders/createDate', {
      params: {
        startDate,
        endDate,
        numberOfOrders,
        page
      }
    });

    console.log('Raw response data:', response.data);

    const items = response.data.items || [];

    const flattenedData = items.map(item => ({
      id: item.orderId.id,
      user_id: item.userId.userId.id,
      created_date: item.createdDate.createDateTime,
      updated_date: item.updatedDate.updateDateTime,
      order_status: item.orderStatus,
    }));

    console.log('Flattened data:', flattenedData);

    return { data: flattenedData, totalPages: response.data.totalPages };
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
