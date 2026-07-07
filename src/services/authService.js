import axiosInstance from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {
  login: async (email, password) => {
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      const { success, data } = response.data;
      
      if (success && data?.token) {
        // Simpan token ke storage
        await AsyncStorage.setItem('userToken', data.token);
        // Simpan info user
        if (data.user) {
          await AsyncStorage.setItem('userInfo', JSON.stringify(data.user));
        }
      }
      
      return response.data;
    } catch (error) {
      console.error('API Login Error:', error.response?.data || error.message);
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('API Register Error:', error.response?.data || error.message);
      throw error;
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userInfo');
      // Panggil API logout jika diperlukan:
      // await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error('Error saat logout:', error);
      throw error;
    }
  }
};
