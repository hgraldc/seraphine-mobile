import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { navigate } from '../navigation/navigationRef';

// Mengambil URL dari .env
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.example.com'; 

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Anda bisa menambahkan interceptor di sini untuk handle token atau error secara global
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      // Ambil token dari storage jika ada
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Gagal mengambil token dari storage:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    // Helper to auto-inject `gambar` from `media` array so frontend components don't crash or show blank images
    const injectGambar = (data) => {
      if (!data || typeof data !== 'object') return;
      if (Array.isArray(data)) {
        data.forEach(injectGambar);
      } else {
        if (data.media && Array.isArray(data.media) && data.media.length > 0) {
          const sorted = [...data.media].sort((a, b) => (a.urutan || 0) - (b.urutan || 0));
          if (!data.gambar && sorted[0] && sorted[0].url) {
            data.gambar = sorted[0].url;
          }
        }
        Object.values(data).forEach(val => {
          if (val && typeof val === 'object') {
            injectGambar(val);
          }
        });
      }
    };

    if (response.data) {
      injectGambar(response.data);
    }
    return response;
  },
  async (error) => {
    // Handle global error seperti 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      console.log('Token expired atau tidak valid');
      
      try {
        const token = await AsyncStorage.getItem('userToken');
        // Jika token ada, berarti sesi memang habis (bukan sekadar guest yang ditolak)
        if (token) {
          await AsyncStorage.removeItem('userToken');
          await AsyncStorage.removeItem('userInfo');
          
          Alert.alert(
            "Sesi Habis",
            "Sesi Anda telah habis. Silakan login kembali untuk melanjutkan.",
            [
              { text: "OK", onPress: () => navigate('Login') }
            ],
            { cancelable: false }
          );
        }
      } catch (e) {
        console.error('Error handling 401', e);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
