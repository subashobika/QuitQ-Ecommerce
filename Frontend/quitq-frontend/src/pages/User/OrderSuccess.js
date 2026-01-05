import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const order = location.state?.order;

  if (!order) {
    return (
      <div className="container mt-5 text-center">
        <h3>No order details available.</h3>
        <button className="btn btn-primary mt-3" onClick={() => navigate('/')}>
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <div className="card shadow p-4">
        <h2 className="text-success mb-3">Order Successful!</h2>
        <p>Thank you for your purchase.</p>
        <ul className="list-group mb-4">
          <li className="list-group-item"><strong>Order ID:</strong> {order.id}</li>
          <li className="list-group-item"><strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}</li>
          <li className="list-group-item"><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleString()}</li>
          <li className="list-group-item"><strong>Shipping Address:</strong> {order.shippingAddress}</li>
          <li className="list-group-item"><strong>Payment Method:</strong> {order.paymentMethod}</li>
        </ul>
        <button className="btn btn-primary" onClick={() => navigate('/orders')}>
          View All Orders
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
