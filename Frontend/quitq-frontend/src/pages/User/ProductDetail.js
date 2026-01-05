import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/api'; 

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch {
        setError('Failed to load product.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await api.post('/cart/add', null, {
        params: {
          productId: product.id,
          quantity,
        },
      });
      alert(`Added ${quantity} of "${product.name}" to the cart!`);
    } catch (err) {
      alert('Failed to add product to cart.');
    }
  };

  if (loading) return <div className="container mt-4">Loading product details...</div>;
  if (error) return <div className="container mt-4 text-danger">{error}</div>;
  if (!product) return <div className="container mt-4">Product not found.</div>;

  return (
    <div className="container mt-4">
      <style>
        {`
        .product-box {
          border: 2px solid #e3e3e3;
          border-radius: 20px;
          transition: transform 0.15s cubic-bezier(.03,1.04,.74,.99), box-shadow 0.2s;
          box-shadow: 0 4px 32px rgba(44,62,80,0.18), 0 1.5px 8px rgba(34,34,34,0.05);
          background: linear-gradient(135deg, #fafcff 90%, #f4f8ff 100%);
          position: relative;
          overflow: hidden;
        }
        .product-box:hover {
          transform: scale(1.011) translateY(-4px);
          box-shadow: 0 16px 32px 0 rgba(0,0,0,0.18), 0 4px 12px rgba(52,152,219,0.11);
          border-color: #37b0ff;
        }
        .product-image {
          background: #eef6fb;
          border-radius: 12px;
          border: 1.5px solid #ebf1f8;
          transition: box-shadow 0.15s;
          box-shadow: 0 1.5px 8px rgba(52,152,219,0.08);
        }
        .product-image:hover {
          box-shadow: 0 6px 38px 6px #a6e0ff70;
        }
        .product-box::before {
          content: "";
          display: block;
          position: absolute;
          left: 0;
          top: 16px;
          width: 6px;
          height: 90%;
          border-radius: 8px;
          background: linear-gradient(180deg, #35b6ff 24%, #7ec2ff 100%);
          opacity: 0.22;
        }
        `}
      </style>

      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="product-box shadow-lg p-4 mb-5 bg-white rounded-4">
            <div className="row">
            
              <div className="col-md-6 d-flex justify-content-center align-items-center">
                <img
                  src={product.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'}
                  alt={product.name}
                  className="img-fluid rounded shadow-sm product-image"
                  style={{
                    objectFit: 'contain',
                    maxHeight: '300px',
                    maxWidth: '100%',
                  }}
                />
              </div>

            
              <div className="col-md-6">
                <h2>{product.name}</h2>

                
                {product.businessName && (
                  <p className="text-secondary mb-1" style={{ fontStyle: 'italic' }}>
                    Sold by: <strong>{product.businessName}</strong>
                  </p>
                )}

                <p className="text-muted mb-1">Stock Available: {product.stock}</p>
                <h4 className="text-primary">${product.price.toFixed(2)}</h4>
                <p className="my-4">{product.description}</p>

                {product.stock === 0 ? (
                  <p className="text-danger fw-bold fs-5">Out of Stock</p>
                ) : (
                  <>
                    
                    <div className="mb-3 d-flex align-items-center">
                      <label htmlFor="quantity" className="form-label me-3 mb-0">
                        Quantity:
                      </label>
                      <input
                        id="quantity"
                        type="number"
                        min="1"
                        max={product.stock}
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(Math.min(Math.max(1, e.target.value), product.stock))
                        }
                        className="form-control"
                        style={{ width: '80px' }}
                      />
                    </div>

                   
                    <button onClick={handleAddToCart} className="btn btn-success btn-lg px-4">
                      Add to Cart
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

