import React, { useState, useEffect } from "react";
import sellerService from "../../services/sellerService";

const SellerDashboard = () => {
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0 });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);
  const [statusUpdateError, setStatusUpdateError] = useState("");

  useEffect(() => {
    fetchStats();
    fetchOrders();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await sellerService.getDashboard();
      setStats({
        totalOrders: data.totalOrders || 0,
        totalRevenue: data.totalRevenue || 0,
      });
      setError("");
    } catch (error) {
      setError("Failed to fetch dashboard stats");
      console.error(error);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await sellerService.getOrders();
      setOrders(data || []);
      setError("");
    } catch (error) {
      setError("Failed to fetch orders");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  const handleStatusChange = async (orderId, newStatus) => {
    setStatusUpdatingId(orderId);
    setStatusUpdateError("");
    try {
      const updatedOrder = await sellerService.updateOrderStatus(orderId, newStatus);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: updatedOrder.status } : order
        )
      );
    } catch (error) {
      setStatusUpdateError(`Failed to update status of order ${orderId}`);
      console.error(error);
    } finally {
      setStatusUpdatingId(null);
    }
  };

  
  const statusOptions = ["SHIPPED", "DELIVERED"];

  return (
    <div className="container my-5">
      <h2 className="text-center mb-5">Seller Dashboard</h2>

      {error && <div className="alert alert-danger text-center mb-4">{error}</div>}

    
      <div className="mb-5">
        <div className="card shadow-sm p-4 text-center">
          <h5 className="mb-4 text-primary">Stats</h5>
          <p className="mb-3 fs-5">
            <strong>Total Orders:</strong> {stats.totalOrders}
          </p>
          <p className="fs-5 mb-0">
            <strong>Total Revenue:</strong>{" "}
            <span className="text-success">
              ${Number(stats.totalRevenue) ? Number(stats.totalRevenue).toFixed(2) : "0.00"}
            </span>
          </p>
        </div>
      </div>

      
      <div>
        <h4 className="mb-4 border-bottom pb-2">Orders Overview</h4>
        {loading ? (
          <p className="text-center fs-5">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-center fs-5">No orders found.</p>
        ) : (
          <>
            {statusUpdateError && (
              <div className="alert alert-danger text-center mb-3">
                {statusUpdateError}
              </div>
            )}
            <div className="table-responsive shadow-sm rounded">
              <table className="table table-striped table-hover mb-0 align-middle">
                <thead className="table-primary">
                  <tr>
                    <th scope="col">Order ID</th>
                    <th scope="col">Status</th>
                    <th scope="col">Update Status</th>
                    <th scope="col">Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.status}</td>
                      <td>
                        <select
                          className="form-select"
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          disabled={statusUpdatingId === order.id}
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>${order.totalAmount?.toFixed(2) || "0.00"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;
