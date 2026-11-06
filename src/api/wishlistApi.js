import apiClient from './axiosInstance';

export const wishlistApi = {
  // Get logged-in user wishlist
  getWishlist: async () => {
    const { data } = await apiClient.get('/wishlist');
    return data;
  },

  // Add product to wishlist
  addToWishlist: async (productId) => {
    const { data } = await apiClient.post('/wishlist', { productId });
    return data;
  },

  // Remove product from wishlist
  removeFromWishlist: async (productId) => {
    const { data } = await apiClient.delete(`/wishlist/${productId}`);
    return data;
  },
};
