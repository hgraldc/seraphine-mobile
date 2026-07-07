import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { weaverService } from '../services/weaverService';
import { useFormatter } from '../hooks/useFormatter';
import Skeleton from '../components/Skeleton';
import { COLORS } from '../theme/colors';

const { maroon: MAROON, textDark: TEXT_DARK, textGrey: TEXT_GREY } = COLORS;
const { width } = Dimensions.get('window');

export default function WeaverDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { formatRupiah } = useFormatter();
  
  const { weaverId } = route.params || {};

  const [weaver, setWeaver] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeaver = async () => {
      try {
        setLoading(true);
        if (weaverId) {
          const res = await weaverService.getWeaverDetail(weaverId);
          if (res.success && res.data) {
            setWeaver(res.data);
          }
        }
      } catch (error) {
        console.error('Error fetching weaver detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeaver();
  }, [weaverId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Skeleton width={24} height={24} borderRadius={12} />
          <Skeleton width={120} height={18} />
          <Skeleton width={24} height={24} borderRadius={12} />
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.heroSection}>
            <View style={styles.imageContainer}>
              <Skeleton width="100%" height="100%" borderRadius={60} />
            </View>
            <Skeleton width={180} height={24} style={{ marginBottom: 8 }} />
            <Skeleton width={120} height={14} style={{ marginBottom: 12 }} />
            <Skeleton width={150} height={24} borderRadius={16} />
          </View>
          <View style={styles.divider} />
          <View style={styles.section}>
            <Skeleton width={120} height={12} style={{ marginBottom: 16 }} />
            <Skeleton width="100%" height={16} style={{ marginBottom: 8 }} />
            <Skeleton width="100%" height={16} style={{ marginBottom: 8 }} />
            <Skeleton width="100%" height={16} style={{ marginBottom: 8 }} />
            <Skeleton width="80%" height={16} />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (!weaver) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontFamily: 'Poppins', color: TEXT_GREY }}>Data penenun tidak ditemukan.</Text>
        <TouchableOpacity style={{ marginTop: 20 }} onPress={() => navigation.goBack()}>
          <Text style={{ color: MAROON, fontFamily: 'PoppinsMedium' }}>Kembali</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top:10, bottom:10, left:10, right:10}}>
          <Ionicons name="arrow-back" size={24} color={TEXT_DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profil Penenun</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* WEAVER PROFILE HERO */}
        <View style={styles.heroSection}>
          <View style={styles.imageContainer}>
            {weaver.foto ? (
              <Image source={{ uri: weaver.foto }} style={styles.profileImage} />
            ) : (
              <View style={styles.profilePlaceholder}>
                <Ionicons name="person" size={50} color="#D4C4BC" />
              </View>
            )}
          </View>
          <Text style={styles.weaverName}>{weaver.nama}</Text>
          <Text style={styles.weaverLocation}>
            <Ionicons name="location-outline" size={12} color={MAROON} /> {weaver.lokasi_desa || 'Sumba'}
          </Text>
          {weaver.nama_kelompok && (
            <View style={styles.groupBadge}>
              <Text style={styles.groupBadgeText}>{weaver.nama_kelompok}</Text>
            </View>
          )}
        </View>

        <View style={styles.divider} />

        {/* ABOUT */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TENTANG PENENUN</Text>
          <Text style={styles.descriptionText}>{weaver.deskripsi || 'Belum ada deskripsi untuk penenun ini.'}</Text>
        </View>

        <View style={styles.divider} />

        {/* PRODUCTS BY THIS WEAVER */}
        {weaver.produk && weaver.produk.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>KARYA DARI {weaver.nama.toUpperCase()}</Text>
            <View style={styles.productsGrid}>
              {weaver.produk.map((prod) => (
                <TouchableOpacity 
                  key={prod.id_produk} 
                  style={styles.productCard}
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate('ProductDetail', { product: prod })}
                >
                  <View style={styles.productImageContainer}>
                    {prod.gambar ? (
                      <Image source={{ uri: prod.gambar }} style={styles.productImage} />
                    ) : (
                      <View style={[styles.productImage, { backgroundColor: '#F0EBE6' }]} />
                    )}
                  </View>
                  <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={2}>{prod.nama_produk}</Text>
                    <Text style={styles.productPrice}>{formatRupiah(prod.harga)}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAF7' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EBE6',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: { fontFamily: 'Playfair', fontSize: 18, color: TEXT_DARK },
  scrollContent: { paddingBottom: 40 },
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#F0EBE6',
  },
  profileImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  profilePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FAFAF7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weaverName: { fontFamily: 'Playfair', fontSize: 24, color: TEXT_DARK, marginBottom: 6 },
  weaverLocation: { fontFamily: 'PoppinsMedium', fontSize: 13, color: TEXT_GREY, marginBottom: 12 },
  groupBadge: {
    backgroundColor: '#F5EAE6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  groupBadgeText: { fontFamily: 'PoppinsMedium', fontSize: 12, color: MAROON },
  divider: { height: 8, backgroundColor: '#F0EBE6' },
  section: { padding: 24, backgroundColor: '#FFFFFF' },
  sectionTitle: {
    fontFamily: 'PoppinsSemiBold',
    fontSize: 12,
    color: TEXT_GREY,
    letterSpacing: 1,
    marginBottom: 16,
  },
  descriptionText: { fontFamily: 'Poppins', fontSize: 14, color: TEXT_DARK, lineHeight: 24 },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: (width - 48 - 12) / 2, // 2 columns, padding 24 on sides, gap 12
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F0EBE6',
    overflow: 'hidden',
  },
  productImageContainer: {
    width: '100%',
    height: width * 0.45,
  },
  productImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  productInfo: { padding: 10 },
  productName: { fontFamily: 'PoppinsMedium', fontSize: 12, color: TEXT_DARK, marginBottom: 4 },
  productPrice: { fontFamily: 'PoppinsSemiBold', fontSize: 12, color: MAROON },
});
