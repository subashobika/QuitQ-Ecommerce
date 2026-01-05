import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import logo from '../../assets/logo.png'; 

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',         
    contactNumber: '',
    gender: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [nameError, setNameError] = useState('');
  const [contactError, setContactError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();

  const namePattern = /^[a-zA-Z\s-]{2,}$/;
  const contactPattern = /^\d{10}$/;
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    setError('');

    if (name === "name") {
      if (!value.trim()) {
        setNameError('Name is required.');
      } else if (!namePattern.test(value.trim())) {
        setNameError('Only letters, spaces, hyphens; min 2 chars.');
      } else {
        setNameError('');
      }
    }

    if (name === "contactNumber") {
      if (!value.trim()) {
        setContactError('');
      } else if (!/^\d+$/.test(value)) {
        setContactError('Only digits allowed.');
      } else if (!contactPattern.test(value)) {
        setContactError('Must be exactly 10 digits.');
      } else {
        setContactError('');
      }
    }

    if (name === "password") {
      if (!value) {
        setPasswordError('Password is required.');
      } else if (!passwordPattern.test(value)) {
        setPasswordError('Min 6 chars, 1 uppercase, 1 lowercase, 1 number.');
      } else {
        setPasswordError('');
      }
    }

    if (name === "email") {
      if (!value.trim()) {
        setEmailError('Email is required.');
      } else if (!emailPattern.test(value.trim())) {
        setEmailError('Invalid email format.');
      } else {
        setEmailError('');
      }
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setNameError('Name is required.');
      setError('Registration failed: Name is required.');
      return;
    }
    if (!namePattern.test(formData.name.trim())) {
      setNameError('Only letters, spaces, hyphens; min 2 chars.');
      setError('Registration failed: Invalid name format.');
      return;
    }

    if (!formData.email.trim()) {
      setEmailError('Email is required.');
      setError('Registration failed: Email is required.');
      return;
    }
    if (!emailPattern.test(formData.email.trim())) {
      setEmailError('Invalid email format.');
      setError('Registration failed: Invalid email format.');
      return;
    }

    if (formData.contactNumber && (!contactPattern.test(formData.contactNumber))) {
      setContactError('Must be exactly 10 digits.');
      setError('Registration failed: Invalid contact number.');
      return;
    }

    if (!formData.password) {
      setPasswordError('Password is required.');
      setError('Registration failed: Password is required.');
      return;
    }
    if (!passwordPattern.test(formData.password)) {
      setPasswordError('Min 6 chars, 1 uppercase, 1 lowercase, 1 number.');
      setError('Registration failed: Password does not meet requirements.');
      return;
    }

    if (!formData.role || formData.role.toUpperCase() === 'ADMIN') {
      setError('Registration failed: Role cannot be ADMIN or empty.');
      return;
    }

    try {
      await api.post('/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data || 'Registration failed due to server error.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '90vh' }}>
      <div
        className="p-4 bg-white rounded shadow"
        style={{ width: '100%', maxWidth: '500px', boxSizing: 'border-box' }}
      >
        <div className="text-center mb-4">
          <img src={logo} alt="QuitQ Logo" style={{ height: '80px' }} />
        </div>

        <h2 className="mb-3 text-center">Register</h2>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Full Name *</label>
            <input
              type="text"
              className={`form-control ${nameError ? "is-invalid" : ""}`}
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              autoFocus
            />
            {nameError && <div className="invalid-feedback">{nameError}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email *</label>
            <input
              type="email"
              className={`form-control ${emailError ? "is-invalid" : ""}`}
              id="email"
              name="email"
              autoComplete="off"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {emailError && <div className="invalid-feedback">{emailError}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password *</label>
            <input
              type="password"
              className={`form-control ${passwordError ? "is-invalid" : ""}`}
              id="password"
              name="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
            {passwordError && <div className="invalid-feedback">{passwordError}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="role" className="form-label">Role *</label>
            <select
              className="form-select"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="">Select Role</option>
              <option value="USER">User</option>
              <option value="SELLER">Seller</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="contactNumber" className="form-label">Contact Number</label>
            <input
              type="tel"
              className={`form-control ${contactError ? "is-invalid" : ""}`}
              id="contactNumber"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              maxLength={10}
              pattern="\d*"
            />
            {contactError && <div className="invalid-feedback">{contactError}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="gender" className="form-label">Gender</label>
            <select
              className="form-select"
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="address" className="form-label">Address</label>
            <textarea
              className="form-control"
              id="address"
              name="address"
              rows="2"
              value={formData.address}
              onChange={handleChange}
            ></textarea>
          </div>

          {error && (
            <div style={{ color: 'red', marginBottom: '10px', fontWeight: 'bold' }}>
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary w-100">Register</button>
        </form>

        <div className="mt-3 text-center">
          <span>Already registered? </span>
          <Link to="/login" className="text-primary fw-semibold">Login here</Link>
        </div>
      </div>
    </div>
  );
};


export default Register;
