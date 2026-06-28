import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const NOTIFICATIONS = [
  {
    id: '1',
    category: 'Pesanan',
    isUnread: true,
    icon: 'cube-outline',
    iconBg: '#FCEAE8',
    title: 'Pesanan Dikirim',
    time: '2 jam yang lalu',
    body: 'Pesanan ST-2023-089 telah diserahkan ke pihak logistik dan sedang dalam perjalanan menuju alamat Anda.',
    highlight: 'ST-2023-089',
  },
  {
    id: '2',
    category: 'Pesanan',
    isUnread: false,
    icon: 'checkmark-circle-outline',
    iconBg: '#F0F4EC',
    title: 'Pembayaran Berhasil',
    time: 'Kemarin',
    body: 'Pembayaran untuk pesanan ST-2023-089 telah kami terima. Kami akan segera memproses tenun Anda.',
  },
  {
    id: '3',
    category: 'Promo Eksklusif',
    isUnread: true,
    icon: 'pricetag-outline',
    iconBg: '#FFF9E6',
    title: 'Penawaran Hari Pahlawan',
    time: '3 hari yang lalu',
    body: 'Nikmati potongan 15% untuk koleksi motif Pahudu. Gunakan kode: PAHUDU15 saat checkout. Berlaku hingga akhir pekan.',
    highlight: 'PAHUDU15',
  },
  {
    id: '4',
    category: 'Jurnal & Edukasi',
    isUnread: false,
    icon: 'book-outline',
    iconBg: '#F5F3EF',
    title: 'Kisah Penenun: Mama Rambu',
    time: '1 minggu yang lalu',
    body: 'Mengenal lebih dekat perjalanan Mama Rambu dalam melestarikan motif Hinggi dari generasi ke generasi di Sumba Timur.',
    actionText: 'BACA ARTIKEL',
  },
  {
    id: '5',
    category: 'Jurnal & Edukasi',
    isUnread: false,
    icon: 'color-palette-outline',
    iconBg: '#F5F3EF',
    title: 'Makna Motif Kuda',
    time: '2 minggu yang lalu',
    body: 'Pelajari simbolisme keberanian dan kebangsawanan di balik tenunan bermotif Ndara (Kuda) dalam budaya Sumba.',
    actionText: 'LIHAT KAMUS MOTIF',
  },
];

export default function NotificationScreen() {
  const navigation = useNavigation();

  // Group notifications by category
  const groupedNotifications = NOTIFICATIONS.reduce((acc, notif) => {
    if (!acc[notif.category]) acc[notif.category] = [];
    acc[notif.category].push(notif);
    return acc;
  }, {});

  const renderHighlight = (text, highlight) => {
    if (!highlight) return <Text style={styles.bodyText}>{text}</Text>;
    const parts = text.split(highlight);
    return (
      <Text style={styles.bodyText}>
        {parts[0]}
        <Text style={styles.highlightText}>{highlight}</Text>
        {parts[1]}
      </Text>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top:10, bottom:10, left:10, right:10}} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#5C1A1A" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>NOTIFIKASI</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Mark as Read */}
        <TouchableOpacity style={styles.markReadBtn} activeOpacity={0.7}>
          <Ionicons name="checkmark-done" size={18} color="#8B1A1A" />
          <Text style={styles.markReadText}>Tandai semua dibaca</Text>
        </TouchableOpacity>

        {Object.keys(groupedNotifications).map((category) => (
          <View key={category} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{category}</Text>
            
            {groupedNotifications[category].map((notif) => (
              <TouchableOpacity key={notif.id} style={styles.notifCard} activeOpacity={0.8}>
                {notif.isUnread && <View style={styles.unreadDot} />}
                
                <View style={[styles.iconBox, { backgroundColor: notif.iconBg }]}>
                  <Ionicons name={notif.icon} size={20} color="#5C1A1A" />
                </View>

                <View style={styles.notifContent}>
                  <View style={styles.notifHeader}>
                    <Text style={styles.notifTitle} numberOfLines={1}>{notif.title}</Text>
                    <Text style={styles.notifTime}>{notif.time}</Text>
                  </View>
                  
                  {renderHighlight(notif.body, notif.highlight)}
                  
                  {notif.actionText && (
                    <Text style={styles.actionText}>{notif.actionText}</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
        <View style={{height: 20}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F3EF',
  },
  backButton: { zIndex: 1 },
  headerTitleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Playfair',
    fontSize: 20,
    color: '#5C1A1A',
    letterSpacing: 2,
  },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16 },
  markReadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 20,
    gap: 6,
  },
  markReadText: {
    fontFamily: 'PoppinsSemiBold',
    fontSize: 12,
    color: '#8B1A1A',
  },
  categorySection: { marginBottom: 24 },
  categoryTitle: {
    fontFamily: 'Playfair',
    fontSize: 22,
    color: '#1A0A0A',
    marginBottom: 16,
  },
  notifCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E8DDD4',
    marginBottom: 12,
    position: 'relative',
    backgroundColor: '#FFFFFF',
  },
  unreadDot: {
    position: 'absolute',
    top: 16,
    left: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#8B1A1A',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginLeft: 8,
  },
  notifContent: { flex: 1 },
  notifHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  notifTitle: {
    fontFamily: 'PoppinsSemiBold',
    fontSize: 13,
    color: '#1A0A0A',
    flex: 1,
    marginRight: 8,
  },
  notifTime: {
    fontFamily: 'Poppins',
    fontSize: 10,
    color: '#7A6A65',
    marginTop: 2,
  },
  bodyText: {
    fontFamily: 'Poppins',
    fontSize: 12,
    color: '#4A3A35',
    lineHeight: 20,
  },
  highlightText: {
    fontFamily: 'PoppinsSemiBold',
    color: '#5C1A1A',
  },
  actionText: {
    fontFamily: 'PoppinsMedium',
    fontSize: 11,
    color: '#8B1A1A',
    letterSpacing: 1,
    marginTop: 12,
  },
});
