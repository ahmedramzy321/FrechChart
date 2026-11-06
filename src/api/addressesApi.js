import apiClient from './axiosInstance';

export const addressesApi = {
  // Get all saved addresses for user
  getAddresses: async () => {
    const { data } = await apiClient.get('/addresses');
    return data;
  },

  // Add new address
  addAddress: async ({ name, details, phone, city }) => {
    const { data } = await apiClient.post('/addresses', {
      name,
      details,
      phone,
      city,
    });
    return data;
  },

  // Delete saved address
  deleteAddress: async (addressId) => {
    const { data } = await apiClient.delete(`/addresses/${addressId}`);
    return data;
  },
};
