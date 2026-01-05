import React, { useState, useEffect } from "react";
import sellerService from "../../services/sellerService";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    price: 0,
    stock: 0,
    description: "",
    imageUrl: "",
    categoryId: "",
  });

  const [editErrors, setEditErrors] = useState({
    name: "",
    price: "",
    imageUrl: "",
    categoryId: "",
  });

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    imageUrl: "",
    categoryId: "",
  });

  const [newErrors, setNewErrors] = useState({
    name: "",
    price: "",
    imageUrl: "",
    categoryId: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

 
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await sellerService.getProducts();
      setProducts(data || []);
      setError("");
    } catch (err) {
      setError("Failed to load products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  const namePattern = /^[a-zA-Z0-9\s\-]+$/; 
  const nameInvalidPattern = /#{3,}/; 
  const urlPattern = /^https?:\/\/\S+\.\S+/i; 

  
  const isValidCategoryId = (id) => {
    if (!id) return true; 
    const num = Number(id);
    return Number.isInteger(num) && num > 0 && num <= 6;
  };

 
  const validateName = (name) => {
    if (!name.trim()) return "Name is required.";
    if (nameInvalidPattern.test(name)) return "Name cannot contain '###' or similar patterns.";
    if (!namePattern.test(name.trim()))
      return "Name can only contain letters, numbers, spaces, and hyphens.";
    return "";
  };

  const validatePrice = (price) => {
    const num = parseFloat(price);
    if (isNaN(num)) return "Price must be a number.";
    if (num <= 0) return "Price must be greater than 0.";
    return "";
  };

  const validateImageUrl = (imageUrl) => {
    if (!imageUrl.trim()) return "";
    if (!urlPattern.test(imageUrl)) return "Invalid image URL format.";
    return "";
  };

  const validateCategoryId = (categoryId) => {
    if (!categoryId) return "";
    if (!isValidCategoryId(categoryId)) return "Category not found.";
    return "";
  };

  
  const handleEditChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
    switch (field) {
      case "name":
        setEditErrors((prev) => ({ ...prev, name: validateName(value) }));
        break;
      case "price":
        setEditErrors((prev) => ({ ...prev, price: validatePrice(value) }));
        break;
      case "imageUrl":
        setEditErrors((prev) => ({ ...prev, imageUrl: validateImageUrl(value) }));
        break;
      case "categoryId":
        setEditErrors((prev) => ({ ...prev, categoryId: validateCategoryId(value) }));
        break;
      default:
        break;
    }
  };

  
  const handleNewChange = (field, value) => {
    setNewProduct((prev) => ({ ...prev, [field]: value }));
    switch (field) {
      case "name":
        setNewErrors((prev) => ({ ...prev, name: validateName(value) }));
        break;
      case "price":
        setNewErrors((prev) => ({ ...prev, price: validatePrice(value) }));
        break;
      case "imageUrl":
        setNewErrors((prev) => ({ ...prev, imageUrl: validateImageUrl(value) }));
        break;
      case "categoryId":
        setNewErrors((prev) => ({ ...prev, categoryId: validateCategoryId(value) }));
        break;
      default:
        break;
    }
  };

 
  const isEditFormValid = () => {
    const nameErr = validateName(editData.name);
    const priceErr = validatePrice(editData.price);
    const imageUrlErr = validateImageUrl(editData.imageUrl);
    const categoryIdErr = validateCategoryId(editData.categoryId);

    setEditErrors({ name: nameErr, price: priceErr, imageUrl: imageUrlErr, categoryId: categoryIdErr });

    return !(nameErr || priceErr || imageUrlErr || categoryIdErr);
  };

  
  const isNewFormValid = () => {
    const nameErr = validateName(newProduct.name);
    const priceErr = validatePrice(newProduct.price);
    const imageUrlErr = validateImageUrl(newProduct.imageUrl);
    const categoryIdErr = validateCategoryId(newProduct.categoryId);

    setNewErrors({ name: nameErr, price: priceErr, imageUrl: imageUrlErr, categoryId: categoryIdErr });

    return !(nameErr || priceErr || imageUrlErr || categoryIdErr);
  };

  
  const saveEdit = async () => {
    if (!isEditFormValid()) {
      setError("Fix validation errors before saving.");
      return;
    }
    try {
      await sellerService.updateProduct(editingId, {
        ...editData,
        price: parseFloat(editData.price),
        stock: parseInt(editData.stock, 10),
        categoryId: editData.categoryId || null,
      });
      setEditingId(null);
      setEditErrors({ name: "", price: "", imageUrl: "", categoryId: "" });
      setError("");
      fetchProducts();
    } catch (err) {
      setError("Failed to update product");
      console.error(err);
    }
  };

 
  const cancelEdit = () => {
    setEditingId(null);
    setEditData({
      name: "",
      price: 0,
      stock: 0,
      description: "",
      imageUrl: "",
      categoryId: "",
    });
    setEditErrors({ name: "", price: "", imageUrl: "", categoryId: "" });
  };

  
  const addProduct = async (e) => {
    e.preventDefault();
    if (!isNewFormValid()) {
      setError("Fix validation errors before adding.");
      return;
    }
    try {
      await sellerService.addProduct({
        ...newProduct,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock, 10),
        categoryId: newProduct.categoryId || null,
      });
      setNewProduct({
        name: "",
        price: "",
        stock: "",
        description: "",
        imageUrl: "",
        categoryId: "",
      });
      setNewErrors({ name: "", price: "", imageUrl: "", categoryId: "" });
      setError("");
      fetchProducts();
    } catch (err) {
      setError("Failed to add product");
      console.error(err);
    }
  };

  
  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await sellerService.deleteProduct(id);
        fetchProducts();
      } catch (err) {
        setError("Failed to delete product");
        console.error(err);
      }
    }
  };

  
  const startEditing = (product) => {
    setEditingId(product.id);
    setEditData({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description,
      imageUrl: product.imageUrl,
      categoryId: product.categoryId || "",
    });
    setEditErrors({ name: "", price: "", imageUrl: "", categoryId: "" });
  };

  return (
    <div className="container my-5">
      <h2>Manage Products</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card mb-4 p-3 shadow-sm">
        <h5>Add New Product</h5>
        <form onSubmit={addProduct}>
          <div className="row g-3">
            <div className="col-md-6">
              <input
                type="text"
                placeholder="Name"
                value={newProduct.name}
                onChange={(e) => handleNewChange("name", e.target.value)}
                className={`form-control ${newErrors.name ? "is-invalid" : ""}`}
                required
              />
              {newErrors.name && <div className="invalid-feedback">{newErrors.name}</div>}
            </div>
            <div className="col-md-3">
              <input
                type="number"
                placeholder="Price"
                value={newProduct.price}
                onChange={(e) => handleNewChange("price", e.target.value)}
                className={`form-control ${newErrors.price ? "is-invalid" : ""}`}
                min="0.01"
                step="0.01"
                required
              />
              {newErrors.price && <div className="invalid-feedback">{newErrors.price}</div>}
            </div>
            <div className="col-md-3">
              <input
                type="number"
                placeholder="Stock"
                value={newProduct.stock}
                onChange={(e) => handleNewChange("stock", e.target.value)}
                className="form-control"
                min="0"
                required
              />
            </div>
            <div className="col-md-6">
              <input
                type="text"
                placeholder="Category ID"
                value={newProduct.categoryId}
                onChange={(e) => handleNewChange("categoryId", e.target.value)}
                className={`form-control ${newErrors.categoryId ? "is-invalid" : ""}`}
              />
              {newErrors.categoryId && <div className="invalid-feedback">{newErrors.categoryId}</div>}
            </div>
            <div className="col-md-6">
              <input
                type="text"
                placeholder="Image URL"
                value={newProduct.imageUrl}
                onChange={(e) => handleNewChange("imageUrl", e.target.value)}
                className={`form-control ${newErrors.imageUrl ? "is-invalid" : ""}`}
              />
              {newErrors.imageUrl && <div className="invalid-feedback">{newErrors.imageUrl}</div>}
            </div>
            <div className="col-12">
              <textarea
                placeholder="Description"
                value={newProduct.description}
                onChange={(e) => handleNewChange("description", e.target.value)}
                className="form-control"
                rows={2}
              />
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-success">
                Add Product
              </button>
            </div>
          </div>
        </form>
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found</p>
      ) : (
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod) =>
              editingId === prod.id ? (
                <tr key={prod.id}>
                  <td>
                    <input
                      type="text"
                      className={`form-control ${editErrors.imageUrl ? "is-invalid" : ""}`}
                      value={editData.imageUrl}
                      onChange={(e) => handleEditChange("imageUrl", e.target.value)}
                    />
                    {editErrors.imageUrl && <div className="invalid-feedback">{editErrors.imageUrl}</div>}
                  </td>
                  <td>
                    <input
                      type="text"
                      className={`form-control ${editErrors.name ? "is-invalid" : ""}`}
                      value={editData.name}
                      onChange={(e) => handleEditChange("name", e.target.value)}
                    />
                    {editErrors.name && <div className="invalid-feedback">{editErrors.name}</div>}
                  </td>
                  <td>
                    <input
                      type="number"
                      className={`form-control ${editErrors.price ? "is-invalid" : ""}`}
                      value={editData.price}
                      onChange={(e) => handleEditChange("price", e.target.value)}
                      min="0.01"
                      step="0.01"
                    />
                    {editErrors.price && <div className="invalid-feedback">{editErrors.price}</div>}
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      value={editData.stock}
                      onChange={(e) => handleEditChange("stock", e.target.value)}
                      min="0"
                    />
                  </td>
                  <td>
                    <textarea
                      className="form-control"
                      value={editData.description}
                      onChange={(e) => handleEditChange("description", e.target.value)}
                      rows={2}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className={`form-control mb-2 ${editErrors.categoryId ? "is-invalid" : ""}`}
                      value={editData.categoryId}
                      onChange={(e) => handleEditChange("categoryId", e.target.value)}
                      placeholder="Category ID"
                    />
                    {editErrors.categoryId && <div className="invalid-feedback">{editErrors.categoryId}</div>}
                    <button className="btn btn-success btn-sm me-2" onClick={saveEdit}>
                      Save
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={cancelEdit}>
                      Cancel
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={prod.id}>
                  <td>
                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      style={{ height: 50, width: 50, objectFit: "cover" }}
                    />
                  </td>
                  <td>{prod.name}</td>
                  <td>${prod.price.toFixed(2)}</td>
                  <td>{prod.stock}</td>
                  <td>{prod.description}</td>
                  <td>
                    <button
                      className="btn btn-secondary btn-sm me-2"
                      onClick={() => startEditing(prod)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteProduct(prod.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageProducts;
