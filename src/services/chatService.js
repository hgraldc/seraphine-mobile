import axiosInstance from './api';

export const chatService = {
  sendMessage: async (message, history = []) => {
    try {
      const payload = {
        message,
        history,
      };
      // axiosInstance will automatically attach token if logged in
      const response = await axiosInstance.post('/chat', payload);
      return response.data;
    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      throw error;
    }
  },
};
