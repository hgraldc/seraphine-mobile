import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFormatter } from '../hooks/useFormatter';
import { reviewService } from '../services/reviewService';
import CustomAlert from '../components/CustomAlert';

import { COLORS } from '../theme/colors';

const { maroon: MAROON, textDark: TEXT_DARK, textGrey: TEXT_GREY, borderColor: BORDER_COLOR } = COLORS;

export default function AddReviewScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { formatRupiah } = useFormatter();

  const { product, orderId } = route.params || {};

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ visible: false, title: '', message: '', type: 'info' });

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setRating(i)}>
          <Ionicons
            name={i <= rating ? "star" : "star-outline"}
            size={40}
            color={i <= rating ? "#9B9BFF" : "#D4D4D4"} // Light purple-blue for active star
            style={styles.starIcon}
          />
        </TouchableOpacity>
      );
    }
    return <View style={styles.starsContainer}>{stars}</View>;
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      setAlertConfig({
        visible: true,
        title: 'Peringatan',
        message: 'Harap berikan rating (bintang) terlebih dahulu.',
        type: 'warning',
        onConfirm: () => setAlertConfig(prev => ({...prev, visible: false}))
      });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        id_produk: product?.id_produk,
        id_pesanan: orderId,
        rating: rating,
        komentar: comment
      };

      const res = await reviewService.addReview(payload);
      if (res.success) {
        setAlertConfig({
          visible: true,
          title: 'Berhasil',
          message: 'Ulasan Anda berhasil dikirim!',
          type: 'success',
          onConfirm: () => {
            setAlertConfig(prev => ({...prev, visible: false}));
            navigation.goBack();
          }
        });
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setAlertConfig({
        visible: true,
        title: 'Gagal',
        message: 'Gagal mengirim ulasan.',
        type: 'error',
        onConfirm: () => setAlertConfig(prev => ({...prev, visible: false}))
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top:10, bottom:10, left:10, right:10}}>
          <Ionicons name="close" size={28} color={TEXT_DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Beri Ulasan</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* PRODUCT CARD */}
        <View style={styles.productCard}>
          <View style={styles.productImageWrapper}>
            {product?.gambar ? (
              <Image source={{ uri: product.gambar }} style={styles.productImage} />
            ) : (
              <Image source={require('../assets/img/hero.jpeg')} style={styles.productImage} />
            )}
          </View>
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product?.nama_produk || 'Produk'}</Text>
            <Text style={styles.productPrice}>{formatRupiah(product?.harga || 0)}</Text>
          </View>
        </View>

        {/* RATING SECTION */}
        <View style={styles.ratingSection}>
          <Text style={styles.ratingTitle}>Bagaimana kualitas produk ini?</Text>
          {renderStars()}
        </View>

        {/* REVIEW TEXT SECTION */}
        <View style={styles.commentSection}>
          <Text style={styles.commentLabel}>Ulasan Anda</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Ceritakan pengalaman Anda menggunakan kain ini..."
            placeholderTextColor={TEXT_GREY}
            multiline
            textAlignVertical="top"
            value={comment}
            onChangeText={setComment}
          />
          <View style={styles.redLine} />
        </View>

        {/* PHOTO/VIDEO UPLOAD SECTION */}
        <View style={styles.uploadSection}>
          <Text style={styles.commentLabel}>Tambahkan Foto/Video (Opsional)</Text>
          <TouchableOpacity style={styles.uploadBox} activeOpacity={0.7}>
            <Ionicons name="camera-outline" size={32} color="#5C5C5C" />
            <Text style={styles.uploadText}>Unggah Foto/Video</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* BOTTOM BUTTON */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom > 0 ? insets.bottom : 20 }]}>
        <TouchableOpacity 
          style={styles.submitBtn} 
          activeOpacity={0.8}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.submitBtnText}>Kirim Ulasan</Text>
          )}
        </TouchableOpacity>
      </View>

      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onConfirm={alertConfig.onConfirm}
        onCancel={alertConfig.onCancel}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0EBE6',
  },
  headerTitle: {
    fontFamily: 'Playfair',
    fontSize: 20,
    color: '#8B0000', // Matches the image's dark red header
    letterSpacing: 1,
  },
  content: { padding: 20 },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0EBE6',
    borderRadius: 4,
    padding: 12,
    marginBottom: 24,
  },
  productImageWrapper: {
    width: 60,
    height: 60,
    backgroundColor: '#E8DDD5',
    marginRight: 16,
  },
  productImage: { width: '100%', height: '100%' },
  productInfo: { flex: 1 },
  productName: { fontFamily: 'Playfair', fontSize: 15, color: TEXT_DARK, marginBottom: 4 },
  productPrice: { fontFamily: 'PoppinsMedium', fontSize: 13, color: '#5C1A1A' },
  ratingSection: { alignItems: 'center', marginBottom: 24 },
  ratingTitle: { fontFamily: 'PoppinsMedium', fontSize: 14, color: TEXT_DARK, marginBottom: 12 },
  starsContainer: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
  starIcon: { marginHorizontal: 4 },
  commentSection: { marginBottom: 24 },
  commentLabel: { fontFamily: 'Poppins', fontSize: 14, color: TEXT_DARK, marginBottom: 12 },
  textInput: {
    fontFamily: 'Poppins',
    fontSize: 14,
    color: TEXT_DARK,
    height: 100,
    padding: 12,
  },
  redLine: {
    height: 2,
    backgroundColor: '#8B0000',
    marginTop: 8,
  },
  uploadSection: { marginBottom: 40 },
  uploadBox: {
    borderWidth: 1,
    borderColor: '#D4A3A3',
    borderStyle: 'dashed',
    borderRadius: 4,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  uploadText: { fontFamily: 'Poppins', fontSize: 13, color: '#5C5C5C', marginTop: 8 },
  bottomBar: {
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0EBE6',
  },
  submitBtn: {
    backgroundColor: '#8B0000',
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: { fontFamily: 'PoppinsMedium', fontSize: 15, color: '#FFFFFF' }
});
