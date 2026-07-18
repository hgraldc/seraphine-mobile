import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Image,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFormatter } from '../hooks/useFormatter';
import { productService } from '../services/productService';
import { cartService } from '../services/cartService';
import { reviewService } from '../services/reviewService';
import Skeleton from '../components/Skeleton';
import CustomAlert from '../components/CustomAlert';

import { COLORS } from '../theme/colors';

const { 
  maroon: MAROON, 
  lightPink: LIGHT_PINK,
  textDark: TEXT_DARK, 
  textGrey: TEXT_GREY, 
  borderColor: BORDER_COLOR
} = COLORS;

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { formatRupiah } = useFormatter();

  const productParam = route.params?.product;

  const [selectedSize, setSelectedSize] = useState('M');
  const [customNote, setCustomNote] = useState('');
  
  const [product, setProduct] = useState(productParam || null);
  const [loading, setLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({});

  useEffect(() => {
    if (productParam?.id_produk) {
      fetchReviews(productParam.id_produk);
    }
  }, [productParam]);

  const fetchReviews = async (productId) => {
    try {
      const res = await reviewService.getReviewsByProduct(productId);
      if (res.success && res.data) {
        setReviews(res.data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleDeleteReview = (id_review) => {
    setAlertConfig({
      type: 'confirm',
      title: 'Hapus Ulasan',
      message: 'Apakah Anda yakin ingin menghapus ulasan ini?',
      cancelText: 'Batal',
      confirmText: 'Hapus',
      onCancel: () => setAlertVisible(false),
      onConfirm: async () => {
        setAlertVisible(false);
        try {
          const res = await reviewService.deleteReview(id_review);
          if (res.success) {
            setTimeout(() => {
              setAlertConfig({
                type: 'success',
                title: 'Berhasil',
                message: 'Ulasan berhasil dihapus',
                confirmText: 'OK',
                onConfirm: () => setAlertVisible(false),
                onCancel: null,
              });
              setAlertVisible(true);
              if (product?.id_produk) {
                fetchReviews(product.id_produk);
              }
            }, 300); // slight delay to allow previous modal to close
          }
        } catch (error) {
          setTimeout(() => {
            setAlertConfig({
              type: 'error',
              title: 'Gagal',
              message: 'Gagal menghapus ulasan',
              confirmText: 'OK',
              onConfirm: () => setAlertVisible(false),
              onCancel: null,
            });
            setAlertVisible(true);
          }, 300);
        }
      }
    });
    setAlertVisible(true);
  };

  const sizes = ['S', 'M', 'L', 'Custom Size'];

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      setIsAddingToCart(true);
      const payload = {
        id_produk: product.id_produk,
        jumlah: 1,
        varian: selectedSize === 'Custom Size' ? (customNote ? `Custom: ${customNote}` : 'Custom Size') : `Ukuran: ${selectedSize}`
      };
      
      const res = await cartService.addToCart(payload);
      if (res.success) {
        setAlertConfig({
          type: 'success',
          title: 'Sukses',
          message: 'Produk berhasil ditambahkan ke keranjang',
          cancelText: 'Lanjut Belanja',
          confirmText: 'Lihat Keranjang',
          onCancel: () => setAlertVisible(false),
          onConfirm: () => {
            setAlertVisible(false);
            navigation.navigate('MainTabs', { screen: 'Cart' });
          }
        });
        setAlertVisible(true);
      } else {
        setAlertConfig({
          type: 'error',
          title: 'Gagal',
          message: res.message || 'Gagal menambahkan ke keranjang',
          confirmText: 'OK',
          onConfirm: () => setAlertVisible(false),
          onCancel: null,
        });
        setAlertVisible(true);
      }
    } catch (error) {
      console.error('Error add to cart:', error);
      setAlertConfig({
        type: 'error',
        title: 'Error',
        message: 'Terjadi kesalahan saat menambahkan ke keranjang',
        confirmText: 'OK',
        onConfirm: () => setAlertVisible(false),
        onCancel: null,
      });
      setAlertVisible(true);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBeliLangsung = () => {
    if (!product) return;

    const itemPayload = {
      id_produk: product.id_produk,
      jumlah: 1,
      ukuran: selectedSize
    };

    if (selectedSize === 'Custom Size') {
      itemPayload.is_custom = true;
      itemPayload.custom = {
        catatan_khusus: customNote
      };
    }

    navigation.navigate('Checkout', {
      fromCart: false,
      directBuyItems: [itemPayload],
      totalDirectPrice: product.harga
    });
  };

  useEffect(() => {
    if (productParam?.id_produk) {
      const fetchDetail = async () => {
        try {
          setLoading(true);
          const response = await productService.getProductById(productParam.id_produk);
          if (response.success && response.data) {
            setProduct(response.data);
          }
        } catch (error) {
          console.error("Failed to load product details", error);
        } finally {
          setLoading(false);
        }
      };
      fetchDetail();
    } else {
      setLoading(false);
    }
  }, [productParam]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Skeleton width={24} height={24} borderRadius={12} />
          <Skeleton width={120} height={20} />
          <Skeleton width={24} height={24} borderRadius={12} />
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Skeleton width="100%" height={380} borderRadius={0} />
          <View style={{ flexDirection: 'row', padding: 20, gap: 12 }}>
            <Skeleton width={60} height={60} borderRadius={8} />
            <Skeleton width={60} height={60} borderRadius={8} />
            <Skeleton width={60} height={60} borderRadius={8} />
          </View>
          <View style={{ paddingHorizontal: 20 }}>
            <Skeleton width="80%" height={24} style={{ marginBottom: 12 }} />
            <Skeleton width={120} height={20} style={{ marginBottom: 16 }} />
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Skeleton width={100} height={30} borderRadius={16} />
              <Skeleton width={120} height={30} borderRadius={16} />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontFamily: 'Poppins', color: TEXT_GREY }}>Produk tidak ditemukan</Text>
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
        <Text style={styles.headerTitle}>Detail Produk</Text>
        <TouchableOpacity hitSlop={{top:10, bottom:10, left:10, right:10}}>
          <Ionicons name="share-social-outline" size={24} color={TEXT_DARK} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* MAIN IMAGE */}
        <View style={styles.imageContainer}>
          {selectedImage || product.gambar ? (
            <Image source={{ uri: selectedImage || product.gambar }} style={styles.mainImage} resizeMode="cover" />
          ) : (
            <View style={styles.mainImagePlaceholder} />
          )}
          <TouchableOpacity style={styles.zoomButton}>
            <Ionicons name="search" size={18} color={TEXT_DARK} />
          </TouchableOpacity>
        </View>

        {/* THUMBNAILS */}
        <View style={styles.thumbnailRow}>
          {product.media && product.media.length > 0 ? (
            product.media.map((item, index) => (
              <TouchableOpacity 
                key={item.id_media || index} 
                style={styles.thumbnailWrapper}
                onPress={() => setSelectedImage(item.url)}
              >
                <Image source={{ uri: item.url }} style={styles.thumbnailImage} resizeMode="cover" />
              </TouchableOpacity>
            ))
          ) : (
            <TouchableOpacity style={styles.thumbnailWrapper}>
              {product.gambar ? (
                <Image source={{ uri: product.gambar }} style={styles.thumbnailImage} resizeMode="cover" />
              ) : (
                <View style={styles.thumbnailPlaceholder} />
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* PRODUCT INFO */}
        <View style={styles.productInfo}>
          <View style={styles.titleRow}>
            <Text style={styles.productTitle}>{product.nama_produk}</Text>
            <TouchableOpacity hitSlop={{top:10, bottom:10, left:10, right:10}}>
              <Ionicons name="heart-outline" size={26} color={TEXT_DARK} />
            </TouchableOpacity>
          </View>
          <Text style={styles.productPrice}>{formatRupiah(product.harga)}</Text>
          <Text style={{ fontFamily: 'PoppinsMedium', color: MAROON, marginTop: 4, fontSize: 13 }}>Sisa Stok: {product.stok}</Text>

          {/* TAGS */}
          <View style={styles.tagRow}>
            <View style={styles.tag}>
              <Ionicons name="sparkles-outline" size={12} color={MAROON} />
              <Text style={styles.tagText}>{product.kategori?.nama_kategori || 'Kategori'}</Text>
            </View>
            <View style={styles.tag}>
              <Ionicons name="star" size={12} color="#F59E0B" />
              <Text style={styles.tagText}>
                {product.rating?.average || 0} ({product.rating?.count || 0} Ulasan)
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* MAKNA FILOSOFIS & DESKRIPSI */}
        <View style={styles.section}>
          {loading ? (
            <ActivityIndicator size="small" color={MAROON} />
          ) : (
            <>
              <Text style={styles.sectionTitle}>DESKRIPSI KAIN</Text>
              <Text style={styles.paragraph}>{product.deskripsi || '-'}</Text>
              
              <Text style={[styles.sectionTitle, { marginTop: 24 }]}>MAKNA FILOSOFIS</Text>
              <Text style={styles.paragraph}>{product.makna_motif || '-'}</Text>
            </>
          )}
        </View>

        {/* PENENUN INFO */}
        {!loading && (product.penenun || product.id_penenun) && (
          <TouchableOpacity 
            style={styles.weaverCard}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('WeaverDetail', { weaverId: product.penenun?.id_penenun || product.id_penenun })}
          >
            <View style={styles.weaverAvatarPlaceholder}>
              {product.penenun?.foto ? (
                <Image source={{ uri: product.penenun.foto }} style={{width:'100%', height:'100%', borderRadius: 24}} />
              ) : (
                <Ionicons name="person" size={24} color="#C4B5AE" />
              )}
            </View>
            <View style={styles.weaverTextContainer}>
              <Text style={styles.weaverName}>
                Ditenun oleh {product.penenun?.nama || 'Penenun Sumba'}
              </Text>
              <Text style={styles.weaverDesc}>
                {product.penenun?.lokasi_desa ? `Desa ${product.penenun.lokasi_desa}. ` : ''}
                {product.penenun?.bio || product.penenun?.deskripsi || 'Pengrajin tenun lokal Sumba.'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={TEXT_GREY} style={{ alignSelf: 'center', marginLeft: 8 }} />
          </TouchableOpacity>
        )}

        <View style={styles.divider} />

        {/* PILIH UKURAN */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PILIH UKURAN</Text>
          <View style={styles.sizeGrid}>
            {sizes.map((size) => {
              const isSelected = selectedSize === size;
              return (
                <TouchableOpacity
                  key={size}
                  style={[styles.sizeButton, isSelected && styles.sizeButtonActive]}
                  onPress={() => setSelectedSize(size)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.sizeButtonText, isSelected && styles.sizeButtonTextActive]}>
                    {size}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>CATATAN CUSTOM SIZE</Text>
          <TextInput
            style={styles.customInput}
            placeholder="Hasil Konsultasi WA (Contoh: P 120cm, L 60cm)"
            placeholderTextColor="#A99B95"
            value={customNote}
            onChangeText={setCustomNote}
          />
          <View style={styles.infoRow}>
            <Ionicons name="information-circle-outline" size={16} color={TEXT_GREY} />
            <Text style={styles.infoText}>
              Silakan konsultasi via WA sebelum memesan custom size.
            </Text>
          </View>
        </View>

        {/* BUTTONS */}
        <View style={styles.actionButtons}>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity style={[styles.waButton, { flex: 1 }]} activeOpacity={0.8}>
              <Ionicons name="chatbubbles" size={18} color={MAROON} />
              <Text style={styles.waButtonText}>Konsultasi</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.cartButton, { flex: 1, backgroundColor: '#F0EBE6' }]} 
              activeOpacity={0.8}
              onPress={handleAddToCart}
              disabled={isAddingToCart}
            >
              {isAddingToCart ? (
                <ActivityIndicator size="small" color={MAROON} />
              ) : (
                <>
                  <Ionicons name="cart" size={18} color={MAROON} />
                  <Text style={[styles.cartButtonText, { color: MAROON }]}>Keranjang</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.cartButton} activeOpacity={0.8} onPress={handleBeliLangsung}>
            <Ionicons name="bag-check" size={18} color="#FFFFFF" />
            <Text style={styles.cartButtonText}>Beli Langsung</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* ULASAN PRODUK */}
        {!loading && (
          <View style={styles.section}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.sectionTitle}>ULASAN PRODUK ({product.rating?.count || 0})</Text>
              <Text style={{ fontFamily: 'PoppinsMedium', color: MAROON }}>
                ★ {product.rating?.average || 0}
              </Text>
            </View>
            
            {reviews && reviews.length > 0 ? (
              reviews.map((rvw) => (
                <View key={rvw.id_review} style={styles.reviewItem}>
                  <View style={styles.reviewHeader}>
                    <View>
                      <Text style={styles.reviewName}>{rvw.user?.nama_lengkap || 'Pengguna'}</Text>
                      <Text style={styles.reviewDate}>
                        {new Date(rvw.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => handleDeleteReview(rvw.id_review)} hitSlop={{top:10, bottom:10, left:10, right:10}}>
                      <Ionicons name="trash-outline" size={16} color="#C62828" />
                    </TouchableOpacity>
                  </View>
                  <View style={{ flexDirection: 'row', marginBottom: 6 }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Ionicons 
                        key={star} 
                        name={star <= rvw.rating ? "star" : "star-outline"} 
                        size={12} 
                        color="#F59E0B" 
                      />
                    ))}
                  </View>
                  <Text style={styles.reviewComment}>{rvw.komentar}</Text>
                </View>
              ))
            ) : (
              <Text style={[styles.paragraph, { marginTop: 12, color: TEXT_GREY }]}>
                Belum ada ulasan untuk produk ini.
              </Text>
            )}
          </View>
        )}

        <View style={styles.divider} />

        {/* ACCORDIONS */}
        <TouchableOpacity style={styles.accordion} activeOpacity={0.7}>
          <Text style={styles.accordionTitle}>PENGIRIMAN & RETUR</Text>
          <Ionicons name="add" size={20} color={TEXT_DARK} />
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      <CustomAlert
        visible={alertVisible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        cancelText={alertConfig.cancelText}
        confirmText={alertConfig.confirmText}
        onCancel={alertConfig.onCancel}
        onConfirm={alertConfig.onConfirm}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER_COLOR,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontFamily: 'Playfair',
    fontSize: 16,
    color: TEXT_DARK,
    letterSpacing: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 3/4,
    position: 'relative',
  },
  mainImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E8DED8',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  zoomButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  thumbnailRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 16,
    gap: 12,
  },
  thumbnailWrapper: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 4,
    backgroundColor: '#E8DDD4',
    overflow: 'hidden',
    position: 'relative',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailPlaceholder: {
    flex: 1,
  },
  productInfo: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  productTitle: {
    fontFamily: 'Playfair',
    fontSize: 24,
    color: TEXT_DARK,
    flex: 1,
    marginRight: 16,
    lineHeight: 32,
  },
  productPrice: {
    fontFamily: 'Playfair',
    fontSize: 18,
    color: TEXT_GREY,
    marginTop: 8,
  },
  tagRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2D9D0',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  tagText: {
    fontFamily: 'PoppinsMedium',
    fontSize: 10,
    color: MAROON,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0E8E2',
    marginHorizontal: 20,
    marginVertical: 24,
  },
  section: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontFamily: 'PoppinsSemiBold',
    fontSize: 11,
    color: TEXT_DARK,
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  paragraph: {
    fontFamily: 'Poppins',
    fontSize: 13,
    color: TEXT_GREY,
    lineHeight: 22,
  },
  weaverCard: {
    flexDirection: 'row',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F0E8E2',
    alignItems: 'center',
  },
  weaverAvatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#F5F3EF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  weaverTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  weaverName: {
    fontFamily: 'PoppinsSemiBold',
    fontSize: 13,
    color: TEXT_DARK,
    marginBottom: 2,
  },
  weaverDesc: {
    fontFamily: 'Poppins',
    fontSize: 11,
    color: TEXT_GREY,
    lineHeight: 16,
  },
  sizeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  sizeButton: {
    width: (width - 40 - 12) / 2, // 2 kolom, dikurangi padding dan gap
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  sizeButtonActive: {
    borderColor: MAROON,
    backgroundColor: LIGHT_PINK,
  },
  sizeButtonText: {
    fontFamily: 'PoppinsMedium',
    fontSize: 13,
    color: TEXT_DARK,
  },
  sizeButtonTextActive: {
    color: MAROON,
  },
  customInput: {
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
    paddingVertical: 8,
    fontFamily: 'Poppins',
    fontSize: 13,
    color: TEXT_DARK,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  infoText: {
    fontFamily: 'Poppins',
    fontSize: 10,
    color: TEXT_GREY,
  },
  actionButtons: {
    paddingHorizontal: 20,
    marginTop: 32,
    gap: 12,
  },
  waButton: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: MAROON,
    borderRadius: 8,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  waButtonText: {
    fontFamily: 'PoppinsSemiBold',
    fontSize: 14,
    color: MAROON,
  },
  cartButton: {
    flexDirection: 'row',
    backgroundColor: MAROON,
    borderRadius: 8,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  cartButtonText: {
    fontFamily: 'PoppinsSemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  accordion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  accordionTitle: {
    fontFamily: 'PoppinsSemiBold',
    fontSize: 11,
    color: TEXT_DARK,
    letterSpacing: 1.5,
  },
});
