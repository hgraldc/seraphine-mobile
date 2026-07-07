import axiosInstance from './api';

export const userService = {
  getProfile: async () => {
    try {
      const response = await axiosInstance.get('/users/me');
      return response.data;
    } catch (error) {
      console.error('Error getting profile:', error);
      throw error;
    }
  },

  updateProfile: async (userData) => {
    try {
      const response = await axiosInstance.patch('/users/me', userData);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }
};
