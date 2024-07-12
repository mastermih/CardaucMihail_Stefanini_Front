import axios from 'axios';

export const fetchLastDate = async () => {
  try {
    const response = await axios.get('http://localhost:8080/orders/lastCreatedDate');
    return response.data;
  } catch (error) {
    console.error('Error fetching last created date:', error);
    throw error;
  }
};

export const fetchData = async (createdDate, numberOfOrders, page) => {
  try {
    const response = await axios.get('http://localhost:8080/orders/createDate', {
      params: {
        createdDate,
        numberOfOrders,
        page
      }
    });

    console.log('Raw response data:', response.data);

    const flattenedData = response.data.items.map(item => ({
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
