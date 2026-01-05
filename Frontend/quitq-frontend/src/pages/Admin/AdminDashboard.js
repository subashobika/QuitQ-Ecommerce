import React, { useEffect, useState } from 'react';
import adminService from '../../services/adminService';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0 });
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
    fetchUsers();
  }, []);

  const fetchDashboardStats = async () => {
    setLoadingStats(true);
    try {
      const data = await adminService.getDashboardStats();
      setStats(data);
      setError('');
    } catch {
      setError('Failed to load dashboard stats');
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const data = await adminService.getAllUsers();
      const filteredUsers = data.filter(user => user.role !== 'ADMIN');
      setUsers(filteredUsers);
      setError('');
    } catch {
      setError('Failed to load users');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminService.deleteUser(id);
        fetchUsers();
      } catch {
        alert('Failed to delete user');
      }
    }
  };

  const goToCategoryManagement = () => {
    navigate('/admin/categories');
  };

  return (
    <div className="container my-5">
      <h2 className="mb-5 text-center">Admin Dashboard</h2>
      {error && <div className="alert alert-danger text-center">{error}</div>}

      <div className="mb-4 text-center">
        <button className="btn btn-primary" onClick={goToCategoryManagement}>
          Manage Categories
        </button>
      </div>

    
      <div className="mb-5 d-flex justify-content-center">
        <div className="p-4 shadow rounded text-center" style={{ maxWidth: 400, backgroundColor: '#f8f9fa' }}>
          <h5 className="mb-4">Dashboard Stats</h5>
          {loadingStats ? (
            <p>Loading stats...</p>
          ) : (
            <>
              <p className="mb-2">
                <strong>Total Orders: </strong>{stats.totalOrders}
              </p>
              <p className="mb-0">
                <strong>Total Revenue: </strong>
                <span className="text-success">
                  ${stats.totalRevenue?.toFixed(2) ?? '0.00'}
                </span>
              </p>
            </>
          )}
        </div>
      </div>

      
      <div className="mb-5 p-4 shadow rounded" style={{ backgroundColor: '#e9ecef' }}>
        <h4 className="mb-4">Users</h4>
        {loadingUsers ? (
          <p className="text-center">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-center">No users found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Contact</th>
                  <th style={{ minWidth: 80 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.contactNumber || '-'}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(user.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

