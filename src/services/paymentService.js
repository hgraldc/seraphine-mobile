import axiosInstance from './api';

export const paymentService = {
  submitPayment: async (payload) => {
    try {
      const response = await axiosInstance.post('/pembayaran', payload);
      return response.data;
    } catch (error) {
      console.error('Error submitting payment:', error);
      throw error;
    }
  }
};
