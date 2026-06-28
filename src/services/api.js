import axios from 'axios';

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
    // Contoh: Ambil token dari storage jika ada
    // const token = await AsyncStorage.getItem('userToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global error seperti 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      console.log('Token expired atau tidak valid');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
