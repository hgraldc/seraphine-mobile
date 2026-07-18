import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base size (umumnya menggunakan ukuran iPhone 11/X atau sejenisnya)
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

/**
 * Mengubah skala berdasarkan lebar layar. Cocok untuk margin, padding horizontal, atau width.
 */
export const scale = size => (SCREEN_WIDTH / guidelineBaseWidth) * size;

/**
 * Mengubah skala berdasarkan tinggi layar. Cocok untuk margin, padding vertikal, atau height.
 */
export const verticalScale = size => (SCREEN_HEIGHT / guidelineBaseHeight) * size;

/**
 * Mengubah skala secara moderat (tidak terlalu besar di layar besar).
 * Cocok untuk fontSize atau icon size.
 */
export const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

/**
 * Mengubah persentase menjadi ukuran pixel berdasarkan lebar layar.
 */
export const wp = widthPercent => {
  const elemWidth = typeof widthPercent === "number" ? widthPercent : parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel((SCREEN_WIDTH * elemWidth) / 100);
};

/**
 * Mengubah persentase menjadi ukuran pixel berdasarkan tinggi layar.
 */
export const hp = heightPercent => {
  const elemHeight = typeof heightPercent === "number" ? heightPercent : parseFloat(heightPercent);
  return PixelRatio.roundToNearestPixel((SCREEN_HEIGHT * elemHeight) / 100);
};
