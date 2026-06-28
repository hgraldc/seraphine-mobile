import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Bot } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useFormatter } from '../hooks/useFormatter';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;

// ─── Data Produk ───────────────────────────────────────────────────
const PRODUCTS = [
  {
    id: '1',
    name: 'Kain Pahikung Sumba - Motif Kuda',
    category: 'Kain',
    price: 2500000,
    badge: 'Pilihan Ukuran Kustom',
    image: require('../assets/img/hero.jpeg'), // Placeholder
  },
  {
    id: '2',
    name: 'Tas Selempang Tenun Hinggi',
    category: 'Tas',
    price: 850000,
    badge: null,
    image: require('../assets/img/hero.jpeg'), // Placeholder
  },
  {
    id: '3',
    name: 'Kain Hinggi Sumba Klasik',
    category: 'Kain',
    price: 3200000,
    badge: 'Pilihan Ukuran Kustom',
    image: require('../assets/img/hero.jpeg'), // Placeholder
  },
  {
    id: '4',
    name: 'Dompet Tenun Motif Sekong',
    category: 'Aksesori',
    price: 350000,
    badge: null,
    image: require('../assets/img/hero.jpeg'), // Placeholder
  },
];

const CATEGORIES = ['Semua', 'Kain', 'Tas', 'Aksesori'];

// ─── Product Card ──────────────────────────────────────────────────
const ProductCard = ({ item, onPress, formatRupiah }) => (
  <TouchableOpacity
    style={styles.card}
    activeOpacity={0.92}
    onPress={() => onPress(item)}
  >
    <View style={styles.cardImageWrapper}>
      <Image source={item.image} style={styles.cardImage} resizeMode="cover" />
      {item.badge && (
        <View style={styles.badgeWrapper}>
          <Ionicons name="resize-outline" size={10} color="#5C1A1A" />
          <Text style={styles.badgeText}>{item.badge}</Text>
        </View>
      )}
    </View>
    <View style={styles.cardInfo}>
      <Text style={styles.cardName} numberOfLines={2}>{item.name}</Text>
      <Text style={styles.cardPrice}>{formatRupiah(item.price)}</Text>
    </View>
  </TouchableOpacity>
);

// ─── Main KatalogScreen ────────────────────────────────────────────
export default function KatalogScreen() {
  const navigation = useNavigation();
  const { formatRupiah } = useFormatter();
  const [activeCategory, setActiveCategory] = useState('Semua');
  const scrollY = useRef(new Animated.Value(0)).current;

  const filteredProducts =
    activeCategory === 'Semua'
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCategory);

  // Header fade-in saat scroll
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const handleProductPress = (item) =>
    navigation?.navigate('ProductDetail', { product: item });

  // Render grid 2 kolom
  const renderRows = () => {
    const rows = [];
    for (let i = 0; i < filteredProducts.length; i += 2) {
      const left = filteredProducts[i];
      const right = filteredProducts[i + 1];
      rows.push(
        <View key={i} style={styles.productRow}>
          <ProductCard item={left} onPress={handleProductPress} formatRupiah={formatRupiah} />
          {right ? (
            <ProductCard item={right} onPress={handleProductPress} formatRupiah={formatRupiah} />
          ) : (
            <View style={{ width: CARD_WIDTH }} />
          )}
        </View>
      );
    }
    return rows;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAF7" />

      {/* Top bar */}
      <View style={styles.topBar}>
        <Text style={styles.brandName}>CD Seraphine</Text>
        <TouchableOpacity 
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          onPress={() => navigation.navigate('Notification')}
        >
          <Ionicons name="notifications-outline" size={22} color="#2C0A0A" />
        </TouchableOpacity>
      </View>

      {/* Scroll content */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Hero */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>The Collection</Text>
          <Text style={styles.heroSubtitle}>
            Discover the sacred stories woven into every thread.{'\n'}
            Each piece is a testament to Sumba's rich heritage.
          </Text>
        </View>

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryBtn, activeCategory === cat && styles.categoryBtnActive]}
              onPress={() => setActiveCategory(cat)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.categoryBtnText,
                  activeCategory === cat && styles.categoryBtnTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Product Grid */}
        <View style={styles.productGrid}>
          {filteredProducts.length > 0 ? (
            renderRows()
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>Belum ada produk di kategori ini.</Text>
            </View>
          )}
        </View>

        {/* Spacer agar konten tidak tertutup floating cart */}
        <View style={{ height: 100 }} />
      </Animated.ScrollView>

      {/* Floating AI Button */}
      <TouchableOpacity
        style={styles.floatingAiButton}
        onPress={() => navigation.navigate('Chatbot')}
        activeOpacity={0.85}
      >
        <Bot size={30} color="#FAFAF7" strokeWidth={2} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// ─── Styles ────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAF7',
  },
  // Top bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 10,
    backgroundColor: '#FAFAF7',
  },
  brandName: {
    fontFamily: 'Playfair',
    fontSize: 22,
    color: '#5C1A1A',
    letterSpacing: 0.4,
  },

  scrollContent: {
    paddingTop: 0,
  },

  // Hero
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 20,
    paddingBottom: 28,
  },
  heroTitle: {
    fontFamily: 'Playfair',
    fontSize: 28,
    color: '#5C1A1A',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  heroSubtitle: {
    fontFamily: 'Poppins',
    fontSize: 13,
    color: '#7A6A65',
    textAlign: 'center',
    lineHeight: 20,
  },

  // Category
  categoryScroll: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  categoryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: '#D4C4BC',
    backgroundColor: 'transparent',
    marginRight: 8,
  },
  categoryBtnActive: {
    backgroundColor: '#5C1A1A',
    borderColor: '#5C1A1A',
  },
  categoryBtnText: {
    fontFamily: 'PoppinsMedium',
    fontSize: 13,
    color: '#5C1A1A',
  },
  categoryBtnTextActive: {
    color: '#FAFAF7',
  },

  // Grid
  productGrid: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  // Card
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#2C0A0A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  cardImageWrapper: {
    width: '100%',
    height: CARD_WIDTH * 1.1,
    backgroundColor: '#F0E8DF',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  badgeWrapper: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(250, 250, 247, 0.92)',
    borderRadius: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  badgeText: {
    fontFamily: 'Poppins',
    fontSize: 9,
    color: '#5C1A1A',
    marginLeft: 3,
  },
  cardInfo: {
    padding: 10,
    paddingTop: 8,
  },
  cardName: {
    fontFamily: 'PoppinsSemiBold',
    fontSize: 12.5,
    color: '#2C0A0A',
    lineHeight: 18,
    marginBottom: 4,
  },
  cardPrice: {
    fontFamily: 'PoppinsMedium',
    fontSize: 12,
    color: '#5C1A1A',
  },

  // Empty
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontFamily: 'Poppins',
    fontSize: 13,
    color: '#9B8A85',
  },

  // Floating AI Button
  floatingAiButton: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#5C1A1A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5C1A1A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
});
