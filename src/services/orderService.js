import axiosInstance from './api';

export const orderService = {
  checkout: async (payload) => {
    try {
      const response = await axiosInstance.post('/user/pesanan/checkout', payload);
      return response.data;
    } catch (error) {
      console.error('Error during checkout:', error);
      throw error;
    }
  },
  
  getOrders: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/user/pesanan', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  getOrderDetail: async (id_pesanan) => {
    try {
      const response = await axiosInstance.get(`/user/pesanan/${id_pesanan}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching order detail ${id_pesanan}:`, error);
      throw error;
    }
  },

  cancelOrder: async (id_pesanan) => {
    try {
      const response = await axiosInstance.patch(`/user/pesanan/${id_pesanan}/batal`);
      return response.data;
    } catch (error) {
      console.error(`Error canceling order ${id_pesanan}:`, error);
      throw error;
    }
  }
};
