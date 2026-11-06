import apiClient from './axiosInstance';

export const brandsApi = {
  // Get all brands
  getBrands: async (params = {}) => {
    const { data } = await apiClient.get('/brands', { params });
    return data;
  },

  // Get specific brand by ID
  getBrandById: async (id) => {
    const { data } = await apiClient.get(`/brands/${id}`);
    return data;
  },
};
