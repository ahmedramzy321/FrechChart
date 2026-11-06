import apiClient from './axiosInstance';

export const cartApi = {
  // Get logged-in user cart
  getCart: async () => {
    const { data } = await apiClient.get('/cart');
    return data;
  },

  // Add product to cart
  addToCart: async (productId) => {
    const { data } = await apiClient.post('/cart', { productId });
    return data;
  },

  // Update product quantity in cart
  updateQuantity: async (productId, count) => {
    const { data } = await apiClient.put(`/cart/${productId}`, { count });
    return data;
  },

  // Remove single item from cart
  removeItem: async (productId) => {
    const { data } = await apiClient.delete(`/cart/${productId}`);
    return data;
  },

  // Clear all items in cart
  clearCart: async () => {
    const { data } = await apiClient.delete('/cart');
    return data;
  },
};
