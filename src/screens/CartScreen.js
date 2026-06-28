import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFormatter } from '../hooks/useFormatter';

const TAB_BAR_HEIGHT = 70;

// Dummy Cart Data 
const INITIAL_CART = [
  {
    id: '1',
    name: 'Kain Pahikung Sumba - Motif Bunga',
    category: 'Kain',
    price: 2500000,
    quantity: 1,
    size: 'L',
    image: require('../assets/img/hero.jpeg'),
  },
  {
    id: '2',
    name: 'Tas Selempang Tenun Hinggi',
    category: 'Tas',
    price: 850000,
    quantity: 2,
    size: null,
    image: require('../assets/img/hero.jpeg'),
  },
  {
    id: '3',
    name: 'Dompet Tenun Motif Sekong',
    category: 'Aksesori',
    price: 350000,
    quantity: 1,
    size: null,
    image: require('../assets/img/hero.jpeg'),
  },
];


const CartItem = ({ item, onIncrease, onDecrease, onRemove, formatRupiah }) => (
  <View style={styles.cartItemContainer}>
    <View style={styles.imageWrapper}>
      <Image source={item.image} style={styles.productImage} resizeMode="cover" />
    </View>
    <View style={styles.itemDetails}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemCategory}>{item.category}</Text>
        <TouchableOpacity
          onPress={() => onRemove(item.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="close" size={18} color="#9B9B9B" />
        </TouchableOpacity>
      </View>
      <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
      {item.size && (
        <View style={styles.sizeTag}>
          <Text style={styles.sizeText}>Ukuran: {item.size}</Text>
        </View>
      )}
      <View style={styles.itemFooter}>
        <Text style={styles.itemPrice}>{formatRupiah(item.price)}</Text>
        <View style={styles.qtyControl}>
          <TouchableOpacity
            style={[styles.qtyBtn, item.quantity <= 1 && styles.qtyBtnDisabled]}
            onPress={() => onDecrease(item.id)}
            disabled={item.quantity <= 1}
          >
            <Ionicons name="remove" size={14} color={item.quantity <= 1 ? '#CCC' : '#5C1A1A'} />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{item.quantity}</Text>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => onIncrease(item.id)}>
            <Ionicons name="add" size={14} color="#5C1A1A" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </View>
);


