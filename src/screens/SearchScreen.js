import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { productService } from '../services/productService';
import { useFormatter } from '../hooks/useFormatter';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;

export default function SearchScreen() {
  const navigation = useNavigation();
  const { formatRupiah } = useFormatter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Debounce effect to avoid calling API on every keystroke immediately
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        handleSearch(searchQuery);
      } else {
        setProducts([]);
        setHasSearched(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearch = async (query) => {
    try {
      setLoading(true);
      setHasSearched(true);
      
      const params = {
        search: query,
        limit: 20,
        page: 1,
        // No id_kategori here so it searches globally
      };
      
      const response = await productService.getProducts(params);
      if (response.success && response.data) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error("Gagal melakukan pencarian:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductPress = (item) => {
    navigation.navigate('ProductDetail', { product: item });
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.92}
      onPress={() => handleProductPress(item)}
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAF7" />

      {/* Header with Search Bar */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color="#3A0000" />
        </TouchableOpacity>
        
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#9A8C8C" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari koleksi kain, syal, dll..."
            placeholderTextColor="#9A8C8C"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus={true}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <Ionicons name="close-circle" size={18} color="#9A8C8C" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {loading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color="#5C1A1A" />
            <Text style={styles.loadingText}>Mencari produk...</Text>
          </View>
        ) : hasSearched && products.length === 0 ? (
          <View style={styles.centerContent}>
            <Ionicons name="search-outline" size={60} color="#D4C4B8" style={{ marginBottom: 16 }} />
            <Text style={styles.emptyTitle}>Produk Tidak Ditemukan</Text>
            <Text style={styles.emptyText}>Coba gunakan kata kunci lain untuk mencari.</Text>
          </View>
        ) : !hasSearched ? (
          <View style={styles.centerContent}>
            <Ionicons name="color-palette-outline" size={60} color="#D4C4B8" style={{ marginBottom: 16 }} />
            <Text style={styles.emptyTitle}>Temukan Karya Indah</Text>
            <Text style={styles.emptyText}>Ketik nama produk di atas untuk memulai pencarian.</Text>
          </View>
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => item.id_produk.toString()}
            renderItem={renderProduct}
            numColumns={2}
            contentContainerStyle={styles.productList}
            columnWrapperStyle={styles.rowWrapper}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ECE4DD',
  },
  backButton: {
    padding: 4,
    marginRight: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEE7DF',
    borderRadius: 999,
    paddingHorizontal: 16,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Poppins',
    fontSize: 14,
    color: '#2C0A0A',
    height: '100%',
    paddingVertical: 0,
  },
  content: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  loadingText: {
    fontFamily: 'Poppins',
    fontSize: 14,
    color: '#7A6A65',
    marginTop: 12,
  },
  emptyTitle: {
    fontFamily: 'Playfair',
    fontSize: 20,
    color: '#3A0000',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontFamily: 'Poppins',
    fontSize: 13,
    color: '#7A6A65',
    textAlign: 'center',
    lineHeight: 20,
  },
  productList: {
    padding: 16,
    paddingBottom: 40,
  },
  rowWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
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
});
