import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const MAROON = '#8B1A1A';
const LIGHT_PINK = '#FCEAE8';
const TEXT_DARK = '#1A0A0A';
const TEXT_GREY = '#7A6A65';
const BORDER_COLOR = '#E2D9D0';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const navigation = useNavigation();
  const [selectedSize, setSelectedSize] = useState('M');
  const [customNote, setCustomNote] = useState('');

  const sizes = ['S', 'M', 'L', 'Custom Size'];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top:10, bottom:10, left:10, right:10}}>
          <Ionicons name="arrow-back" size={24} color={TEXT_DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CD Seraphine</Text>
        <TouchableOpacity hitSlop={{top:10, bottom:10, left:10, right:10}}>
          <Ionicons name="share-social-outline" size={24} color={TEXT_DARK} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* MAIN IMAGE */}
        <View style={styles.imageContainer}>
          <View style={styles.mainImagePlaceholder} />
          <TouchableOpacity style={styles.zoomButton}>
            <Ionicons name="search" size={18} color={TEXT_DARK} />
          </TouchableOpacity>
        </View>

        {/* THUMBNAILS */}
        <View style={styles.thumbnailRow}>
          {[1, 2, 3, 4].map((item, index) => (
            <TouchableOpacity key={index} style={styles.thumbnailWrapper}>
              <View style={styles.thumbnailPlaceholder} />
              {index === 3 && (
                <View style={styles.playIconOverlay}>
                  <Ionicons name="play-circle" size={28} color="rgba(255,255,255,0.9)" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* PRODUCT INFO */}
        <View style={styles.productInfo}>
          <View style={styles.titleRow}>
            <Text style={styles.productTitle}>Kain Tenun Ikat Sumba Timur</Text>
            <TouchableOpacity hitSlop={{top:10, bottom:10, left:10, right:10}}>
              <Ionicons name="heart-outline" size={26} color={TEXT_DARK} />
            </TouchableOpacity>
          </View>
          <Text style={styles.productPrice}>Rp 4.500.000</Text>

          {/* TAGS */}
          <View style={styles.tagRow}>
            <View style={styles.tag}>
              <Ionicons name="sparkles-outline" size={12} color={MAROON} />
              <Text style={styles.tagText}>Motif Mamuli</Text>
            </View>
            <View style={styles.tag}>
              <Ionicons name="sparkles-outline" size={12} color={MAROON} />
              <Text style={styles.tagText}>Motif Andung</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* MAKNA FILOSOFIS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MAKNA FILOSOFIS</Text>
          <Text style={styles.paragraph}>
            Motif Mamuli melambangkan rahim wanita, menyimbolkan kehidupan, kesuburan, dan peran sentral perempuan dalam masyarakat Sumba. Dipadukan dengan motif Andung (pohon tengkorak) yang melambangkan kepahlawanan dan kemenangan, kain ini menceritakan keseimbangan antara penciptaan dan perlindungan. Ditenun selama 4 bulan menggunakan pewarna alami dari akar mengkudu dan daun nila.
          </Text>
        </View>

        {/* PENENUN INFO */}
        <View style={styles.weaverCard}>
          <View style={styles.weaverAvatarPlaceholder}>
             <Ionicons name="person" size={24} color="#C4B5AE" />
          </View>
          <View style={styles.weaverTextContainer}>
            <Text style={styles.weaverName}>Ditenun oleh Rambu Ana</Text>
            <Text style={styles.weaverDesc}>
              Desa Kaliuda, Sumba Timur. Mewarisi teknik tenun dari generasi ke-4 keluarganya.
            </Text>
          </View>
        </View>

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

          {/* CATATAN CUSTOM SIZE */}
          <Text style={[styles.sectionTitle, { marginTop: 24, textTransform: 'none', fontSize: 13 }]}>
            Catatan Custom Size
          </Text>
          <TextInput
            style={styles.customInput}
            placeholder="Hasil Konsultasi WA (Contoh: P 120cm, L 60cm)"
            placeholderTextColor="#A99B95"
            value={customNote}
            onChangeText={setCustomNote}
          />
          <View style={styles.infoRow}>
            <Ionicons name="information-circle-outline" size={14} color={TEXT_GREY} />
            <Text style={styles.infoText}>
              Silakan konsultasi via WA sebelum memesan custom size.
            </Text>
          </View>
        </View>

        {/* BUTTONS */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.waButton} activeOpacity={0.8}>
            <Ionicons name="chatbubbles" size={18} color={MAROON} />
            <Text style={styles.waButtonText}>Konsultasi via WA</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cartButton} activeOpacity={0.8}>
            <Ionicons name="bag-handle" size={18} color="#FFFFFF" />
            <Text style={styles.cartButtonText}>Tambah ke Keranjang</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* ACCORDIONS */}
        <TouchableOpacity style={styles.accordion} activeOpacity={0.7}>
          <Text style={styles.accordionTitle}>PENGIRIMAN & RETUR</Text>
          <Ionicons name="add" size={20} color={TEXT_DARK} />
        </TouchableOpacity>
        
        <View style={styles.divider} />

        <TouchableOpacity style={styles.accordion} activeOpacity={0.7}>
          <Text style={styles.accordionTitle}>PERAWATAN KAIN</Text>
          <Ionicons name="add" size={20} color={TEXT_DARK} />
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* Bottom padding for tab bar if needed */}
        <View style={{ height: 40 }} />
      </ScrollView>
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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F3EF',
  },
  headerTitle: {
    fontFamily: 'Playfair',
    fontSize: 22,
    color: MAROON,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 3 / 4,
    backgroundColor: '#F5F3EF',
    position: 'relative',
  },
  mainImagePlaceholder: {
    flex: 1,
  },
  zoomButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
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
  thumbnailPlaceholder: {
    flex: 1,
  },
  playIconOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
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
