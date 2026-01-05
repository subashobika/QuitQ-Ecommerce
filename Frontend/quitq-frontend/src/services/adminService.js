import api from '../api/api'; 

const getAllUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

const deleteUser = async (id) => {
  await api.delete(`/admin/users/${id}`);
};

const getAllOrders = async () => {
  const response = await api.get('/admin/orders');
  return response.data;
};

const updateOrderStatus = async (id, status) => {
  const response = await api.put(`/admin/orders/${id}/status`, null, {
    params: { status },
  });
  return response.data;
};

const getDashboardStats = async () => {
  const response = await api.get('/admin/dashboard');
  return response.data;
};

export default {
  getAllUsers,
  deleteUser,
  getAllOrders,
  updateOrderStatus,
  getDashboardStats,
};
