import apiClient from './axiosInstance';

export const subcategoriesApi = {
  // Get all subcategories
  getSubcategories: async (params = {}) => {
    const { data } = await apiClient.get('/subcategories', { params });
    return data;
  },

  // Get specific subcategory by ID
  getSubcategoryById: async (id) => {
    const { data } = await apiClient.get(`/subcategories/${id}`);
    return data;
  },
};
