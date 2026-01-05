import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import ProductCard from '../../components/ProductCard';

const PAGE_SIZE = 8;

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let url = '/products';
        if (searchTerm.trim()) {
          url = `/products/search/name?name=${encodeURIComponent(searchTerm.trim())}`;
        }
        const response = await api.get(url);
        setProducts(response.data);
        setCurrentPage(1);
      } catch (err) {
        setError('Failed to load products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchTerm]);

  const totalPages = Math.ceil(products.length / PAGE_SIZE);
  const paginatedProducts = products.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="container mt-4">
      <h2>All Products</h2>

      <input
        type="text"
        placeholder="Search products..."
        className="form-control mb-3"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ maxWidth: '400px' }}
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
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                className="page-link"
              >
                Previous
              </button>
            </li>
            {[...Array(totalPages)].map((_, index) => (
              <li
                key={index}
                className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
              >
                <button
                  onClick={() => setCurrentPage(index + 1)}
                  className="page-link"
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}
            >
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className="page-link"
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

export default AllProducts;

