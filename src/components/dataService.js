import { error } from 'ajv/dist/vocabularies/applicator/dependencies';
import axios from 'axios';

export const fetchProductPageByProductName = async (productId, name) => {
  try {
    const response = await axios.get(`http://localhost:8080/catalog/MakeOrder/${productId}`, {
      params: { product_name: name }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching product by name:', error);
    throw error;
  }
};

export const updateOrderStatus = async(order) =>{
  try{
    const response = await axios.put(`http://localhost:8080/MakeOrder/${order.productId}`, order);
    console.log('Order created:', response.data);
    return response.data;
  }catch(error){
    console.error('Error posting order:', error);
    throw error;
  }
}

export const postOrderProduct = async (orderProduct) => {
  try {
    console.log('Sending request to create orderProduct:', orderProduct);
    const response = await axios.post('http://localhost:8080/MakeOrder/ProductOrder', orderProduct, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('OrderProduct created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating orderProduct:', error);
    throw error;
  }
};

export const postOrder = async (order) => {
  try {
    console.log('Sending request to create order:', order);
    const response = await axios.post(`http://localhost:8080/MakeOrder/${order.productId}`, order);
    console.log('Order created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const confirmOrderEmail = async (orderId) => {
  try {
    console.log('Sending request to confirm email:', orderId);

    // The request payload should be a JSON object
    const response = await axios.post(
      `http://localhost:8080/sendMail/confirm/${orderId}`,
      { id: orderId }, // Pass the ID in the request body as a JSON object
      {
        headers: {
          'Content-Type': 'application/json' // Set Content-Type to application/json
        }
      }
    );

    console.log('Order confirmation response:', response.data); 
    return response.data;
  } catch (error) {
    console.error('Error confirming order:', error);
    throw error; 
  }
};

export const sendOrderEmail = async (emailDetails) => {
  try{
    console.log('Sending request to confirm order:', emailDetails);
    const response = await axios.post(`http://localhost:8080/sendMail/OrderId`, emailDetails);
    console.log('Order confirmed:', response.data); 
    return response.date;
  }catch (error){
    console.error('Error confirming order:', error);
    throw error;
  }
}

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

export const fetchProductByCategory = async (limit, categoryType) => {
  try{
    const response = await axios.get('http://localhost:8080/catalog/catalog', {
      params: {limit, categoryType}
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

export const fetchDataByLastOrderProducts = async(limit) => {
  try {
    const response = await axios.get('http://localhost:8080/orderProduct', {
      params: { limit }
    });
    console.log('Raw response data:', response.data);

    const items = response.data || [];
    const flattenedData = items.map(item => ({
      id: item.order.orderId.id,
      product_id: item.product.productId.id,
      quantity: item.quantity.quantity,
      price_product: item.priceOrder.price,
    }));
    console.log('Flattened data:', flattenedData);

    return { data: flattenedData, totalPages: 1 };
  } catch (error) {
    console.error('Error fetching data:', error);
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

export const fetchOrderProductByPriceInterval = async (startPrice, endPrice, totalOrderProducts, page) => {
  try{
    const response = await axios.get('http://localhost:8080/orderProduct/price', {
      params: { startPrice, endPrice, page, totalOrderProducts }
    });
    console.log('Raw response data:', response.data);
    const items = response.data.items || [];

    const flattenedData = items.map(item => ({
      id: item.order.orderId.id,
      product_id: item.product.productId.id,
      quantity: item.quantity.quantity,
      price_product: item.priceOrder.price,
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
