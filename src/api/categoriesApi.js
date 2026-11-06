import apiClient from './axiosInstance';

export const categoriesApi = {
  // Get all categories
  getCategories: async (params = {}) => {
    const { data } = await apiClient.get('/categories', { params });
    return data;
  },

  // Get single category by ID
  getCategoryById: async (id) => {
    const { data } = await apiClient.get(`/categories/${id}`);
    return data;
  },

  // Get subcategories on a specific category
  getCategorySubcategories: async (categoryId) => {
    const { data } = await apiClient.get(`/categories/${categoryId}/subcategories`);
    return data;
  },
};
