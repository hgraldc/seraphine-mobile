import axiosInstance from './api';

export const notificationService = {
  getNotifications: async (params = { page: 1, limit: 10 }) => {
    try {
      const response = await axiosInstance.get('/notifikasi', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  getUnreadCount: async () => {
    try {
      const response = await axiosInstance.get('/notifikasi/unread-count');
      return response.data;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  },

  readAll: async () => {
    try {
      const response = await axiosInstance.patch('/notifikasi/read-all');
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  readOne: async (id) => {
    try {
      const response = await axiosInstance.patch(`/notifikasi/${id}/read`);
      return response.data;
    } catch (error) {
      console.error(`Error marking notification ${id} as read:`, error);
      throw error;
    }
  }
};
