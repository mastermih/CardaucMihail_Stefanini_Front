import axios from 'axios';


export const fetchProductPageById = async (productId) => {
  try {
      const response = await axios.get(`http://localhost:8080/catalog/product/${productId}`);
      console.log('Raw response data:', response.data);

      const item = response.data;

      const flattenedData = {
          id: item.productId.id,
          productName: item.productName.productName,
          image_path: item.path.path,
          description: item.description.description,
          electricityConsumption: item.electricityConsumption.kWh,
          productBrand: item.productBrand.productBrand,
          price: item.price.price,
      };
      console.log('Flattened data:', flattenedData);

      return { data: flattenedData };
  } catch (error) {
      console.error('Error fetching product data:', error);
      throw error;
  }
};

export const fetchProductByCategory = async (limit, categoryId) => {
  try{
    const response = await axios.get('http://localhost:8080/catalog/catalog', {
      params: {limit, categoryId}
    })
  console.log('Raw response data:', response.data);

  const items = response.data || [];
    const flattenedData = items.map(item => ({
      id: item.productId.id,
      productName: item.productName.productName,
      image_path: item.path.path, 
      description: item.description.description,
      electricityConsumption: item.electricityConsumption.kWh,
      productBrand: item.productBrand.productBrand,
      price: item.price.price,
    }));
    console.log('Flattened data:', flattenedData);

    return { data: flattenedData, totalPages: 1 };
  } catch (error) {
    console.error('Error fetching product data:', error);
    throw error;
  }
};
export const fetchDataByLastOrders = async (limit) => {
  try {
    const response = await axios.get('http://localhost:8080/orders/lastCreated', {
      params: { limit }
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
      params: { startDate, endDate, status, numberOfOrders, page }
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
      params: { startDate, endDate, numberOfOrders, page }
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
