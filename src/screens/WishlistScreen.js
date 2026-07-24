import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useFormatter } from '../hooks/useFormatter';
import { Heart } from 'lucide-react-native';
import { wishlistService } from '../services/wishlistService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;

const ProductCard = ({ item, onPress, onRemove, formatRupiah }) => (
  <View style={styles.card}>
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={() => onPress(item)}
    >
      <View style={styles.cardImageWrapper}>
        {item.gambar ? (
          <Image source={{ uri: item.gambar }} style={styles.cardImage} resizeMode="cover" />
        ) : (
          <View style={[styles.cardImage, { backgroundColor: '#D4C4B8' }]} />
        )}
        
        {/* Remove from wishlist button */}
        <TouchableOpacity 
          style={styles.removeBtn}
          onPress={() => onRemove(item.id_produk)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Heart fill="#5C1A1A" color="#5C1A1A" size={16} />
        </TouchableOpacity>

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
  </View>
);

export default function WishlistScreen() {
  const navigation = useNavigation();
  const { formatRupiah } = useFormatter();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await wishlistService.getWishlist();
      if (res && res.success) {
        // Asumsi data array of product ada di res.data
        // Jika response API mengembalikan produk di dalam properti produk, sesuaikan struktur mappingnya.
        // Berdasarkan endpoint umumnya akan mengembalikan daftar produk.
        setWishlist(res.data || []);
      }
    } catch (error) {
      console.error("Gagal memuat wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchWishlist();
    }, [])
  );

  const handleRemove = async (productId) => {
    try {
      // Optimistic update UI
      setWishlist(prev => prev.filter(item => item.id_produk !== productId));
      
      const res = await wishlistService.toggleWishlist(productId);
      if (!res.success) {
        // Rollback on failure
        fetchWishlist();
      }
    } catch (error) {
      console.error("Gagal menghapus dari wishlist:", error);
      fetchWishlist();
    }
  };

  const handleProductPress = (item) => {
    navigation.navigate('ProductDetail', { product: item });
  };

  const renderRows = () => {
    if (loading) return null;

    if (wishlist.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="heart-dislike-outline" size={60} color="#D4C4BC" style={{ marginBottom: 16 }} />
          <Text style={styles.emptyStateTitle}>Belum Ada Favorit</Text>
          <Text style={styles.emptyStateText}>
            Simpan produk yang Anda sukai di sini untuk dilihat lagi nanti.
          </Text>
          <TouchableOpacity 
            style={styles.browseBtn}
            onPress={() => navigation.navigate('MainTabs', { screen: 'Catalog' })}
          >
            <Text style={styles.browseBtnText}>Lihat Koleksi</Text>
          </TouchableOpacity>
        </View>
      );
    }

    const rows = [];
    for (let i = 0; i < wishlist.length; i += 2) {
      const left = wishlist[i];
      const right = wishlist[i + 1];
      rows.push(
        <View key={i} style={styles.productRow}>
          <ProductCard item={left} onPress={handleProductPress} onRemove={handleRemove} formatRupiah={formatRupiah} />
          {right ? (
            <ProductCard item={right} onPress={handleProductPress} onRemove={handleRemove} formatRupiah={formatRupiah} />
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

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={24} color="#1A0A0A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Favorit Saya</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.productGrid}>
          {renderRows()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAF7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FAFAF7',
    borderBottomWidth: 1,
    borderBottomColor: '#F0E8DF',
  },
  backBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontFamily: 'Playfair',
    fontSize: 20,
    color: '#1A0A0A',
  },
  scrollContent: {
    paddingBottom: 40,
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
  removeBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 6,
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
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
    marginTop: 40,
  },
  emptyStateTitle: {
    fontFamily: 'Playfair',
    fontSize: 22,
    color: '#1A0A0A',
    marginBottom: 8,
  },
  emptyStateText: {
    fontFamily: 'Poppins',
    fontSize: 13,
    color: '#7A6A65',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  browseBtn: {
    backgroundColor: '#5C1A1A',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseBtnText: {
    fontFamily: 'PoppinsMedium',
    fontSize: 14,
    color: '#FFFFFF',
  },
});
