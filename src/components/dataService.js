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
//updateuser
export const updateUser = async(user) =>{
  try{
    const response = await axios.put(`http://localhost:8080/UserProfile`, user);
    console.log('User edited:', response.data);
    return response.data;
  }catch(error){
    console.error('Error editing the user:', error);
    throw error;
  }
}

export const getUserByToken = async (userToken) => {
  try {
    console.log('Fetching user details and image for userId:', userToken);

    const response = await axios.get(`http://localhost:8080/UserProfile${userToken}`);

    const item = response.data || {};
    const flattenedData = {
      id: item.userId.id,
      username: item.name.name,
      email: item.email.email,
      phone_number: item.phone_number,
      image: item.image, // Include image if available
      roles: item.roles || [],
    };

    return flattenedData;
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
};

export const getUser = async (userId) => {
  try {
    console.log('Fetching user details and image for userId:', userId);

    const response = await axios.get(`http://localhost:8080/UserProfile`, {
      params: { userId: userId }
    });

    const item = response.data || {};
    const flattenedData = {
      id: item.userId.id,
      username: item.name.name,
      email: item.email.email,
      phone_number: item.phone_number,
      image: item.image, // Include image if available
      roles: item.roles || [],
    };

    return flattenedData;
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
};





export const getUserImage = async (userId) => {
  try {
    console.log('Sending request to get userImage based on userID:', userId);

    const response = await axios.get('http://localhost:8080/uploadImage', {
      params: { userId: userId },
    });

    const relativeImagePath = response.data;
    console.log('Image path returned from backend:', relativeImagePath);

    const fullImageUrl = `http://localhost:8080/${relativeImagePath}`;
    console.log('Full image URL constructed:', fullImageUrl);

    return fullImageUrl;
  } catch (error) {
    console.error('Error fetching user image:', error);
    throw error;
  }
};

export const uploadImage = async (image, userId) => {
  try {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('userId', userId);

    console.log('Uploading image for userId:', userId);

    const response = await axios.post('http://localhost:8080/uploadImage', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    console.log('Image uploaded successfully:', response.data);
    return response.data;

  } catch (error) {
    console.error('Error uploading image:', error);
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

//Create user
export const createUserUnauthorized = async (user, verifyPassword) => {
  try{
    console.log('Sending request to create user:', user);
    const requestBody = {
      user: user,
      verifyPassword: verifyPassword
    };
    const response = await axios.post(`http://localhost:8080/createUser`, requestBody);
    console.log('User created:', response.data);
    return response.data;
    }catch(error){
      console.error('Error creating user:', error);  
      throw error;
      }
};

export const login = async (user) => {
  try {
    const response = await axios.post('http://localhost:8080/login', user); // Adjust the URL as needed
    return response;
  } catch (error) {
    console.error('Login request failed:', error);
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

export const confirmUserEmail = async (userId) => {
  try {
    console.log('Sending request to confirm email:', userId);

    // The request payload should be a JSON object
    const response = await axios.post(
      `http://localhost:8080/sendMail/confirm/user/${userId}`,
      { id: userId }, // Pass the ID in the request body as a JSON object
      {
        headers: {
          'Content-Type': 'application/json' // Set Content-Type to application/json
        }
      }
    );

    console.log('User confirmation response:', response.data); 
    return response.data;
  } catch (error) {
    console.error('Error confirming user:', error);
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

export const fetchOrdersByLastOnesUserRole = async (userId, limit) => {
  try {
    const response = await axios.get('http://localhost:8080/userOrders/UserLastCreated', {
      params: { id: userId, limit }
    });

    const items = response.data || []; // Ensure it's an array
    console.log('Response data:', items);

    // Flatten the data for each order returned
    const flattenedData = items.map(order => ({
      id: order.orderId.id,
      user_id: order.userId.userId.id,
      created_date: order.createdDate.createDateTime,
      updated_date: order.updatedDate.updateDateTime,
      order_status: order.orderStatus,
      operator: order.userId.email.email || 'N/A', // Use N/A if no email is found
    }));

    return { data: flattenedData, totalPages: 1 }; // Default to 1 page for now
  } catch (error) {
    console.error('Error fetching last created orders for user role:', error);
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
//This one was anly for role in the order table 
// export const assigneeOperatorToOrder = async (role, id) => {
//   try {
//     const response = await axios.put(`http://localhost:8080/orders/assignation`, null, {
//       params: { role, id }  // Passing both role and id as query parameters
//     });
//     console.log('Raw response data:', response.data);
//     return response.data;
//   } catch (error) {
//     console.error('Error assigning operator to order:', error);
//     throw error; // Rethrow the error to handle it elsewhere if necessary
//   }
// };


export const assigneeOperatorToOrder = async (orderId, role) => {
  try {
    const response = await axios.post(`http://localhost:8080/orders/assignation`, null, {
      params: { id: orderId, role }
    });
    console.log('Operator assigned to order:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error assigning operator to order:', error);
    throw error;
  }
};


export const getOperatorName  = async (name) => {
  try {
    const response = await axios.get('http://localhost:8080/orders/assignation', {
      params: { name }
    });
    console.log('Operator names fetched for role:', name, response.data);
    return response.data; // This should return a list of usernames.
  } catch (error) {
    console.error('Error fetching operator names:', error);
    throw error;
  }
};

export const setOperatorNameToOrder = async (orderId, name) => {
  try {
    const response = await axios.put(`http://localhost:8080/orders/assignation`, null, {
      params: { orderId, name }
    });
    return response.data;
  } catch (error) {
    console.error('Error setting operator to order:', error);
    return [];
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
      assigned_operator: item.assignedOperator
    }));
    console.log('Flattened data:', flattenedData);

    return { data: flattenedData, totalPages: response.data.totalPages };
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

//This have to be delted I think
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
      parent: item.parent.id,
      assigned_operator: item.assignedOperator

    }));

    console.log('Flattened data:', flattenedData);

    return { data: flattenedData, totalPages: response.data.totalPages };
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}; 

export const fetchDataByDateIntervalUserRole = async (id, startDate, endDate, numberOfOrders, page) => {
  try{
    const response = await axios.get('http://localhost:8080/userOrders/createDate', {
      params: {id, startDate, endDate, numberOfOrders, page}
    });
    console.log('Raw response data:', response.data);

    const items = response.data.items || [];

    const flattenedData = items.map(item => ({
      id: item.orderId.id,
      user_id: item.userId.userId.id,
      created_date: item.createdDate.createDateTime,
      updated_date: item.updatedDate.updateDateTime,
      order_status: item.orderStatus,
      assigned_operator: item.assignedOperator
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
      assigned_operator: item.assignedOperator
    }));

    console.log('Flattened data:', flattenedData);

    return { data: flattenedData, totalPages: response.data.totalPages };
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
