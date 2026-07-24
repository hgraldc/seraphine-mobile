import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFormatter } from '../hooks/useFormatter';
import { orderService } from '../services/orderService';
import CustomAlert from '../components/CustomAlert';
import Skeleton from '../components/Skeleton';

import { COLORS } from '../theme/colors';

const { 
  maroon: MAROON, 
  textDark: TEXT_DARK, 
  textGrey: TEXT_GREY, 
  borderColor: BORDER_COLOR
} = COLORS;

export default function OrderDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { formatRupiah } = useFormatter();

  const { orderId } = route.params || {};

  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ visible: false, title: '', message: '', type: 'info' });

  const fetchDetail = async () => {
    try {
      const res = await orderService.getOrderDetail(orderId);
      if (res.success && res.data) {
        setOrder(res.data);
      }
    } catch (error) {
      console.error('Gagal memuat detail pesanan:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayment = async () => {
    try {
      // Import paymentService must be added at top, which we'll do in another replace if it's missing.
      // Wait, let's verify if paymentService is imported first.
      const res = await require('../services/paymentService').paymentService.getPaymentByOrderId(orderId);
      if (res.success && res.data) {
        setPayment(res.data);
      }
    } catch (error) {
      // It's okay if payment is not found (e.g. not paid yet)
      console.log('Payment detail not found or error:', error);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchDetail();
      fetchPayment();
    }
  }, [orderId]);

  const handleCancelPrompt = () => {
    setAlertConfig({
      visible: true,
      title: 'Batalkan Pesanan?',
      message: 'Apakah Anda yakin ingin membatalkan pesanan ini?',
      type: 'confirm',
      onConfirm: confirmCancel,
      onCancel: () => setAlertConfig(prev => ({...prev, visible: false}))
    });
  };

  const confirmCancel = async () => {
    setAlertConfig(prev => ({...prev, visible: false}));
    setCanceling(true);
    try {
      const res = await orderService.cancelOrder(orderId);
      if (res.success) {
        setAlertConfig({
          visible: true,
          title: 'Berhasil',
          message: 'Pesanan telah dibatalkan.',
          type: 'success',
          onConfirm: () => {
            setAlertConfig(prev => ({...prev, visible: false}));
            fetchDetail(); // Refresh data to update status
          }
        });
      }
    } catch (error) {
      setAlertConfig({
        visible: true,
        title: 'Gagal',
        message: 'Gagal membatalkan pesanan.',
        type: 'error',
        onConfirm: () => setAlertConfig(prev => ({...prev, visible: false}))
      });
    } finally {
      setCanceling(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Skeleton width={24} height={24} borderRadius={12} />
          <Skeleton width={120} height={20} />
          <Skeleton width={24} height={24} borderRadius={12} />
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Skeleton width={100} height={14} style={{ marginBottom: 8 }} />
            <Skeleton width={150} height={24} style={{ marginBottom: 12 }} />
            <Skeleton width={120} height={14} />
          </View>
          <View style={styles.divider} />
          <View style={{ padding: 20 }}>
            <Skeleton width={150} height={14} style={{ marginBottom: 16 }} />
            {[1, 2].map((i) => (
              <View key={i} style={{ flexDirection: 'row', marginBottom: 16 }}>
                <Skeleton width={80} height={80} borderRadius={8} style={{ marginRight: 12 }} />
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <Skeleton width="80%" height={16} style={{ marginBottom: 8 }} />
                  <Skeleton width="40%" height={14} style={{ marginBottom: 8 }} />
                  <Skeleton width="60%" height={16} />
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontFamily: 'Poppins', color: TEXT_GREY }}>Data pesanan tidak ditemukan.</Text>
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
        <Text style={styles.headerTitle}>Detail Pesanan</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* STATUS BAR */}
        <View style={styles.statusSection}>
          <Text style={styles.statusLabel}>Status Pesanan</Text>
          <Text style={styles.statusValue}>{order.status_pesanan.toUpperCase()}</Text>
          <Text style={styles.orderDate}>
            {new Date(order.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </Text>
          <Text style={styles.orderIdText}>INV-{order.id_pesanan}</Text>
        </View>

        <View style={styles.divider} />

        {/* PRODUK */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PRODUK YANG DIBELI</Text>
          {order.detail_pesanan?.map((item) => (
            <View key={item.id_detail} style={styles.productCard}>
              <View style={styles.productImageWrapper}>
                {item.produk?.gambar ? (
                  <Image source={{ uri: item.produk.gambar }} style={styles.productImage} />
                ) : (
                  <Image source={require("../assets/img/hero.jpeg")} style={styles.productImage} />
                )}
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.produk?.nama_produk || 'Produk'}</Text>
                <Text style={styles.productMeta}>Ukuran: {item.ukuran || '-'}</Text>
                <Text style={styles.productMeta}>Jumlah: {item.jumlah} pcs</Text>
                <Text style={styles.productPrice}>{formatRupiah(item.harga_satuan)}</Text>
                {item.is_custom && (
                  <Text style={styles.customBadge}>Custom Size</Text>
                )}
                {order.status_pesanan === 'selesai' && (
                  <TouchableOpacity 
                    style={styles.reviewBtn}
                    onPress={() => navigation.navigate('AddReview', { product: item.produk, orderId: order.id_pesanan })}
                  >
                    <Text style={styles.reviewBtnText}>Beri Ulasan</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        {/* INFO PENGIRIMAN */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INFO PENGIRIMAN</Text>
          <Text style={styles.infoLabel}>Catatan Pembeli:</Text>
          <Text style={styles.infoValue}>{order.catatan || '-'}</Text>
          
          <Text style={[styles.infoLabel, { marginTop: 12 }]}>Pembeli:</Text>
          <Text style={styles.infoValue}>{order.user?.nama_lengkap || 'Guest'}</Text>
          <Text style={styles.infoValue}>{order.user?.no_telepon || '-'}</Text>
        </View>

        <View style={styles.divider} />

        {/* RINGKASAN */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>RINGKASAN PEMBAYARAN</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Belanja</Text>
            <Text style={styles.summaryValue}>{formatRupiah(order.total_harga - order.ongkir)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Ongkos Kirim</Text>
            <Text style={styles.summaryValue}>{formatRupiah(order.ongkir)}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total Pembayaran</Text>
            <Text style={styles.totalValue}>{formatRupiah(order.total_harga)}</Text>
          </View>
        </View>
        
        <View style={styles.divider} />

        {/* INFO PEMBAYARAN (JIKA ADA) */}
        {payment && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>INFO PEMBAYARAN (MIDTRANS)</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Metode Pembayaran</Text>
              <Text style={styles.summaryValue}>{payment.metode || '-'}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Status Pembayaran</Text>
              <Text style={[styles.summaryValue, { color: payment.status === 'settlement' || payment.status === 'success' ? '#2E7D32' : MAROON }]}>
                {payment.status ? payment.status.toUpperCase() : 'PENDING'}
              </Text>
            </View>
          </View>
        )}

      </ScrollView>

      {/* BATAL / BAYAR BUTTON */}
      {order.status_pesanan === 'menunggu' && (
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom > 0 ? insets.bottom : 20 }]}>
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity 
              style={[styles.batalBtn, { flex: 1 }]} 
              activeOpacity={0.8}
              onPress={handleCancelPrompt}
            >
              <Text style={styles.batalBtnText}>Batalkan Pesanan</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.bayarBtn, { flex: 1 }]} 
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Payment', { orderId: order.id_pesanan, totalAmount: order.total_harga })}
            >
              <Text style={styles.bayarBtnText}>Bayar Sekarang</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Dim overlay for canceling */}
      {canceling && (
        <View style={StyleSheet.absoluteFill}>
           <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center' }}>
             <ActivityIndicator size="large" color="#FFFFFF" />
           </View>
        </View>
      )}

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
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER_COLOR,
  },
  headerTitle: {
    fontFamily: 'Playfair',
    fontSize: 16,
    color: TEXT_DARK,
  },
  statusSection: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  statusLabel: {
    fontFamily: 'Poppins',
    fontSize: 12,
    color: TEXT_GREY,
    marginBottom: 4,
  },
  statusValue: {
    fontFamily: 'PoppinsSemiBold',
    fontSize: 18,
    color: MAROON,
    marginBottom: 8,
  },
  orderDate: {
    fontFamily: 'Poppins',
    fontSize: 12,
    color: TEXT_GREY,
  },
  orderIdText: {
    fontFamily: 'PoppinsMedium',
    fontSize: 13,
    color: TEXT_DARK,
    marginTop: 4,
  },
  divider: {
    height: 8,
    backgroundColor: '#F0EBE6',
  },
  section: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: {
    fontFamily: 'PoppinsMedium',
    fontSize: 12,
    color: TEXT_GREY,
    letterSpacing: 1,
    marginBottom: 16,
  },
  productCard: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  productImageWrapper: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#E8DDD5',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontFamily: 'PoppinsMedium',
    fontSize: 14,
    color: TEXT_DARK,
    marginBottom: 2,
  },
  productMeta: {
    fontFamily: 'Poppins',
    fontSize: 12,
    color: TEXT_GREY,
  },
  productPrice: {
    fontFamily: 'PoppinsSemiBold',
    fontSize: 13,
    color: MAROON,
    marginTop: 4,
  },
  customBadge: {
    fontFamily: 'Poppins',
    fontSize: 10,
    color: '#B07800',
    backgroundColor: '#FFF8E6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  infoLabel: {
    fontFamily: 'PoppinsMedium',
    fontSize: 13,
    color: TEXT_DARK,
  },
  infoValue: {
    fontFamily: 'Poppins',
    fontSize: 13,
    color: TEXT_GREY,
    marginTop: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontFamily: 'Poppins',
    fontSize: 13,
    color: TEXT_GREY,
  },
  summaryValue: {
    fontFamily: 'PoppinsMedium',
    fontSize: 13,
    color: TEXT_DARK,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: BORDER_COLOR,
    marginVertical: 12,
  },
  totalLabel: {
    fontFamily: 'PoppinsSemiBold',
    fontSize: 14,
    color: TEXT_DARK,
  },
  totalValue: {
    fontFamily: 'PoppinsSemiBold',
    fontSize: 15,
    color: MAROON,
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: BORDER_COLOR,
    backgroundColor: '#FFFFFF',
  },
  batalBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C62828',
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  batalBtnText: {
    fontFamily: 'PoppinsSemiBold',
    fontSize: 14,
    color: '#C62828',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  bayarBtn: {
    backgroundColor: MAROON,
    borderWidth: 1,
    borderColor: MAROON,
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bayarBtnText: {
    fontFamily: 'PoppinsSemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  reviewBtn: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: MAROON,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  reviewBtnText: {
    fontFamily: 'PoppinsMedium',
    fontSize: 12,
    color: MAROON,
  }
});
