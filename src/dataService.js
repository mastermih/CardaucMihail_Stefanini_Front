import axios from 'axios';

const fetchData = async (createdDate, status, numberOfOrders, page) => {
  try {
    const response = await axios.get('http://localhost:8080/orders/status-createDate', {
      params: {
        createdDate,
        status,
        numberOfOrders,
        page
      }
    });

    // Log the raw response to ensure we are getting the data
    console.log('Raw response data:', response.data);

    // Transform the nested structure into a flat structure
    const flattenedData = response.data.items.map(item => ({
      id: item.orderId.id,
      user_id: item.userId.userId.id,
      created_date: item.createdDate.createDateTime,
      updated_date: item.updatedDate.updateDateTime,
      order_status: item.orderStatus,
    }));

    // Log the transformed data to verify
    console.log('Flattened data:', flattenedData);

    return flattenedData;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export default fetchData;
