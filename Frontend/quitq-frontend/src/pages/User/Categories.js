import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllCategories } from '../../services/categoryService';

const categoryImages = {
  1: '/images/categories/electronics.jpg',
  2: '/images/categories/fashion.jpg',
  3: '/images/categories/home_kitchen.webp',
  4: '/images/categories/books.jpg',
  5: '/images/categories/beauty.jpg',
  6: '/images/categories/Groceries.jpg',
};

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch {
        setError('Failed to load categories.');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="container mt-4">
        <p>Loading categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <p className="text-danger">{error}</p>
      </div>
    );
  }

  const cardStyle = (id) => ({
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    transform: hoveredId === id ? 'scale(1.05)' : 'scale(1)',
    boxShadow:
      hoveredId === id
        ? '0 8px 16px rgba(0,0,0,0.2)'
        : '0 1px 3px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    height: '100%',
  });

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Categories</h2>
      {categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <div className="row">
          {categories.map((category) => (
            <div key={category.id} className="col-md-4 mb-4">
              <Link
                to={`/categories/${category.id}`}
                className="text-decoration-none"
                onMouseEnter={() => setHoveredId(category.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="card" style={cardStyle(category.id)}>
                  <img
                    src={
                      categoryImages[category.id] ||
                      'https://via.placeholder.com/150?text=Category'
                    }
                    alt={category.name}
                    style={{
                      objectFit: 'contain',
                      height: '120px',
                      width: '150px',
                      margin: '20px auto 10px',
                      display: 'block',
                    }}
                  />
                  <div className="card-body d-flex flex-column justify-content-center align-items-center">
                    <h5 className="card-title text-center">{category.name}</h5>
                    {category.description && (
                      <p className="card-text text-muted text-center">
                        {category.description}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;
