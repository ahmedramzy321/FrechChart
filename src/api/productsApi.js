import apiClient from './axiosInstance';

export const productsApi = {
  // Get all products with optional filters, sort, search, pagination
  getProducts: async (params = {}) => {
    const { data } = await apiClient.get('/products', { params });
    return data;
  },

  // Get specific product by ID
  getProductById: async (id) => {
    const { data } = await apiClient.get(`/products/${id}`);
    return data;
  },
};
