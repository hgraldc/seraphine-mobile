import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFormatter } from '../hooks/useFormatter';
import { orderService } from '../services/orderService';
import CustomAlert from '../components/CustomAlert';
import { COLORS } from '../theme/colors';


export default function CheckoutScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { formatRupiah } = useFormatter();
  const insets = useSafeAreaInsets();

  const { fromCart = false, directBuyItems = [], totalDirectPrice = 0 } = route.params || {};

  const [catatan, setCatatan] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ visible: false, title: '', message: '', type: 'info' });

  // Default ongkir disetel ke 0 (gratis ongkir) sesuai panduan backend
  // Nantinya bisa diganti dengan state hasil perhitungan dari API ekspedisi (misal: RajaOngkir)
  const ONGKIR = 0;
  
  const handleCheckout = async () => {
    setLoading(true);
    try {
      let payload = {};
      if (fromCart) {
        payload = {
          dari_keranjang: true,
          ongkir: ONGKIR,
          catatan: catatan,
          metode_pembayaran: 'BANK_TRANSFER'
        };
      } else {
        payload = {
          dari_keranjang: false,
          items: directBuyItems.map(item => {
            const baseItem = {
              id_produk: item.id_produk,
              jumlah: item.jumlah,
              ukuran: item.ukuran
            };
            if (item.is_custom) {
              baseItem.is_custom = true;
              baseItem.custom = item.custom;
            }
            return baseItem;
          }),
          ongkir: ONGKIR,
          catatan: catatan,
          metode_pembayaran: 'BANK_TRANSFER'
        };
      }

      const response = await orderService.checkout(payload);
      if (response.success) {
        setAlertConfig({
          visible: true,
          title: 'Pesanan Berhasil',
          message: 'Pesanan Anda telah berhasil dibuat dan segera diproses.',
          type: 'success',
          onConfirm: () => {
            setAlertConfig(prev => ({...prev, visible: false}));
            navigation.navigate('Home'); // Redirect to Home or Orders
          }
        });
      }
    } catch (error) {
      setAlertConfig({
        visible: true,
        title: 'Gagal Checkout',
        message: error.response?.data?.message || 'Terjadi kesalahan saat memproses pesanan.',
        type: 'error',
        onConfirm: () => setAlertConfig(prev => ({...prev, visible: false}))
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top:10, bottom:10, left:10, right:10}}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout Pesanan</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* INFO PENGIRIMAN */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INFORMASI PENGIRIMAN</Text>
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <Ionicons name="location-outline" size={20} color={COLORS.maroon} />
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>Alamat Utama</Text>
                <Text style={styles.cardDesc}>Jl. Tenun Indah No. 12, Sumba Timur, Nusa Tenggara Timur</Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.editText}>Ubah</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* CATATAN */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CATATAN UNTUK PENJUAL</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Contoh: Tolong bungkus dengan kotak kado ya."
            placeholderTextColor="#A99B95"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            value={catatan}
            onChangeText={setCatatan}
          />
        </View>

        <View style={styles.divider} />

        {/* RINGKASAN */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>RINGKASAN PEMBAYARAN</Text>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Belanja</Text>
              <Text style={styles.summaryValue}>
                {formatRupiah(totalDirectPrice)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Ongkos Kirim</Text>
              <Text style={styles.summaryValue}>{ONGKIR === 0 ? 'Gratis' : formatRupiah(ONGKIR)}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total Pembayaran</Text>
              <Text style={styles.totalValue}>
                {formatRupiah(totalDirectPrice + ONGKIR)}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* BOTTOM ACTION */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom > 0 ? insets.bottom : 20 }]}>
        <TouchableOpacity 
          style={styles.checkoutBtn} 
          activeOpacity={0.8}
          onPress={handleCheckout}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <>
              <Ionicons name="shield-checkmark" size={18} color="#FFFFFF" />
              <Text style={styles.checkoutBtnText}>Proses Pesanan</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
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
    borderBottomColor: COLORS.borderColor,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontFamily: 'Playfair',
    fontSize: 16,
    color: COLORS.textDark,
    letterSpacing: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontFamily: 'PoppinsMedium',
    fontSize: 12,
    color: COLORS.textGrey,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FAF7F5',
    borderRadius: 12,
    padding: 16,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  cardTitle: {
    fontFamily: 'PoppinsMedium',
    fontSize: 14,
    color: COLORS.textDark,
  },
  cardDesc: {
    fontFamily: 'Poppins',
    fontSize: 12,
    color: COLORS.textGrey,
    marginTop: 2,
    lineHeight: 18,
  },
  editText: {
    fontFamily: 'PoppinsMedium',
    fontSize: 13,
    color: COLORS.maroon,
  },
  textArea: {
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    borderRadius: 8,
    padding: 16,
    fontFamily: 'Poppins',
    fontSize: 14,
    color: COLORS.textDark,
    height: 100,
    backgroundColor: '#FFFFFF',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0EBE6',
    marginHorizontal: 20,
  },
  summaryContainer: {
    backgroundColor: '#FAF7F5',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontFamily: 'Poppins',
    fontSize: 13,
    color: COLORS.textGrey,
  },
  summaryValue: {
    fontFamily: 'PoppinsMedium',
    fontSize: 13,
    color: COLORS.textDark,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: COLORS.borderColor,
    marginVertical: 4,
  },
  totalLabel: {
    fontFamily: 'PoppinsSemiBold',
    fontSize: 14,
    color: COLORS.textDark,
  },
  totalValue: {
    fontFamily: 'PoppinsSemiBold',
    fontSize: 14,
    color: COLORS.maroon,
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0EBE6',
    backgroundColor: '#FFFFFF',
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.maroon,
    height: 54,
    borderRadius: 8,
    gap: 8,
  },
  checkoutBtnText: {
    fontFamily: 'PoppinsSemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  }
});
