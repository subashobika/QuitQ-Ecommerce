import React, { useEffect, useState } from 'react';
import orderService from '../../services/orderService';

const getStatusBadge = (status) => {
  switch (status) {
    case "PAID":
      return (
        <span className="badge bg-warning text-dark fs-6">
          <i className="bi bi-currency-dollar"></i> Paid
        </span>
      );
    case "SHIPPED":
      return (
        <span className="badge bg-info text-dark fs-6">
          <i className="bi bi-truck"></i> Shipped
        </span>
      );
    case "DELIVERED":
      return (
        <span className="badge bg-success fs-6">
          <i className="bi bi-box2-heart"></i> Delivered
        </span>
      );
    default:
      return (
        <span className="badge bg-secondary fs-6">
          {status}
        </span>
      );
  }
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchId, setSearchId] = useState('');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const ordersList = await orderService.getOrders();
        setOrders(ordersList);
      } catch {
        setError('Failed to load orders.');
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const handleSearch = async () => {
    if (!searchId.trim()) {
     
      setSearching(false);
      setLoading(true);
      try {
        const ordersList = await orderService.getOrders();
        setOrders(ordersList);
      } catch {
        setError('Failed to load orders.');
      } finally {
        setLoading(false);
      }
      return;
    }

    setSearching(true);
    setLoading(true);
    try {
      const order = await orderService.getOrderById(searchId.trim());
      setOrders(order ? [order] : []);
    } catch {
      setError('Order not found.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container mt-5 text-center">Loading orders...</div>;
  if (error) return <div className="container mt-5 text-danger text-center">{error}</div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Your Orders</h2>

      <div className="input-group mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Enter Order ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
        {searching && (
          <button
            className="btn btn-secondary"
            onClick={() => {
              setSearchId('');
              handleSearch();
            }}
          >
            Reset
          </button>
        )}
      </div>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="list-group">
          {orders.map(order => (
            <div
              key={order.id}
              className="list-group-item mb-3 shadow rounded"
              style={{ backgroundColor: '#f8f9fa' }}
            >
              <div className="d-flex justify-content-between">
                <div>
                  <h5>
                    Order #{order.id} {getStatusBadge(order.status)}
                  </h5>
                  <p className="mb-1">Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                  <p className="mb-1">Shipping Address ID: {order.shippingAddressId}</p>
                </div>
                <div className="text-end">
                  <h5 className="text-primary">${order.totalAmount.toFixed(2)}</h5>
                </div>
              </div>
              <hr />
              <h6>Items:</h6>
              <ul>
                {order.orderItems.map(item => (
                  <li key={item.id}>
                    Product ID: {item.productId}, Quantity: {item.quantity}, Price: ${item.price.toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
