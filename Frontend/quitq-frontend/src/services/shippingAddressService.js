import api from '../api/api';  

const shippingAddressService = {
  getAddresses: async () => {
    const response = await api.get('/shipping-addresses');
    return response.data;
  },

  addAddress: async (address) => {
    const payload = {
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || '',
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
    };
    const response = await api.post('/shipping-addresses', payload);
    return response.data;
  },

  updateAddress: async (id, address) => {
    const response = await api.put(`/shipping-addresses/${id}`, address);
    return response.data;
  },

  deleteAddress: async (id) => {
    const response = await api.delete(`/shipping-addresses/${id}`);
    return response.data;
  },
};

export default shippingAddressService;
