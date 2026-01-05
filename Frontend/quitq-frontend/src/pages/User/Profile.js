import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import userService from '../../services/userService';
import shippingAddressService from '../../services/shippingAddressService';

const Profile = () => {
  const { user, logout, token, login } = useAuth();

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    contactNumber: '',
    gender: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);

  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });
  const [editAddressId, setEditAddressId] = useState(null);
  const [editAddressData, setEditAddressData] = useState({
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });

  const [userErrors, setUserErrors] = useState({});
  const [newAddressErrors, setNewAddressErrors] = useState({});
  const [editAddressErrors, setEditAddressErrors] = useState({});

  useEffect(() => {
    if (user?.id) {
      fetchUser();
      fetchAddresses();
    }
  }, [user]);

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const namePattern = /^[a-zA-Z\s-]+$/; 
  const contactPattern = /^\d{7,15}$/; 
  const genderOptions = ['MALE', 'FEMALE', 'OTHER', ''];

  const fetchUser = async () => {
    setLoading(true);
    try {
      const data = await userService.getUser(user.id);
      setUserData({
        name: data.name || '',
        email: data.email || '',
        password: '',
        role: data.role || '',
        contactNumber: data.contactNumber || '',
        gender: data.gender || '',
        address: data.address || '',
      });
    } catch (error) {
      console.error('Failed to fetch user:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      const data = await shippingAddressService.getAddresses();
      setAddresses(data || []);
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    }
  };

  const validateUserData = () => {
    const errors = {};
    if (!userData.name.trim()) {
      errors.name = 'Name is required.';
    } else if (!namePattern.test(userData.name.trim())) {
      errors.name = 'Name can only contain letters, spaces, and hyphens.';
    }
    if (!userData.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!emailPattern.test(userData.email.trim())) {
      errors.email = 'Invalid email format.';
    }
    if (userData.password.trim() && userData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }
    if (userData.contactNumber.trim() && !contactPattern.test(userData.contactNumber.trim())) {
      errors.contactNumber = 'Contact number must be digits only and 7 to 15 characters long.';
    }
    if (
      userData.gender.trim() &&
      !genderOptions.includes(userData.gender.trim().toUpperCase())
    ) {
      errors.gender = 'Gender must be Male, Female, Other, or left blank.';
    }
    setUserErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!validateUserData()) return;

    const payload = {
      name: userData.name,
      email: userData.email,
      role: userData.role || 'USER',
    };
    if (userData.password?.trim()) payload.password = userData.password;
    if (userData.contactNumber?.trim()) payload.contactNumber = userData.contactNumber;
    if (userData.gender?.trim()) payload.gender = userData.gender;
    if (userData.address?.trim()) payload.address = userData.address;

    try {
      const updatedUser = await userService.updateUser(user.id, payload);
      alert('Profile updated successfully');
      setUserData((prev) => ({ ...prev, password: '' }));
      login(token, updatedUser);
    } catch (error) {
      const backendMsg = error.response?.data?.message || error.message || 'Update failed';
      alert(`Update failed: ${backendMsg}`);
      console.error('Update error details:', error);
    }
  };

  const validateAddress = (address, setErrors) => {
    const errors = {};
    if (!address.addressLine1.trim()) errors.addressLine1 = 'Address Line 1 is required.';
    if (!address.city.trim()) errors.city = 'City is required.';
    if (!address.state.trim()) errors.state = 'State is required.';
    if (!address.postalCode.trim()) errors.postalCode = 'Postal Code is required.';
    if (!address.country.trim()) errors.country = 'Country is required.';
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!validateAddress(newAddress, setNewAddressErrors)) return;

    try {
      await shippingAddressService.addAddress(newAddress);
      setNewAddress({
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
      });
      setNewAddressErrors({});
      fetchAddresses();
    } catch (error) {
      console.error('Failed to add address:', error);
      alert('Failed to add address');
    }
  };

  const startEditAddress = (addr) => {
    setEditAddressId(addr.id);
    setEditAddressData({ ...addr });
    setEditAddressErrors({});
  };

  const cancelEdit = () => {
    setEditAddressId(null);
    setEditAddressData({
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    });
    setEditAddressErrors({});
  };

  const handleEditChange = (field, value) => {
    setEditAddressData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    if (!validateAddress(editAddressData, setEditAddressErrors)) return;

    try {
      await shippingAddressService.updateAddress(editAddressId, editAddressData);
      setEditAddressId(null);
      setEditAddressErrors({});
      fetchAddresses();
    } catch (error) {
      console.error('Failed to update address:', error);
      alert('Failed to update address');
    }
  };

  const handleDeleteAddress = async (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await shippingAddressService.deleteAddress(id);
        fetchAddresses();
      } catch (error) {
        console.error('Failed to delete address:', error);
        alert('Failed to delete address');
      }
    }
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status" aria-label="Loading"></div>
      </div>
    );

  if (!user)
    return (
      <div className="alert alert-warning mt-4 text-center" role="alert">
        Please login to view your profile.
      </div>
    );

  return (
    <div className="container my-5" style={{ maxWidth: '700px' }}>
      <h2 className="mb-4 text-center">Your Profile</h2>

      <form onSubmit={handleUpdateUser} className="card p-4 shadow-sm bg-white rounded mb-5" noValidate>
        <h4 className="mb-3">User Information</h4>

        <div className="mb-3">
          <label htmlFor="name" className="form-label fw-semibold">
            Name <span className="text-danger">*</span>
          </label>
          <input
            id="name"
            type="text"
            className={`form-control ${userErrors.name ? 'is-invalid' : ''}`}
            value={userData.name}
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
            required
            placeholder="Enter your full name"
          />
          {userErrors.name && <div className="invalid-feedback">{userErrors.name}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label fw-semibold">
            Email <span className="text-danger">*</span>
          </label>
          <input
            id="email"
            type="email"
            className={`form-control ${userErrors.email ? 'is-invalid' : ''}`}
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            required
            placeholder="Enter your email address"
          />
          {userErrors.email && <div className="invalid-feedback">{userErrors.email}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label fw-semibold">
            Password 
          </label>
          <input
            id="password"
            type="password"
            className={`form-control ${userErrors.password ? 'is-invalid' : ''}`}
            value={userData.password}
            onChange={(e) => setUserData({ ...userData, password: e.target.value })}
            placeholder="Enter new password"
          />
          {userErrors.password && <div className="invalid-feedback">{userErrors.password}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="role" className="form-label fw-semibold">
            Role
          </label>
          <input id="role" type="text" className="form-control" value={userData.role} disabled readOnly />
        </div>

        <div className="mb-3">
          <label htmlFor="contactNumber" className="form-label fw-semibold">
            Contact Number
          </label>
          <input
            id="contactNumber"
            type="tel"
            className={`form-control ${userErrors.contactNumber ? 'is-invalid' : ''}`}
            value={userData.contactNumber}
            onChange={(e) => setUserData({ ...userData, contactNumber: e.target.value })}
            placeholder="Enter your contact number"
          />
          {userErrors.contactNumber && <div className="invalid-feedback">{userErrors.contactNumber}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="gender" className="form-label fw-semibold">
            Gender
          </label>
          <input
            id="gender"
            type="text"
            className={`form-control ${userErrors.gender ? 'is-invalid' : ''}`}
            value={userData.gender}
            onChange={(e) => setUserData({ ...userData, gender: e.target.value })}
            placeholder="Enter your gender (Male, Female, Other)"
          />
          {userErrors.gender && <div className="invalid-feedback">{userErrors.gender}</div>}
        </div>

        <div className="mb-4">
          <label htmlFor="address" className="form-label fw-semibold">
            Address
          </label>
          <textarea
            id="address"
            className="form-control"
            rows="3"
            value={userData.address}
            onChange={(e) => setUserData({ ...userData, address: e.target.value })}
            placeholder="Enter your address"
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Update Profile
        </button>
      </form>

      <h4 className="mb-3">Shipping Addresses</h4>

      {addresses.map((addr) =>
        editAddressId === addr.id ? (
          <div key={addr.id} className="card mb-3 p-3 shadow-sm">
            <form onSubmit={handleUpdateAddress} noValidate>
              <div className="mb-2">
                <input
                  type="text"
                  className={`form-control ${editAddressErrors.addressLine1 ? 'is-invalid' : ''}`}
                  placeholder="Address Line 1"
                  value={editAddressData.addressLine1}
                  onChange={(e) => handleEditChange('addressLine1', e.target.value)}
                  required
                />
                {editAddressErrors.addressLine1 && <div className="invalid-feedback">{editAddressErrors.addressLine1}</div>}
              </div>
              <div className="mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Address Line 2 (optional)"
                  value={editAddressData.addressLine2}
                  onChange={(e) => handleEditChange('addressLine2', e.target.value)}
                />
              </div>
              <div className="row g-3 mb-2">
                <div className="col-md-4">
                  <input
                    type="text"
                    className={`form-control ${editAddressErrors.city ? 'is-invalid' : ''}`}
                    placeholder="City"
                    value={editAddressData.city}
                    onChange={(e) => handleEditChange('city', e.target.value)}
                    required
                  />
                  {editAddressErrors.city && <div className="invalid-feedback">{editAddressErrors.city}</div>}
                </div>
                <div className="col-md-4">
                  <input
                    type="text"
                    className={`form-control ${editAddressErrors.state ? 'is-invalid' : ''}`}
                    placeholder="State"
                    value={editAddressData.state}
                    onChange={(e) => handleEditChange('state', e.target.value)}
                    required
                  />
                  {editAddressErrors.state && <div className="invalid-feedback">{editAddressErrors.state}</div>}
                </div>
                <div className="col-md-4">
                  <input
                    type="text"
                    className={`form-control ${editAddressErrors.postalCode ? 'is-invalid' : ''}`}
                    placeholder="Postal Code"
                    value={editAddressData.postalCode}
                    onChange={(e) => handleEditChange('postalCode', e.target.value)}
                    required
                  />
                  {editAddressErrors.postalCode && <div className="invalid-feedback">{editAddressErrors.postalCode}</div>}
                </div>
              </div>
              <div className="mb-2">
                <input
                  type="text"
                  className={`form-control ${editAddressErrors.country ? 'is-invalid' : ''}`}
                  placeholder="Country"
                  value={editAddressData.country}
                  onChange={(e) => handleEditChange('country', e.target.value)}
                  required
                />
                {editAddressErrors.country && <div className="invalid-feedback">{editAddressErrors.country}</div>}
              </div>
              <button type="submit" className="btn btn-success me-2">
                Save
              </button>
              <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
                Cancel
              </button>
            </form>
          </div>
        ) : (
          <div key={addr.id} className="card mb-2">
            <div className="card-body d-flex justify-content-between align-items-center">
              <p className="mb-0">
                {addr.addressLine1}
                {addr.addressLine2 && `, ${addr.addressLine2}`}, {addr.city}, {addr.state} {addr.postalCode}, {addr.country}
              </p>
              <div>
                <button className="btn btn-secondary me-2" onClick={() => startEditAddress(addr)}>
                  Edit
                </button>
                <button className="btn btn-danger" onClick={() => handleDeleteAddress(addr.id)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )
      )}

      <div className="card mt-4">
        <div className="card-body">
          <h5>Add New Address</h5>
          <form onSubmit={handleAddAddress} noValidate>
            <div className="row g-3">
              <div className="col-md-6">
                <input
                  type="text"
                  className={`form-control ${newAddressErrors.addressLine1 ? 'is-invalid' : ''}`}
                  placeholder="Address Line 1"
                  value={newAddress.addressLine1}
                  onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                  required
                />
                {newAddressErrors.addressLine1 && <div className="invalid-feedback">{newAddressErrors.addressLine1}</div>}
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Address Line 2 (optional)"
                  value={newAddress.addressLine2}
                  onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })}
                />
              </div>
              <div className="col-md-4">
                <input
                  type="text"
                  className={`form-control ${newAddressErrors.city ? 'is-invalid' : ''}`}
                  placeholder="City"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  required
                />
                {newAddressErrors.city && <div className="invalid-feedback">{newAddressErrors.city}</div>}
              </div>
              <div className="col-md-4">
                <input
                  type="text"
                  className={`form-control ${newAddressErrors.state ? 'is-invalid' : ''}`}
                  placeholder="State"
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                  required
                />
                {newAddressErrors.state && <div className="invalid-feedback">{newAddressErrors.state}</div>}
              </div>
              <div className="col-md-4">
                <input
                  type="text"
                  className={`form-control ${newAddressErrors.postalCode ? 'is-invalid' : ''}`}
                  placeholder="Postal Code"
                  value={newAddress.postalCode}
                  onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                  required
                />
                {newAddressErrors.postalCode && <div className="invalid-feedback">{newAddressErrors.postalCode}</div>}
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  className={`form-control ${newAddressErrors.country ? 'is-invalid' : ''}`}
                  placeholder="Country"
                  value={newAddress.country}
                  onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                  required
                />
                {newAddressErrors.country && <div className="invalid-feedback">{newAddressErrors.country}</div>}
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-success w-100">
                  Add Address
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
