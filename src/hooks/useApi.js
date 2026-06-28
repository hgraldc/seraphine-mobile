import { useState, useCallback } from 'react';
import axiosInstance from '../services/api';

/**
 * Custom hook untuk memudahkan pemanggilan API menggunakan Axios.
 * Memberikan state loading, error, dan data secara otomatis.
 */
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const request = useCallback(async (config) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance(config);
      setData(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Something went wrong';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    data,
    request,
    // Helper methods
    get: (url, config) => request({ ...config, method: 'GET', url }),
    post: (url, data, config) => request({ ...config, method: 'POST', url, data }),
    put: (url, data, config) => request({ ...config, method: 'PUT', url, data }),
    del: (url, config) => request({ ...config, method: 'DELETE', url }),
  };
};

export default useApi;
