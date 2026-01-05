import React, { useEffect, useState } from 'react';
import orderService from '../../services/orderService';

const OrderManagementPage = () => {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const data = await orderService.getAllOrders();
      setOrders(data);
      setError('');
    } catch {
      setError('Failed to load orders');
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      fetchOrders();
    } catch {
      alert('Failed to update order status');
    }
  };

  return (
    <div className="container my-5">
      <h2 className="mb-5 text-center">Order Management</h2>
      {error && <div className="alert alert-danger text-center">{error}</div>}

      {loadingOrders ? (
        <p className="text-center">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-center">No orders found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th>Order ID</th>
                <th>User ID</th>
                <th>Status</th>
                <th>Total</th>
                <th style={{ minWidth: 140 }}>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.userId}</td>
                  <td>{order.status}</td>
                  <td>${order.totalAmount?.toFixed(2) ?? '0.00'}</td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      defaultValue={order.status}
                      onChange={e => handleUpdateOrderStatus(order.id, e.target.value)}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="PAID">Paid</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderManagementPage;
