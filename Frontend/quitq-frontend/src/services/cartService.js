import api from '../api/api';  

const CartService = {
  addToCart: (productId, quantity) => {
    return api.post('/cart/add', null, {
      params: { productId, quantity }
    });
  },

  getCartItems: () => {
    return api.get('/cart');
  },

  updateQuantity: (productId, quantity) => {
    return api.put('/cart/update', null, {
      params: { productId, quantity }
    });
  },

  removeFromCart: (cartItemId) => {
    return api.delete(`/cart/${cartItemId}`);
  }
};

export default CartService;
