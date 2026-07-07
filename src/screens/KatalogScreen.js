import React, { useState, useEffect, useRef } from 'react';
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
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Bot } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useFormatter } from '../hooks/useFormatter';
import { categoryService } from '../services/categoryService';
import { productService } from '../services/productService';
import Skeleton from '../components/Skeleton';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;

function ProductSkeleton() {
  return (
    <View style={styles.card}>
      <Skeleton width="100%" height={240} borderRadius={8} />
      <View style={{ marginTop: 12, paddingHorizontal: 4 }}>
        <Skeleton width="90%" height={16} />
        <Skeleton width="50%" height={14} style={{ marginTop: 8 }} />
      </View>
    </View>
  );
}



const ProductCard = ({ item, onPress, formatRupiah }) => (
  <TouchableOpacity
    style={styles.card}
    activeOpacity={0.92}
    onPress={() => onPress(item)}
  >
    <View style={styles.cardImageWrapper}>
      {item.gambar ? (
        <Image source={{ uri: item.gambar }} style={styles.cardImage} resizeMode="cover" />
      ) : (
        <View style={[styles.cardImage, { backgroundColor: '#D4C4B8' }]} />
      )}
      {item.stok > 0 && (
        <View style={styles.badgeWrapper}>
          <Ionicons name="pricetag-outline" size={10} color="#5C1A1A" />
          <Text style={styles.badgeText}>Sisa Stok: {item.stok}</Text>
        </View>
      )}
    </View>
    <View style={styles.cardInfo}>
      <Text style={styles.cardName} numberOfLines={2}>{item.nama_produk}</Text>
      <Text style={styles.cardPrice}>{formatRupiah(item.harga)}</Text>
    </View>
  </TouchableOpacity>
);

export default function KatalogScreen() {
  const navigation = useNavigation();
  const { formatRupiah } = useFormatter();
  const [activeCategoryId, setActiveCategoryId] = useState('semua');
  const [categories, setCategories] = useState([{ id_kategori: 'semua', nama_kategori: 'Semua' }]);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      if (response.success && response.data) {
        setCategories([{ id_kategori: 'semua', nama_kategori: 'Semua' }, ...response.data]);
      }
    } catch (error) {
      console.error("Gagal memuat kategori:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const params = { limit: 10, page: 1 };
      if (activeCategoryId !== "semua") {
        params.id_kategori = activeCategoryId;
      }
      const response = await productService.getProducts(params);
      if (response.success && response.data) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error("Gagal memuat produk:", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [activeCategoryId]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchCategories(), fetchProducts()]);
    setRefreshing(false);
  };

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
    if (loadingProducts) {
      return (
        <View style={{ padding: 20 }}>
          <View style={styles.productRow}>
            <ProductSkeleton />
            <ProductSkeleton />
          </View>
          <View style={styles.productRow}>
            <ProductSkeleton />
            <ProductSkeleton />
          </View>
        </View>
      );
    }
    
    if (products.length === 0) {
      return (
        <View style={{ padding: 20, alignItems: 'center' }}>
          <Text style={{ fontFamily: 'Poppins', color: '#7A6A65' }}>Belum ada produk di kategori ini.</Text>
        </View>
      );
    }

    const rows = [];
    for (let i = 0; i < products.length; i += 2) {
      const left = products[i];
      const right = products[i + 1];
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#5C1A1A"]} />
        }
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
          {categories.map((cat) => {
            const isActive = activeCategoryId === cat.id_kategori;
            return (
              <TouchableOpacity
                key={cat.id_kategori.toString()}
                style={[styles.categoryBtn, isActive && styles.categoryBtnActive]}
                onPress={() => setActiveCategoryId(cat.id_kategori)}
                activeOpacity={0.8}
              >
                <Text style={[styles.categoryBtnText, isActive && styles.categoryBtnTextActive]}>
                  {cat.nama_kategori}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Product Grid */}
        <View style={styles.productGrid}>
          {renderRows()}
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

  productGrid: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

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

  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontFamily: 'Poppins',
    fontSize: 13,
    color: '#9B8A85',
  },

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
