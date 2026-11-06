import apiClient from './axiosInstance';

export const authApi = {
  // Sign In / Login
  signIn: async (credentials) => {
    const { data } = await apiClient.post('/auth/signin', credentials);
    return data;
  },

  // Sign Up / Register
  signUp: async (userData) => {
    const { data } = await apiClient.post('/auth/signup', userData);
    return data;
  },

  // Forgot Password - Step 1: Send reset code to email
  forgotPassword: async (email) => {
    const { data } = await apiClient.post('/auth/forgotPasswords', { email });
    return data;
  },

  // Forgot Password - Step 2: Verify reset code
  verifyResetCode: async (resetCode) => {
    const { data } = await apiClient.post('/auth/verifyResetCode', { resetCode });
    return data;
  },

  // Forgot Password - Step 3: Reset password with email & newPassword
  resetPassword: async ({ email, newPassword }) => {
    const { data } = await apiClient.put('/auth/resetPassword', { email, newPassword });
    return data;
  },

  // Change Password for authenticated user
  changePassword: async ({ currentPassword, password, rePassword }) => {
    const { data } = await apiClient.put('/users/changeMyPassword', {
      currentPassword,
      password,
      rePassword,
    });
    return data;
  },
};
