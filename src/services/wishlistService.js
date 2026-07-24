import axiosInstance from './api';

export const wishlistService = {
  getWishlist: async () => {
    try {
      const response = await axiosInstance.get('/wishlist');
      return response.data;
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      throw error;
    }
  },

  toggleWishlist: async (id_produk) => {
    try {
      const response = await axiosInstance.post('/wishlist', { id_produk });
      return response.data;
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      throw error;
    }
  }
};
