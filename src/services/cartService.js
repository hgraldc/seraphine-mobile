import axiosInstance from './api';

export const cartService = {
  // 1. Tambah Produk ke Keranjang
  addToCart: async (data) => {
    try {
      const response = await axiosInstance.post('/keranjang', data);
      return response.data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  // 2. Lihat Isi Keranjang Sendiri
  getCart: async () => {
    try {
      const response = await axiosInstance.get('/keranjang');
      return response.data;
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  },

  // 3. Update Jumlah Item di Keranjang
  updateCartItem: async (id, jumlah) => {
    try {
      const response = await axiosInstance.patch(`/keranjang/${id}`, { jumlah });
      return response.data;
    } catch (error) {
      console.error(`Error updating cart item ${id}:`, error);
      throw error;
    }
  },

  // 4. Hapus Item dari Keranjang
  removeCartItem: async (id) => {
    try {
      const response = await axiosInstance.delete(`/keranjang/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error removing cart item ${id}:`, error);
      throw error;
    }
  }
};
