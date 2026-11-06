import apiClient from './axiosInstance';

export const ordersApi = {
  // Create Cash on Delivery order
  createCashOrder: async (cartId, shippingAddress) => {
    const { data } = await apiClient.post(`/orders/${cartId}`, {
      shippingAddress,
    });
    return data;
  },

  // Create Online Stripe Checkout Session
  createOnlineSession: async (cartId, shippingAddress, returnUrl) => {
    const { data } = await apiClient.post(
      `/orders/checkout-session/${cartId}?url=${encodeURIComponent(returnUrl)}`,
      {
        shippingAddress,
      }
    );
    return data;
  },

  // Get orders for specific user
  getUserOrders: async (userId) => {
    const { data } = await apiClient.get(`/orders/user/${userId}`);
    return data;
  },
};
