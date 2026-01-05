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

const SellerBusinessProfile = () => {
  const [formData, setFormData] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    loadBusinessDetails();
  }, []);

  const loadBusinessDetails = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const profile = await sellerService.getProfile();
      setFormData({
        name: profile.name || "",
        contactNumber: profile.contactNumber || "",
        address: profile.address || "",
        gender: profile.gender || "",
        email: profile.email || "",
        businessName: profile.businessName || "",
        taxId: profile.taxId || "",
        businessAddress: profile.businessAddress || "",
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      });
    } catch {
      setErrorMessage("Failed to load business details");
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.businessName.trim()) {
      errors.businessName = "Business name is required.";
    }
    const taxIdPattern = /^[A-Za-z0-9\-\s]+$/;
    if (formData.taxId && !taxIdPattern.test(formData.taxId)) {
      errors.taxId = "Tax ID format is invalid.";
    }
    if (!formData.businessAddress.trim()) {
      errors.businessAddress = "Business address is required.";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");
    try {
      
      await sellerService.updateProfile(formData);
      setSuccessMessage("Business details updated successfully.");
      await loadBusinessDetails();
    } catch {
      setErrorMessage("Failed to update business details.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.businessName && !formData.businessAddress) {
    return <p>Loading business details...</p>;
  }

  return (
    <div className="container my-5 d-flex justify-content-center">
      <div className="p-4 bg-white rounded" style={{
        width: "100%", maxWidth: "600px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        borderRadius: "8px"
      }}>
        <h2 className="mb-4 text-center">Business Profile</h2>
        {errorMessage && <div className="alert alert-danger" role="alert">{errorMessage}</div>}
        {successMessage && <div className="alert alert-success" role="alert">{successMessage}</div>}
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="businessName" className="form-label fw-semibold">
              Business Name <span className="text-danger">*</span>
            </label>
            <input
              id="businessName"
              name="businessName"
              type="text"
              className={`form-control ${validationErrors.businessName ? "is-invalid" : ""}`}
              value={formData.businessName}
              onChange={handleChange}
              disabled={loading}
              required
            />
            {validationErrors.businessName && (
              <div className="invalid-feedback">{validationErrors.businessName}</div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="taxId" className="form-label fw-semibold">
              Tax ID
            </label>
            <input
              id="taxId"
              name="taxId"
              type="text"
              className={`form-control ${validationErrors.taxId ? "is-invalid" : ""}`}
              value={formData.taxId}
              onChange={handleChange}
              disabled={loading}
            />
            {validationErrors.taxId && (
              <div className="invalid-feedback">{validationErrors.taxId}</div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="businessAddress" className="form-label fw-semibold">
              Business Address <span className="text-danger">*</span>
            </label>
            <textarea
              id="businessAddress"
              name="businessAddress"
              className={`form-control ${validationErrors.businessAddress ? "is-invalid" : ""}`}
              value={formData.businessAddress}
              onChange={handleChange}
              disabled={loading}
              rows={3}
              required
            ></textarea>
            {validationErrors.businessAddress && (
              <div className="invalid-feedback">{validationErrors.businessAddress}</div>
            )}
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Saving..." : "Save Business Details"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SellerBusinessProfile;
