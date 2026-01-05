import api from '../api/api'; 

const getProducts = async () => {
  const response = await api.get('/seller/products');
  return response.data;
};

const addProduct = async (product) => {
  
  const response = await api.post('/seller/products', product);
  return response.data;
};

const updateProduct = async (id, product) => {
 
  const response = await api.put(`/seller/products/${id}`, product);
  return response.data;
};

const deleteProduct = async (id) => {
  try {
    await api.delete(`/seller/products/${id}`);
  } catch (error) {
    throw error;
  }
};



const getDashboard = async () => {
  const response = await api.get('/seller/dashboard');
  return response.data;
};



const getOrders = async () => {
  const response = await api.get('/seller/orders');
  return response.data;
};


const updateOrderStatus = async (orderId, status) => {
  const response = await api.put(`/seller/orders/${orderId}/status`, null, {
    params: { status },
  });
  return response.data;
};



const getProfile = async () => {
  const response = await api.get('/seller/profile');
  return response.data;
};


const updateProfile = async (profileData) => {
  const response = await api.put('/seller/profile', profileData);
  return response.data;
};

const deleteProfile = async () => {
  const response = await api.delete('/seller/profile');
  return response.data;
};

export default {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getDashboard,
  getOrders,
  updateOrderStatus,
  getProfile,
  updateProfile,
  deleteProfile,
};
