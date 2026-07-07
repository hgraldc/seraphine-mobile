import axiosInstance from './api';

export const reviewService = {
  getReviewsByProduct: async (id_produk) => {
    try {
      const response = await axiosInstance.get(`/reviews/produk/${id_produk}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching reviews for product ${id_produk}:`, error);
      throw error;
    }
  },

  addReview: async (payload) => {
    try {
      const response = await axiosInstance.post('/reviews', payload);
      return response.data;
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  },

  deleteReview: async (id_review) => {
    try {
      const response = await axiosInstance.delete(`/reviews/${id_review}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting review ${id_review}:`, error);
      throw error;
    }
  }
};
