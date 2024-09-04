import { error } from 'ajv/dist/vocabularies/applicator/dependencies';
import axios from 'axios';


export const fetchOrderProductAndExtraProduct = async (orderId) => {
  try {
    const response = await axios.get(`http://localhost:8080/MakeOrder/${orderId}`);
    const data = response.data;

    console.log('API Response:', data);

    // Ensure that orderProducts is an array
    if (!Array.isArray(data.orderProducts)) {
      throw new Error('Expected orderProducts to be an array, but received:', typeof data.orderProducts);
    }

    // Map through the orderProducts array and create an array of flattened data
    const flattenedData = data.orderProducts.map(product => ({
      orderId: data.orderId.id,  
      productName: product.product?.productName?.product_name || 'Unknown Product', // Access product name
      path: product.product?.path.path,
      quantity: product.quantity?.quantity || 0, 
      price: product.priceOrder?.price || 0, 
      productId: product.product?.productId?.id || 'Unknown Product ID',
      extraProductName: product.extraProductName || null,
      extraQuantity: product.extraQuantity || null, 
      extraPrice: product.extraPrice || null, 
      extraProductId: product.extraProductId || null,
      categoryType: product.product?.categoryType,
    }));

    console.log('Flattened data:', flattenedData);

    return { data: flattenedData };
  } catch (error) {
    console.error('Error fetching product data:', error);
    throw error;
  }
};


export const deltedTheExtraProductFromMainProduct = async (orderProduct) => {
  try {
      const response = await axios.delete("http://localhost:8080/MakeOrder/ProductOrder", {
          params: {
              id: orderProduct.orderId,  // This should be the correct order product ID
              product_name: orderProduct.productName // This should be the correct product name
          }
      });
      return response.data;
  } catch (error) {
      console.error("Error deleting the extra product:", error);
      throw error; // re-throw the error so the calling function can handle it
  }
};




export const fetchProductPageByProductName = async (productId = 42, name) => {
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

//Create user
export const createUser = async (user) => {
  try{
    console.log('Sending request to create user:', user);
    const response = await axios.post(`http://localhost:8080/createUser/Superior`, user);
    console.log('User created:', response.data);
    return response.data;
    }catch(error){
      console.error('Error creating user:', error);  
      throw error;
      }
};



export const postOrder = async (order) => {
  try {
    console.log('Sending request to create order:', order);
    const response = await axios.post(`http://localhost:8080/MakeOrder`, order);
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
          productName: item.productName.product_name,
          image_path: item.path.path,
          description: item.description.description,
          electricityConsumption: item.electricityConsumption.kWh,
          productBrand: item.productBrand.productBrand,
          price: item.price.price,
          categoryType: item.categoryType

      };
      console.log('Flattened data:', flattenedData);

      return { data: flattenedData };
  } catch (error) {
      console.error('Error fetching product data:', error);
      throw error;
  }
};
//Ma boy here
export const filterProducts = async (params) => {
  try {
    const response = await axios.get(`http://localhost:8080/catalog/catalog/filter`, {
      params,
    });

    // Ensure that response.data is an object with the correct structure
    const data = response.data;

    if (data && Array.isArray(data.items)) {
      const flattenedData = data.items.map((item) => ({
        id: item.productId.id,
        productName: item.productName.productName,
        image_path: item.path.path,
        description: item.description.description,
        electricityConsumption: item.electricityConsumption.kWh,
        productBrand: item.productBrand.productBrand,
        price: item.price.price,
      }));

      return { data: flattenedData, totalPages: data.totalPages || 1 };
    } else {
      throw new Error('Expected an array of items but received something else.');
    }
  } catch (error) {
    console.error('Error fetching product data:', error);
    throw error;
  }
};

//Treb de sters
export const filterProductByCategory = async (params) => {
  try {
    const response = await axios.get(`http://localhost:8080/catalog/catalog/categoryType`, {
      params // Pass the params directly
    });
    
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
    
    return { data: flattenedData, totalPages: 1 };
  } catch (error) {
    console.error('Error fetching product data:', error);
    throw error;
  }
};
//Treb de sters
export const filterProductByName = async (params) => {
  try {
    const response = await axios.get(`http://localhost:8080/catalog/catalog/name`, {
      params // Pass the params directly
    });
    
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
    
    return { data: flattenedData, totalPages: 1 };
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
      product_name: item.product.productName.product_name,
      quantity: item.quantity.quantity,
      price_product: item.priceOrder.price,
      parent: item.parent.id
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
      product_name: item.product.productName.product_name,
      quantity: item.quantity.quantity,
      price_product: item.priceOrder.price,
      parent: item.parent.id
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
