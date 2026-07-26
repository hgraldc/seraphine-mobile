import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Linking,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const TAB_BAR_HEIGHT = 70;

const FAQS = [
  {
    id: '1',
    question: 'Bagaimana cara merawat kain tenun Sumba?',
    answer:
      'Cara merawat kain tenun Sumba yang benar adalah dengan tidak sering mencucinya, cukup diangin-anginkan setelah dipakai, serta dihindarkan dari paparan sinar matahari langsung.',
  },
  {
    id: '2',
    question: 'Berapa lama proses pembuatan untuk pesanan kustom?',
    answer:
      'Pesanan kustom memerlukan waktu 4-8 minggu tergantung kompleksitas motif dan ukuran yang diminta. Tim kami akan menghubungi Anda untuk konfirmasi detail setelah pesanan diterima.',
  },
  {
    id: '3',
    question: 'Apakah Sumba Tenun melayani pengiriman internasional?',
    answer:
      'Mohon maaf, saat ini kami hanya melayani pengiriman ke seluruh wilayah di Indonesia. Kami belum dapat melayani pengiriman ke luar negeri (internasional).',
  },
];

function FaqItem({ item }) {
  const [open, setOpen] = useState(false);

  return (
    <TouchableOpacity
      style={styles.faqItem}
      onPress={() => setOpen((v) => !v)}
      activeOpacity={0.8}
    >
      <View style={styles.faqHeader}>
        <Text style={styles.faqQuestion}>{item.question}</Text>
        <Ionicons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={18}
          color="#5C1A1A"
          style={{ marginLeft: 8, flexShrink: 0 }}
        />
      </View>
      {open && <Text style={styles.faqAnswer}>{item.answer}</Text>}
    </TouchableOpacity>
  );
}

export default function HelpScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handleCS = async () => {
    const phoneNumber = "6282236555863";
    const message = "Halo, saya butuh bantuan terkait aplikasi Sumba Tenun.";
    const whatsappScheme = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

    try {
      const supported = await Linking.canOpenURL(whatsappScheme);
      if (supported) {
        await Linking.openURL(whatsappScheme); // langsung buka aplikasi WhatsApp
      } else {
        // fallback ke web jika WhatsApp tidak terinstall
        const webUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        await Linking.openURL(webUrl);
      }
    } catch (error) {
      console.error("Gagal membuka WhatsApp:", error);
      alert("Terjadi kesalahan saat mencoba membuka WhatsApp.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAF7" />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back-outline" size={24} color="#5C1A1A" />
        </TouchableOpacity>
        <Text style={styles.brandName}>CD Seraphine</Text>
        <TouchableOpacity 
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          onPress={() => navigation.navigate('Notification')}
        >
          <Ionicons name="notifications-outline" size={22} color="#2C0A0A" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
      >
        {/* Page Title */}
        <Text style={styles.pageTitle}>Pusat Bantuan</Text>
        <Text style={styles.pageSubtitle}>
          Temukan jawaban untuk pertanyaan Anda mengenai proses, perawatan, dan koleksi Sumba Tenun.
        </Text>

        {/* FAQ */}
        <Text style={styles.sectionTitle}>Pertanyaan Populer</Text>
        <View style={styles.faqContainer}>
          {FAQS.map((faq, index) => (
            <View key={faq.id}>
              <FaqItem item={faq} />
              {index < FAQS.length - 1 && <View style={styles.faqDivider} />}
            </View>
          ))}
        </View>

        {/* Contact Card */}
        <View style={styles.contactCard}>
          <Text style={styles.contactTitle}>Butuh bantuan lebih lanjut?</Text>
          <Text style={styles.contactDesc}>
            Tim kurator dan customer service kami siap membantu Anda dengan layanan personal.
          </Text>
          <TouchableOpacity
            style={styles.contactBtn}
            activeOpacity={0.85}
            onPress={handleCS}
          >
            <Ionicons name="headset-outline" size={18} color="#FAFAF7" />
            <Text style={styles.contactBtnText}>Hubungi Customer Service</Text>
          </TouchableOpacity>
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

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E8DDD4',
  },
  backButton: {
    marginRight: 8,
  },
  brandName: {
    fontFamily: 'Playfair',
    fontSize: 22,
    color: '#5C1A1A',
    letterSpacing: 0.4,
    flex: 1,
    textAlign: 'center',
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 28,
  },

  pageTitle: {
    fontFamily: 'Playfair',
    fontSize: 32,
    color: '#5C1A1A',
    textAlign: 'center',
    letterSpacing: 0.3,
    marginBottom: 10,
  },
  pageSubtitle: {
    fontFamily: 'Poppins',
    fontSize: 13,
    color: '#7A6A65',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },

  sectionTitle: {
    fontFamily: 'Playfair',
    fontSize: 22,
    color: '#5C1A1A',
    marginBottom: 16,
    letterSpacing: 0.2,
  },

  faqContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 28,
    shadowColor: '#2C0A0A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  faqItem: {
    paddingVertical: 16,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  faqQuestion: {
    fontFamily: 'PoppinsMedium',
    fontSize: 13,
    color: '#2C0A0A',
    flex: 1,
    lineHeight: 20,
  },
  faqAnswer: {
    fontFamily: 'Poppins',
    fontSize: 13,
    color: '#7A6A65',
    lineHeight: 20,
    marginTop: 10,
  },
  faqDivider: {
    height: 0.5,
    backgroundColor: '#F0E8E2',
  },

  contactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#2C0A0A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  contactTitle: {
    fontFamily: 'Playfair',
    fontSize: 22,
    color: '#2C0A0A',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  contactDesc: {
    fontFamily: 'Poppins',
    fontSize: 13,
    color: '#7A6A65',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6B0000',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: 8,
    width: '100%',
  },
  contactBtnText: {
    fontFamily: 'PoppinsSemiBold',
    fontSize: 14,
    color: '#FAFAF7',
    letterSpacing: 0.3,
  },
});