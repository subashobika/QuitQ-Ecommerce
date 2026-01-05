import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import useAuth from '../../hooks/useAuth';
import logo from '../../assets/logo.png';   

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      let token = response.data.token.replace(/^Bearer\s+/i, '');
      const loggedInUser = response.data.user;

      login(token, loggedInUser);

      switch (loggedInUser.role) {
        case 'ADMIN':
          navigate('/admin/dashboard');
          break;
        case 'SELLER':
          navigate('/seller/dashboard');
          break;
        default:
          navigate('/home');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '90vh' }}>
      <div className="p-4 bg-white rounded shadow" style={{ width: '100%', maxWidth: '400px', boxSizing: 'border-box' }}>
        
      
        <div className="text-center mb-4">
          <img src={logo} alt="Quitz Logo" style={{ height: '80px' }} />
      
        </div>

        <h2 className="text-center mb-3">Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              type="email"
              id="email"
              className="form-control"
              autoComplete="off"
              value={email}
              required
              autoFocus
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              autoComplete="new-password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-3 text-center">
          <span>Not registered? </span>
          <Link to="/register" className="text-primary fw-semibold">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;


