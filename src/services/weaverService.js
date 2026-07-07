import axiosInstance from './api';

export const weaverService = {
  getWeavers: async () => {
    try {
      const response = await axiosInstance.get('/penenun');
      return response.data;
    } catch (error) {
      console.error('Error fetching weavers:', error);
      throw error;
    }
  },

  getWeaverDetail: async (id_penenun) => {
    try {
      const response = await axiosInstance.get(`/penenun/${id_penenun}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching weaver detail ${id_penenun}:`, error);
      throw error;
    }
  }
};
