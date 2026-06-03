import { useCallback } from 'react';

/**
 * Hook untuk menyediakan fungsi pemformatan data.
 */
export const useFormatter = () => {
  /**
   * Mengformat angka menjadi format mata uang Rupiah (IDR).
   * @param {number} amount - Angka yang akan diformat.
   * @returns {string} - Hasil format (contoh: Rp 1.000.000)
   */
  const formatRupiah = useCallback((amount) => {
    if (amount === undefined || amount === null) return 'Rp 0';
    return 'Rp ' + amount.toLocaleString('id-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }, []);

  return { formatRupiah };
};
