import React, { useEffect, useState } from 'react';
import {
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory
} from '../../services/categoryService';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch {
      setError('Failed to load categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, description: category.description || '' });
  };

  const handleCancel = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Name is required');
      return;
    }
    setSaving(true);
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
      } else {
        await addCategory(formData);
      }
      await fetchCategories();
      handleCancel();
    } catch {
      alert('Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id);
        fetchCategories();
      } catch {
        alert('Failed to delete category');
      }
    }
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center">Category Management</h2>

      {error && <div className="alert alert-danger">{error}</div>}

     
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name *</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={saving}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            disabled={saving}
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary me-2" disabled={saving}>
          {editingCategory ? 'Update Category' : 'Add Category'}
        </button>
        {editingCategory && (
          <button type="button" className="btn btn-secondary" onClick={handleCancel} disabled={saving}>
            Cancel
          </button>
        )}
      </form>

      
      {loading ? (
        <p>Loading categories...</p>
      ) : categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th style={{ minWidth: '100px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id}>
                <td>{cat.name}</td>
                <td>{cat.description || '-'}</td>
                <td>
                  <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(cat)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(cat.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CategoryManagement;


