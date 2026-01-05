import React, { useEffect, useState } from "react";
import sellerService from "../../services/sellerService";

const defaultForm = {
  name: "",
  contactNumber: "",
  address: "",
  gender: "",
  email: "",
  businessName: "",
  businessAddress: "",
  taxId: "",
  createdAt: null,
  updatedAt: null,
};

const SellerProfile = () => {
  const [profile, setProfile] = useState(defaultForm);
  const [formData, setFormData] = useState(defaultForm); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await sellerService.getProfile();
      setProfile(data);
      setFormData({
        name: data.name || "",
        contactNumber: data.contactNumber || "",
        address: data.address || "",
        gender: data.gender || "",
        email: data.email || "",
        businessName: data.businessName || "",
        businessAddress: data.businessAddress || "",
        taxId: data.taxId || "",
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    } catch {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const errors = {};
    
    const namePattern = /^[A-Za-z\s\-_]+$/;

    if (!formData.name.trim()) {
      errors.name = "Name is required.";
    } else if (formData.name.trim().length < 3) {
      errors.name = "Name must be at least 3 characters long.";
    } else if (!namePattern.test(formData.name.trim())) {
      errors.name =
        "Name can only contain alphabets, spaces, hyphens, and underscores.";
    }

    if (formData.contactNumber) {
      const phonePattern = /^\+?[\d\s\-]{7,15}$/;
      if (!phonePattern.test(formData.contactNumber.trim())) {
        errors.contactNumber = "Invalid phone number format.";
      }
    }
    if (!["M", "F", "O"].includes(formData.gender)) {
      errors.gender = "Please select a valid gender.";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError("");
    try {
     
      await sellerService.updateProfile(formData);
      alert("Profile updated successfully."); 
      await loadProfile();
    } catch {
      setError("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) return <p>Loading profile...</p>;

  return (
    <div className="container my-5 d-flex justify-content-center">
      <div
        className="p-4 bg-white rounded"
        style={{
          width: "100%",
          maxWidth: "600px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          borderRadius: "8px",
        }}
      >
        <h2 className="mb-4 text-center">Seller Profile</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {profile && (
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold">
                Email (read-only)
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={formData.email}
                readOnly
                disabled={loading}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="name" className="form-label fw-semibold">
                Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className={`form-control ${
                  validationErrors.name ? "is-invalid" : ""
                }`}
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
                required
              />
              {validationErrors.name && (
                <div className="invalid-feedback">{validationErrors.name}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="contactNumber" className="form-label fw-semibold">
                Contact Number
              </label>
              <input
                type="text"
                id="contactNumber"
                name="contactNumber"
                className={`form-control ${
                  validationErrors.contactNumber ? "is-invalid" : ""
                }`}
                value={formData.contactNumber}
                onChange={handleChange}
                disabled={loading}
              />
              {validationErrors.contactNumber && (
                <div className="invalid-feedback">
                  {validationErrors.contactNumber}
                </div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="address" className="form-label fw-semibold">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                className="form-control"
                value={formData.address}
                onChange={handleChange}
                disabled={loading}
                rows={3}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="gender" className="form-label fw-semibold">
                Gender <span className="text-danger">*</span>
              </label>
              <select
                id="gender"
                name="gender"
                className={`form-select ${
                  validationErrors.gender ? "is-invalid" : ""
                }`}
                value={formData.gender}
                onChange={handleChange}
                disabled={loading}
                required
              >
                <option value="">Select Gender</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </select>
              {validationErrors.gender && (
                <div className="invalid-feedback">{validationErrors.gender}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="createdAt" className="form-label fw-semibold">
                Created At
              </label>
              <input
                type="text"
                id="createdAt"
                className="form-control"
                value={
                  formData.createdAt
                    ? new Date(formData.createdAt).toLocaleString()
                    : ""
                }
                readOnly
                disabled
              />
            </div>
            <div className="mb-3">
              <label htmlFor="updatedAt" className="form-label fw-semibold">
                Last Updated
              </label>
              <input
                type="text"
                id="updatedAt"
                className="form-control"
                value={
                  formData.updatedAt
                    ? new Date(formData.updatedAt).toLocaleString()
                    : ""
                }
                readOnly
                disabled
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SellerProfile;
