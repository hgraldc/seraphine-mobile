import axiosInstance from './api';

export const shippingService = {
  getShippingDetail: async (id_pesanan) => {
    try {
      const response = await axiosInstance.get(`/pengiriman/pesanan/${id_pesanan}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching shipping detail ${id_pesanan}:`, error);
      throw error;
    }
  },

  cekOngkir: async (payload) => {
    try {
      const response = await axiosInstance.post('/pengiriman/cek-ongkir', payload);
      return response.data;
    } catch (error) {
      console.error('Error checking shipping cost:', error);
      throw error;
    }
  }
};
