import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProductsByCategory } from '../../services/productService';
import ProductCard from '../../components/ProductCard';

const PAGE_SIZE = 8;

const CategoryProducts = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

 
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

 
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getProductsByCategory(id, { searchTerm: debouncedSearchTerm });
        setProducts(data);
        setCurrentPage(1);
      } catch {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [id, debouncedSearchTerm]);

  const totalPages = Math.ceil(products.length / PAGE_SIZE);
  const paginatedProducts = products.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="container mt-4">
      <h2>Products in Category</h2>

      <input
        type="text"
        placeholder="Search products..."
        className="form-control mb-3"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ maxWidth: '300px' }}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            setDebouncedSearchTerm(searchTerm);
          }
        }}
      />

      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : paginatedProducts.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="row">
          {paginatedProducts.map((product) => (
            <div key={product.id} className="col-md-3 mb-4">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav>
          <ul className="pagination justify-content-center">
            <li
              className={`page-item ${currentPage === 1 || loading ? 'disabled' : ''}`}>
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                className="page-link"
                disabled={loading}
              >
                Previous
              </button>
            </li>
            {[...Array(totalPages)].map((_, index) => (
              <li
                key={index}
                className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                <button
                  onClick={() => setCurrentPage(index + 1)}
                  className="page-link"
                  disabled={loading}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${currentPage === totalPages || loading ? 'disabled' : ''}`}>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className="page-link"
                disabled={loading}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default CategoryProducts;

