import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import checkoutService from '../../services/checkoutService';
import paymentService from '../../services/paymentService';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [totalAmount, setTotalAmount] = useState(location.state?.totalAmount || 0);
  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchAddresses() {
      try {
        setLoadingAddresses(true);
        const addresses = await checkoutService.getShippingAddresses();
        setShippingAddresses(addresses);
        if (addresses.length > 0) {
          setSelectedAddressId(addresses[0].id);
        }
      } catch {
        setError('Failed to load shipping addresses');
      } finally {
        setLoadingAddresses(false);
      }
    }
    fetchAddresses();
  }, []);

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      alert('Please select a shipping address');
      return;
    }
    setError('');

    try {
      setPlacingOrder(true);

     
      const order = await checkoutService.placeOrder(selectedAddressId);

     
      const paymentResponse = await paymentService.processPayment({
        orderId: order.id,
        amount: totalAmount,
        paymentMethod,
      });

      if (paymentResponse.status !== 'SUCCESS') {
        alert('Payment failed: ' + paymentResponse.status);
        setPlacingOrder(false);
        return;
      }
navigate('/order-success', {
  state: {
    order: {
      id: order.id,
      totalAmount,
      orderDate: new Date().toISOString(),
      shippingAddress: shippingAddresses.find(addr => addr.id === selectedAddressId)?.addressLine1 || 'N/A',
      paymentMethod,
    }
  }
});

      
    } catch (err) {
      setError('Failed to complete checkout. ' + (err.message || ''));
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loadingAddresses)
    return <div className="container mt-5 text-center">Loading shipping addresses...</div>;

  if (error) return <div className="container mt-5 text-danger text-center">{error}</div>;

  return (
    <div className="container mt-5" style={{ maxWidth: '700px' }}>
      <div className="card shadow-sm p-4">
      
        <h2 className="mb-4">Checkout</h2>

        {!shippingAddresses.length ? (
          <p className="text-muted">No shipping addresses found. Please add one in your profile.</p>
        ) : (
          <>
            <h5 className="mb-3">Select Shipping Address</h5>
            <div className="list-group mb-4">
              {shippingAddresses.map((addr) => (
                <label key={addr.id} className="list-group-item">
                  <input
                    type="radio"
                    name="shippingAddress"
                    value={addr.id}
                    checked={selectedAddressId === addr.id}
                    onChange={() => setSelectedAddressId(addr.id)}
                    className="me-2"
                  />
                  {addr.addressLine1}, {addr.city}, {addr.state} - {addr.postalCode}, {addr.country}
                </label>
              ))}
            </div>

            <h5 className="mb-3">Payment Method</h5>
            <select
              className="form-select mb-4"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              disabled={placingOrder}
            >
              <option value="CREDIT_CARD">Credit Card</option>
              <option value="DEBIT_CARD">Debit Card</option>
              <option value="UPI">UPI</option>
            </select>

            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4>
                Total Amount: <span className="text-primary">${totalAmount.toFixed(2)}</span>
              </h4>
            </div>

            <button className="btn btn-primary btn-lg px-5" onClick={handlePlaceOrder} disabled={placingOrder}>
              {placingOrder ? 'Processing...' : 'Place Order & Pay'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Checkout;

