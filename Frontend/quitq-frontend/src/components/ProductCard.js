import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="card h-100 shadow-sm">
      <img
        src={product.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
        alt={product.name}
        className="card-img-top"
        style={{
          height: '150px',
          width: '150px',
          objectFit: 'contain',
          margin: '20px auto 0',  
        }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text text-truncate">{product.description}</p>
        <div className="mt-auto fw-bold">${product.price.toFixed(2)}</div>
        <Link to={`/products/${product.id}`} className="btn btn-primary mt-2">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
