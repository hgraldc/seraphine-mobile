import axiosInstance from './api';

export const paymentService = {
  submitPayment: async (payload) => {
    try {
      const response = await axiosInstance.post('/user/pembayaran', payload);
      return response.data;
    } catch (error) {
      console.error('Error submitting payment:', error);
      throw error;
    }
  },

  getPaymentByOrderId: async (id_pesanan) => {
    try {
      const response = await axiosInstance.get(`/user/pembayaran/pesanan/${id_pesanan}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching payment for order ${id_pesanan}:`, error);
      throw error;
    }
  }
};
