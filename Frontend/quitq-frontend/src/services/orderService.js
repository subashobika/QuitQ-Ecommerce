// import api from '../api/api';

// const orderService = {
  
//   placeOrder: async (shippingAddressId) => {
//     const response = await api.post('/orders', null, {
//       params: { shippingAddressId },
//     });
//     return response.data;
//   },

  
//   getOrders: async () => {
//     const response = await api.get('/orders');
//     return response.data;
//   },

  
//   getOrderById: async (orderId) => {
//     const response = await api.get(`/orders/${orderId}`);
//     return response.data;
//   },

 
//   updateOrderStatus: async (orderId, status) => {
//     const response = await api.put(`/orders/${orderId}/status`, { status });
//     return response.data;
//   },

  
//   deleteOrder: async (orderId) => {
//     const response = await api.delete(`/orders/${orderId}`);
//     return response.data;
//   },
// };

// export default orderService;

import api from '../api/api';

const orderService = {

  placeOrder: async (shippingAddressId) => {
    const response = await api.post('/orders', null, {
      params: { shippingAddressId },
    });
    return response.data;
  },

  getOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },

  // ✅ FIXED: Correct admin API endpoint
  // Your backend URL will be: /api/orders/admin/all
  getAllOrders: async () => {
    const response = await api.get('/orders/admin/all');
    return response.data;
  },

  getOrderById: async (orderId) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  updateOrderStatus: async (orderId, status) => {
    const response = await api.put(`/orders/${orderId}/status`, { status });
    return response.data;
  },

  deleteOrder: async (orderId) => {
    const response = await api.delete(`/orders/${orderId}`);
    return response.data;
  },
};

export default orderService;
