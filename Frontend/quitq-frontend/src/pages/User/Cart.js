import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CartService from '../../services/cartService';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await CartService.getCartItems();
      setCartItems(response.data);
    } catch (err) {
      setError('Failed to load cart items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleQuantityChange = async (productId, newQuantity) => {
    try {
      await CartService.updateQuantity(productId, newQuantity);
      fetchCartItems();
    } catch {
      alert('Failed to update quantity');
    }
  };

  const handleRemove = async (cartItemId) => {
    try {
      await CartService.removeFromCart(cartItemId);
      fetchCartItems();
    } catch {
      alert('Failed to remove item');
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    navigate('/checkout', { state: { totalAmount: totalPrice } });
  };

  if (loading)
    return <div className="container mt-5 text-center">Loading your cart...</div>;
  if (error)
    return <div className="container mt-5 text-danger text-center">{error}</div>;

  return (
    <div className="container my-5" style={{ maxWidth: '900px' }}>
      <div className="card shadow-lg border-0 px-4 py-3">
        <h2 className="mb-4 text-center text-primary display-5 fw-bold">
          <i className="bi bi-cart3 me-2"></i>Your Shopping Cart
        </h2>

        {cartItems.length === 0 ? (
          <div className="p-5 text-center text-muted fs-5">
            <i className="bi bi-bag-x display-4 mb-3 d-block"></i>
            Your cart is empty.
          </div>
        ) : (
          <>
            <div className="row g-4">
              {cartItems.map((item) => (
                <div className="col-12" key={item.id}>
                  <div className="card flex-row flex-wrap align-items-center border-0 shadow-sm p-3">
                    <div className="flex-grow-1">
                      <h5 className="mb-1 fw-semibold">
                        <i className="bi bi-box-seam me-2 text-info"></i>
                        {item.productName}
                      </h5>
                      <p className="mb-0 text-muted small">
                        <span className="me-1">Unit Price:</span>
                        <span className="text-primary fw-bold">${item.price.toFixed(2)}</span>
                      </p>
                    </div>
                    <div className="d-flex align-items-center me-4">
                      <label
                        htmlFor={`qty_${item.productId}`}
                        className="form-label me-2 mb-0 fw-semibold small"
                      >
                        Qty:
                      </label>
                      <input
                        type="number"
                        id={`qty_${item.productId}`}
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(item.productId, Number(e.target.value))
                        }
                        className="form-control form-control-sm"
                        style={{ width: '80px' }}
                      />
                    </div>
                    <div
                      className="fw-bold text-primary me-4 text-end"
                      style={{ minWidth: '110px', fontSize: '1.15rem' }}
                    >
                      <i className="bi bi-cash-stack me-1"></i>${(item.price * item.quantity).toFixed(2)}
                    </div>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="btn btn-outline-danger btn-sm ms-2"
                      style={{ minWidth: '80px' }}
                      aria-label={`Remove ${item.productName} from cart`}
                    >
                      <i className="bi bi-trash"></i> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 border-top pt-4 d-flex justify-content-between align-items-center">
              <h4 className="m-0 text-success fw-bolder">
                <i className="bi bi-currency-dollar"></i> Total: ${totalPrice.toFixed(2)}
              </h4>
              <button
                className="btn btn-success btn-lg px-5"
                style={{ borderRadius: '30px', fontWeight: '600' }}
                onClick={handleCheckout}
              >
                <i className="bi bi-credit-card"></i> Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
