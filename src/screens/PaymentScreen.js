import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { paymentService } from '../services/paymentService';
import CustomAlert from '../components/CustomAlert';
import { useFormatter } from '../hooks/useFormatter';

import { COLORS } from '../theme/colors';
const { maroon: MAROON, textDark: TEXT_DARK, textGrey: TEXT_GREY, borderColor: BORDER_COLOR } = COLORS;

export default function PaymentScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { formatRupiah } = useFormatter();

  const { orderId, totalAmount } = route.params || {};

  const [paymentMethod, setPaymentMethod] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ visible: false, title: '', message: '', type: 'info' });

  // For demonstration, we simulate proof of payment URL
  const [proofUri, setProofUri] = useState('https://storage.supabase.co/bukti/mock_bukti.jpg');

  const handleSubmit = async () => {
    if (!paymentMethod) {
      setAlertConfig({
        visible: true,
        title: 'Peringatan',
        message: 'Harap masukkan/pilih metode pembayaran.',
        type: 'warning',
        onConfirm: () => setAlertConfig(prev => ({...prev, visible: false}))
      });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        id_pesanan: orderId,
        metode: paymentMethod,
        bukti: proofUri,
        jumlah: totalAmount,
      };

      const res = await paymentService.submitPayment(payload);
      if (res.success) {
        setAlertConfig({
          visible: true,
          title: 'Berhasil',
          message: 'Pembayaran dikirim, menunggu konfirmasi admin',
          type: 'success',
          onConfirm: () => {
            setAlertConfig(prev => ({...prev, visible: false}));
            navigation.goBack();
          }
        });
      }
    } catch (error) {
      console.error('Payment Error:', error);
      setAlertConfig({
        visible: true,
        title: 'Gagal',
        message: 'Gagal mengirim pembayaran',
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
          <Ionicons name="arrow-back" size={24} color={TEXT_DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pembayaran</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>ID Pesanan</Text>
        <Text style={styles.value}>INV-{orderId}</Text>

        <Text style={[styles.label, { marginTop: 16 }]}>Total Tagihan</Text>
        <Text style={styles.totalValue}>{formatRupiah(totalAmount || 0)}</Text>

        <Text style={[styles.label, { marginTop: 24 }]}>Metode Pembayaran</Text>
        <TextInput
          style={styles.input}
          placeholder="Contoh: Transfer Bank Mandiri"
          placeholderTextColor="#A99B95"
          value={paymentMethod}
          onChangeText={setPaymentMethod}
        />

        <Text style={[styles.label, { marginTop: 24 }]}>Bukti Pembayaran</Text>
        <View style={styles.proofContainer}>
          <Ionicons name="image-outline" size={40} color={TEXT_GREY} />
          <Text style={styles.proofText}>
            Simulasi Gambar Bukti Transfer (Otomatis menggunakan URL mock)
          </Text>
        </View>

      </ScrollView>

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
            <Text style={styles.submitBtnText}>Kirim Pembayaran</Text>
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
  safeArea: { flex: 1, backgroundColor: '#FAFAF7' },
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
  headerTitle: { fontFamily: 'Playfair', fontSize: 16, color: TEXT_DARK },
  content: { padding: 20 },
  label: { fontFamily: 'PoppinsMedium', fontSize: 13, color: TEXT_GREY, marginBottom: 4 },
  value: { fontFamily: 'PoppinsMedium', fontSize: 16, color: TEXT_DARK },
  totalValue: { fontFamily: 'PoppinsSemiBold', fontSize: 22, color: MAROON },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8DDD4',
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 50,
    fontFamily: 'Poppins',
    fontSize: 14,
    color: TEXT_DARK,
  },
  proofContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8DDD4',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  proofText: { fontFamily: 'Poppins', fontSize: 12, color: TEXT_GREY, textAlign: 'center', marginTop: 8 },
  bottomBar: {
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: BORDER_COLOR,
    backgroundColor: '#FFFFFF',
  },
  submitBtn: {
    backgroundColor: MAROON,
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: { fontFamily: 'PoppinsSemiBold', fontSize: 14, color: '#FFFFFF' }
});
