import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { shippingService } from '../services/shippingService';
import { TextInput } from 'react-native';
import Skeleton from '../components/Skeleton';

import { COLORS } from '../theme/colors';

const { 
  maroon: MAROON, 
  textDark: TEXT_DARK, 
  textGrey: TEXT_GREY, 
  borderColor: BORDER_COLOR, 
  bgColor: BG_COLOR 
} = COLORS;

export default function TrackPackageScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  
  const { orderId, productImage, productName } = route.params || {};

  const [shipping, setShipping] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // State Cek Ongkir
  const [city, setCity] = useState('Jakarta');
  const [weight, setWeight] = useState('1000');
  const [courier, setCourier] = useState('jne');
  const [ongkirResults, setOngkirResults] = useState([]);
  const [checkingOngkir, setCheckingOngkir] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchShipping();
    }
  }, [orderId]);

  const fetchShipping = async () => {
    try {
      const res = await shippingService.getShippingDetail(orderId);
      if (res.success && res.data) {
        setShipping(res.data);
      } else {
        setErrorMsg('Data pengiriman tidak ditemukan.');
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setErrorMsg('Pesanan belum dikirim atau data pengiriman belum ada.');
      } else {
        setErrorMsg('Gagal memuat detail pengiriman.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCekOngkir = async () => {
    if (!city || !weight || !courier) return;
    try {
      setCheckingOngkir(true);
      const payload = {
        destination_city: city,
        weight: parseInt(weight, 10) || 1000,
        courier: courier.toLowerCase()
      };
      const res = await shippingService.cekOngkir(payload);
      if (res.success && res.data) {
        setOngkirResults(res.data);
      }
    } catch (err) {
      console.error('Error cek ongkir:', err);
    } finally {
      setCheckingOngkir(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const d = new Date(dateString);
    return `${d.getDate()} ${d.toLocaleString('id-ID', { month: 'short' })} ${d.getFullYear()}`;
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    const d = new Date(dateString);
    return `${d.getDate()} ${d.toLocaleString('id-ID', { month: 'short' })}, ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')} WIB`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Skeleton width={24} height={24} borderRadius={12} />
          <Skeleton width={120} height={20} />
          <Skeleton width={24} height={24} borderRadius={12} />
        </View>
        <View style={{ padding: 20 }}>
          <Skeleton width="100%" height={100} borderRadius={8} style={{ marginBottom: 24 }} />
          <Skeleton width="40%" height={16} style={{ marginBottom: 16 }} />
          {[1, 2, 3].map((i) => (
            <View key={i} style={{ flexDirection: 'row', marginBottom: 20 }}>
              <Skeleton width={16} height={16} borderRadius={8} style={{ marginRight: 16 }} />
              <View style={{ flex: 1 }}>
                <Skeleton width="80%" height={16} style={{ marginBottom: 8 }} />
                <Skeleton width="50%" height={12} />
              </View>
            </View>
          ))}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top:10, bottom:10, left:10, right:10}}>
          <Ionicons name="arrow-back" size={24} color={MAROON} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CD SERAPHINE</Text>
        <TouchableOpacity hitSlop={{top:10, bottom:10, left:10, right:10}}>
          <Ionicons name="bag-outline" size={24} color={MAROON} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* TITLE */}
        <Text style={styles.pageTitle}>Lacak Pengiriman</Text>
        <Text style={styles.pageSubtitle}>Pantau perjalanan karya seni Anda menuju destinasi.</Text>

        {errorMsg ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={40} color="#C62828" />
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        ) : (
          <>
            {/* INFORMASI RESI CARD */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>INFORMASI RESI</Text>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Nomor Resi</Text>
                <Text style={styles.infoValueBold}>{shipping?.nomor_resi}</Text>
              </View>
              <View style={styles.divider} />
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Kurir Ekspedisi</Text>
                <View style={styles.courierBox}>
                  <Ionicons name="car-outline" size={16} color={MAROON} />
                  <Text style={styles.infoValueCourier}>{shipping?.ekspedisi}</Text>
                </View>
              </View>
              <View style={styles.divider} />
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Estimasi Tiba</Text>
                <Text style={styles.infoValue}>{formatDate(shipping?.estimasi_tiba)}</Text>
              </View>
            </View>

            {/* KOLEKSI TERPILIH CARD */}
            <View style={[styles.card, { backgroundColor: '#F0EBE6', padding: 12 }]}>
              <View style={styles.productRow}>
                {productImage ? (
                  <Image source={{ uri: productImage }} style={styles.productImage} />
                ) : (
                  <Image source={require('../assets/img/hero.jpeg')} style={styles.productImage} />
                )}
                <View style={styles.productInfo}>
                  <Text style={styles.productSubtitle}>KOLEKSI TERPILIH</Text>
                  <Text style={styles.productName}>{productName}</Text>
                </View>
              </View>
            </View>

            {/* STATUS PENGIRIMAN TIMELINE */}
            <View style={[styles.card, { marginTop: 24, padding: 20 }]}>
              <Text style={styles.cardTitle}>STATUS PENGIRIMAN</Text>

              {/* TIMELINE ITEMS */}
              <View style={styles.timelineContainer}>
                
                {/* Step 1: Tiba (Inactive) */}
                <View style={styles.timelineStep}>
                  <View style={styles.timelineIconContainer}>
                    <View style={styles.iconOutline}>
                      <View style={styles.iconInner} />
                    </View>
                    <View style={[styles.timelineLine, { backgroundColor: MAROON }]} />
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineTitleInactive}>Tiba di Tujuan</Text>
                    <Text style={styles.timelineDesc}>Paket sedang menunggu kurir untuk diantar ke alamat.</Text>
                  </View>
                </View>

                {/* Step 2: Dalam Perjalanan (Active) */}
                <View style={styles.timelineStep}>
                  <View style={styles.timelineIconContainer}>
                    <View style={[styles.iconSolid, { backgroundColor: MAROON }]}>
                      <Ionicons name="airplane" size={12} color="#FFF" />
                    </View>
                    <View style={styles.timelineLine} />
                  </View>
                  <View style={styles.timelineContent}>
                    <View style={styles.titleRow}>
                      <Text style={styles.timelineTitleActive}>Dalam Perjalanan</Text>
                      <Text style={styles.timelineTime}>Hari ini</Text>
                    </View>
                    <Text style={styles.timelineDesc}>Paket telah berangkat dari fasilitas sortir dan menuju kota tujuan Anda dengan kurir {shipping?.ekspedisi}.</Text>
                  </View>
                </View>

                {/* Step 3: Sedang Dikemas */}
                <View style={styles.timelineStep}>
                  <View style={styles.timelineIconContainer}>
                    <View style={styles.iconOutlineCheck}>
                      <Ionicons name="checkmark" size={14} color={TEXT_DARK} />
                    </View>
                    <View style={styles.timelineLine} />
                  </View>
                  <View style={styles.timelineContent}>
                    <View style={styles.titleRow}>
                      <Text style={styles.timelineTitle}>Sedang Dikemas</Text>
                      <Text style={styles.timelineTime}>{formatDateTime(shipping?.tanggal_kirim)}</Text>
                    </View>
                    <Text style={styles.timelineDesc}>Kurator kami sedang mempersiapkan tenun Anda dengan kemasan arsip khusus.</Text>
                  </View>
                </View>

                {/* Step 4: Pesanan Diterima */}
                <View style={styles.timelineStep}>
                  <View style={styles.timelineIconContainer}>
                    <View style={styles.iconOutlineCheck}>
                      <Ionicons name="checkmark" size={14} color={TEXT_DARK} />
                    </View>
                  </View>
                  <View style={styles.timelineContent}>
                    <View style={styles.titleRow}>
                      <Text style={styles.timelineTitle}>Pesanan Diterima</Text>
                    </View>
                    <Text style={styles.timelineDesc}>Pembayaran terverifikasi. Pesanan masuk ke galeri Sumba.</Text>
                  </View>
                </View>

              </View>
            </View>

          </>
        )}

        {/* CEK ONGKIR CARD */}
        <View style={[styles.card, { marginTop: 24 }]}>
          <Text style={styles.cardTitle}>SIMULASI CEK ONGKIR</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Kota Tujuan</Text>
            <TextInput style={styles.textInput} value={city} onChangeText={setCity} placeholder="Contoh: Medan" />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Berat (gram)</Text>
            <TextInput style={styles.textInput} value={weight} onChangeText={setWeight} keyboardType="numeric" />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Kurir (jne, pos, tiki)</Text>
            <TextInput style={styles.textInput} value={courier} onChangeText={setCourier} />
          </View>
          
          <TouchableOpacity 
            style={styles.cekOngkirBtn} 
            onPress={handleCekOngkir}
            disabled={checkingOngkir}
          >
            {checkingOngkir ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.cekOngkirBtnText}>Cek Ongkir</Text>
            )}
          </TouchableOpacity>

          {/* HASIL CEK ONGKIR */}
          {ongkirResults.length > 0 && (
            <View style={{ marginTop: 16 }}>
              <View style={styles.divider} />
              <Text style={[styles.cardTitle, { marginTop: 12, marginBottom: 8 }]}>HASIL PENCARIAN</Text>
              {ongkirResults.map((result, idx) => (
                <View key={idx} style={styles.ongkirResultCard}>
                  <Text style={styles.ongkirCourierName}>{result.name}</Text>
                  {result.costs?.map((cost, cIdx) => (
                    <View key={cIdx} style={styles.ongkirCostRow}>
                      <View>
                        <Text style={styles.ongkirService}>{cost.service}</Text>
                        <Text style={styles.ongkirDesc}>{cost.description}</Text>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.ongkirPrice}>Rp {cost.cost[0]?.value?.toLocaleString('id-ID')}</Text>
                        <Text style={styles.ongkirEtd}>Etimasi {cost.cost[0]?.etd} hari</Text>
                      </View>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG_COLOR,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: BG_COLOR,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
  },
  headerTitle: {
    fontFamily: 'Playfair',
    fontSize: 14,
    color: MAROON,
    letterSpacing: 2,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  pageTitle: {
    fontFamily: 'Playfair',
    fontSize: 22,
    color: MAROON,
    marginBottom: 4,
  },
  pageSubtitle: {
    fontFamily: 'Poppins',
    fontSize: 13,
    color: TEXT_GREY,
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8E2DD',
    marginBottom: 16,
  },
  cardTitle: {
    fontFamily: 'PoppinsMedium',
    fontSize: 12,
    color: TEXT_GREY,
    letterSpacing: 1,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  infoLabel: {
    fontFamily: 'Poppins',
    fontSize: 13,
    color: TEXT_GREY,
  },
  infoValue: {
    fontFamily: 'Poppins',
    fontSize: 13,
    color: TEXT_DARK,
  },
  infoValueBold: {
    fontFamily: 'PoppinsSemiBold',
    fontSize: 14,
    color: MAROON,
  },
  courierBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoValueCourier: {
    fontFamily: 'PoppinsMedium',
    fontSize: 13,
    color: TEXT_DARK,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0EBE6',
    marginVertical: 12,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
  },
  productInfo: {
    marginLeft: 12,
    flex: 1,
  },
  productSubtitle: {
    fontFamily: 'PoppinsSemiBold',
    fontSize: 10,
    color: TEXT_GREY,
    letterSpacing: 1,
    marginBottom: 2,
  },
  productName: {
    fontFamily: 'Playfair',
    fontSize: 16,
    color: TEXT_DARK,
  },
  timelineContainer: {
    paddingTop: 10,
  },
  timelineStep: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  timelineIconContainer: {
    alignItems: 'center',
    marginRight: 16,
    width: 24,
  },
  iconOutline: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#D4C4BC',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAF7',
    zIndex: 2,
  },
  iconInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D4C4BC',
  },
  iconSolid: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  iconOutlineCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: MAROON,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAF7',
    zIndex: 2,
  },
  timelineLine: {
    width: 1.5,
    flex: 1,
    backgroundColor: '#E8DDD4',
    marginVertical: -2, // to connect seamlessly
    zIndex: 1,
    minHeight: 40,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 24,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  timelineTitleInactive: {
    fontFamily: 'Poppins',
    fontSize: 14,
    color: '#9B8A85',
    marginBottom: 4,
  },
  timelineTitleActive: {
    fontFamily: 'PoppinsSemiBold',
    fontSize: 14,
    color: MAROON,
  },
  timelineTitle: {
    fontFamily: 'PoppinsMedium',
    fontSize: 14,
    color: TEXT_DARK,
  },
  timelineTime: {
    fontFamily: 'PoppinsSemiBold',
    fontSize: 10,
    color: '#9B8A85',
    marginTop: 2,
  },
  timelineDesc: {
    fontFamily: 'Poppins',
    fontSize: 12,
    color: '#7A6A65',
    lineHeight: 18,
  },
  errorContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontFamily: 'PoppinsMedium',
    fontSize: 14,
    color: TEXT_GREY,
    textAlign: 'center',
    marginTop: 12,
  },
  inputContainer: {
    marginBottom: 12,
  },
  inputLabel: {
    fontFamily: 'Poppins',
    fontSize: 12,
    color: TEXT_GREY,
    marginBottom: 4,
  },
  textInput: {
    backgroundColor: '#FAFAF7',
    borderWidth: 1,
    borderColor: '#E8E2DD',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    fontFamily: 'Poppins',
    fontSize: 13,
    color: TEXT_DARK,
  },
  cekOngkirBtn: {
    backgroundColor: MAROON,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  cekOngkirBtnText: {
    fontFamily: 'PoppinsSemiBold',
    fontSize: 13,
    color: '#FFFFFF',
  },
  ongkirResultCard: {
    backgroundColor: '#FAFAF7',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E8E2DD',
  },
  ongkirCourierName: {
    fontFamily: 'PoppinsSemiBold',
    fontSize: 13,
    color: TEXT_DARK,
    marginBottom: 8,
  },
  ongkirCostRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  ongkirService: {
    fontFamily: 'PoppinsMedium',
    fontSize: 13,
    color: TEXT_DARK,
  },
  ongkirDesc: {
    fontFamily: 'Poppins',
    fontSize: 11,
    color: TEXT_GREY,
  },
  ongkirPrice: {
    fontFamily: 'PoppinsSemiBold',
    fontSize: 13,
    color: MAROON,
  },
  ongkirEtd: {
    fontFamily: 'Poppins',
    fontSize: 11,
    color: TEXT_GREY,
  }
});