export default function CartScreen() {
  const navigation = useNavigation();
  const { formatRupiah } = useFormatter();
  const [cartItems, setCartItems] = useState(INITIAL_CART);
  const insets = useSafeAreaInsets();

  const checkoutBottom = TAB_BAR_HEIGHT + insets.bottom;
  const checkoutWrapperHeight = 80;

  const handleIncrease = (id) =>
    setCartItems((prev) =>
      prev.map((item) => item.id === id ? { ...item, quantity: item.quantity + 1 } : item)
    );

  const handleDecrease = (id) =>
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
      )
    );

  const handleRemove = (id) =>
    setCartItems((prev) => prev.filter((item) => item.id !== id));

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = subtotal > 0 ? 75000 : 0;
  const total = subtotal + shippingCost;

  
  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor="#FAFAF7" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Keranjang Belanja</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Notification')} hitSlop={{top:10, bottom:10, left:10, right:10}}>
            <Ionicons name="notifications-outline" size={24} color="#5C1A1A" />
          </TouchableOpacity>
        </View>
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconWrapper}>
            <Ionicons name="bag-outline" size={56} color="#C8A882" />
          </View>
          <Text style={styles.emptyTitle}>Keranjang Kosong</Text>
          <Text style={styles.emptySubtitle}>
            Belum ada produk yang ditambahkan.{'\n'}Temukan koleksi tenun pilihan kami.
          </Text>
          <TouchableOpacity
            style={styles.shopBtn}
            onPress={() => navigation?.navigate('Catalog')}
          >
            <Text style={styles.shopBtnText}>Jelajahi Koleksi</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAF7" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Keranjang Belanja</Text>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 16}}>
          <Text style={styles.headerCount}>{cartItems.length} item</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Notification')} hitSlop={{top:10, bottom:10, left:10, right:10}}>
            <Ionicons name="notifications-outline" size={24} color="#5C1A1A" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ScrollView mengisi sisa ruang di antara header dan checkout */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.decorativeDivider} />

        {cartItems.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
            onRemove={handleRemove}
            formatRupiah={formatRupiah}
          />
        ))}

        {/* Promo */}
        <View style={styles.promoSection}>
          <View style={styles.promoRow}>
            <Ionicons name="pricetag-outline" size={16} color="#8B3A3A" />
            <Text style={styles.promoLabel}>Kode Promo</Text>
          </View>
          <TouchableOpacity style={styles.promoAddBtn}>
            <Text style={styles.promoAddText}>Tambah</Text>
          </TouchableOpacity>
        </View>

        {/* Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Ringkasan Pesanan</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{formatRupiah(subtotal)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Ongkos Kirim</Text>
            <Text style={styles.summaryValue}>{formatRupiah(shippingCost)}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatRupiah(total)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Checkout Button — paddingBottom memperhitungkan tinggi tab bar */}
      <View style={[styles.checkoutWrapper, { paddingBottom: TAB_BAR_HEIGHT + (insets.bottom > 0 ? insets.bottom : 12) }]}>
        <TouchableOpacity
          style={styles.checkoutBtn}
          activeOpacity={0.85}
          onPress={() => navigation?.navigate('Checkout')}
        >
          <Ionicons name="lock-closed-outline" size={16} color="#FAFAF7" />
          <Text style={styles.checkoutBtnText}>Lanjut ke Pembayaran</Text>
        </TouchableOpacity>
      </View>
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
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E8DDD4',
  },
  headerTitle: {
    fontFamily: 'Playfair',
    fontSize: 20,
    color: '#5C1A1A',
    letterSpacing: 0.3,
  },
  headerCount: {
    fontFamily: 'Poppins',
    fontSize: 12,
    color: '#8B3A3A',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },
  decorativeDivider: {
    height: 2,
    backgroundColor: '#8B3A3A',
    width: 40,
    marginVertical: 16,
    borderRadius: 2,
  },

  // Cart Item
  cartItemContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 14,
    padding: 12,
    shadowColor: '#2C0A0A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  imageWrapper: {
    width: 90,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F0E8DF',
  },
  productImage: { width: '100%', height: '100%' },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemCategory: {
    fontFamily: 'Poppins',
    fontSize: 10,
    color: '#8B3A3A',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  itemName: {
    fontFamily: 'PoppinsSemiBold',
    fontSize: 13,
    color: '#2C0A0A',
    lineHeight: 18,
    marginTop: 2,
  },
  sizeTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#F5EDE5',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 4,
  },
  sizeText: { fontFamily: 'Poppins', fontSize: 10, color: '#5C1A1A' },
  itemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  itemPrice: { fontFamily: 'PoppinsSemiBold', fontSize: 13, color: '#5C1A1A' },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0D3C8',
    borderRadius: 8,
    overflow: 'hidden',
  },
  qtyBtn: { paddingHorizontal: 10, paddingVertical: 5, backgroundColor: '#FBF6F1' },
  qtyBtnDisabled: { backgroundColor: '#F5F5F5' },
  qtyText: {
    fontFamily: 'PoppinsMedium',
    fontSize: 13,
    color: '#2C0A0A',
    paddingHorizontal: 10,
    minWidth: 28,
    textAlign: 'center',
  },

  // Promo
  promoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EAE0D8',
    borderStyle: 'dashed',
  },
  promoRow: { flexDirection: 'row', alignItems: 'center' },
  promoLabel: {
    fontFamily: 'PoppinsMedium',
    fontSize: 13,
    color: '#5C1A1A',
    marginLeft: 8,
  },
  promoAddBtn: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#8B3A3A',
  },
  promoAddText: { fontFamily: 'PoppinsSemiBold', fontSize: 12, color: '#8B3A3A' },

  // Summary
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 18,
    shadowColor: '#2C0A0A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryTitle: {
    fontFamily: 'Playfair',
    fontSize: 17,
    color: '#2C0A0A',
    marginBottom: 14,
    letterSpacing: 0.2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryLabel: { fontFamily: 'Poppins', fontSize: 13, color: '#7A6A65' },
  summaryValue: { fontFamily: 'PoppinsMedium', fontSize: 13, color: '#2C0A0A' },
  summaryDivider: { height: 1, backgroundColor: '#EAE0D8', marginVertical: 10 },
  totalLabel: { fontFamily: 'PoppinsSemiBold', fontSize: 15, color: '#2C0A0A' },
  totalValue: { fontFamily: 'Playfair', fontSize: 17, color: '#5C1A1A' },

  // Checkout — layout normal (bukan absolute), otomatis menempel di bawah scroll
  checkoutWrapper: {
    backgroundColor: '#FAFAF7',
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 0.5,
    borderTopColor: '#E8DDD4',
  },
  checkoutBtn: {
    backgroundColor: '#6B0000',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    gap: 8,
  },
  checkoutBtnText: {
    fontFamily: 'PoppinsSemiBold',
    fontSize: 15,
    color: '#FAFAF7',
    letterSpacing: 0.3,
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyIconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F5EDE5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: { fontFamily: 'Playfair', fontSize: 22, color: '#2C0A0A', marginBottom: 10 },
  emptySubtitle: {
    fontFamily: 'Poppins',
    fontSize: 13,
    color: '#9B8A85',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  shopBtn: {
    backgroundColor: '#5C1A1A',
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 13,
  },
  shopBtnText: { fontFamily: 'PoppinsSemiBold', fontSize: 14, color: '#FAFAF7', letterSpacing: 0.3 },
});