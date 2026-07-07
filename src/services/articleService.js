import axiosInstance from './api';

export const articleService = {
  getArticles: async () => {
    try {
      const response = await axiosInstance.get('/artikel');
      return response.data;
    } catch (error) {
      console.error('Error fetching articles:', error);
      throw error;
    }
  },

  getArticleDetail: async (id_artikel) => {
    try {
      const response = await axiosInstance.get(`/artikel/${id_artikel}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching article detail ${id_artikel}:`, error);
      throw error;
    }
  }
};
