import api from '../api/api';

const checkoutService = {
  getShippingAddresses: async () => {
    const response = await api.get('/shipping-addresses');
    return response.data;
  },

  placeOrder: async (shippingAddressId) => {
    const response = await api.post('/orders', null, {
      params: { shippingAddressId }
    });
    return response.data;
  }
};

export default checkoutService;
