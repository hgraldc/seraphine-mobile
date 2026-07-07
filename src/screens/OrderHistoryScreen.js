import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
  Alert,
  Dimensions,
  RefreshControl
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useFormatter } from "../hooks/useFormatter";
import { orderService } from "../services/orderService";
import CustomAlert from "../components/CustomAlert";
import Skeleton from "../components/Skeleton";

const TAB_BAR_HEIGHT = 70;

const STATUS_CONFIG = {
  menunggu: {
    label: "Menunggu",
    icon: "time-outline",
    bg: "#FFF3E0",
    color: "#E65100",
  },
  diproses: {
    label: "Diproses",
    icon: "cube-outline",
    bg: "#FFF8E6",
    color: "#B07800",
  },
  dikirim: {
    label: "Dikirim",
    icon: "car-outline",
    bg: "#EAF0FF",
    color: "#2255CC",
  },
  selesai: {
    label: "Selesai",
    icon: "checkmark-circle-outline",
    bg: "#E8F5E9",
    color: "#2E7D32",
  },
  batal: {
    label: "Dibatalkan",
    icon: "close-circle-outline",
    bg: "#FFEBEE",
    color: "#C62828",
  },
};

const FILTERS = [
  { id: "semua", label: "Semua" },
  { id: "menunggu", label: "Menunggu" },
  { id: "diproses", label: "Diproses" },
  { id: "dikirim", label: "Dikirim" },
  { id: "selesai", label: "Selesai" },
  { id: "batal", label: "Batal" }
];

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.menunggu;
  return (
    <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
      <Ionicons name={cfg.icon} size={12} color={cfg.color} />
      <Text style={[styles.badgeText, { color: cfg.color }]}>{cfg.label}</Text>
    </View>
  );
}

function OrderCard({ order, onCancel, formatRupiah }) {
  const navigation = useNavigation();
  const firstItem = order.detail_pesanan && order.detail_pesanan.length > 0 ? order.detail_pesanan[0] : null;

  return (
    <View style={styles.card}>
      {/* Card Header */}
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.orderId}>ID: INV-{order.id_pesanan}</Text>
          <Text style={styles.orderDate}>
            {new Date(order.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
          </Text>
        </View>
        <StatusBadge status={order.status_pesanan} />
      </View>

      <View style={styles.cardDivider} />

      {/* Product Image */}
      {firstItem && (
        <>
          <View style={styles.productImageWrapper}>
            {firstItem.produk?.gambar ? (
              <Image
                source={{ uri: firstItem.produk.gambar }}
                style={styles.productImage}
                resizeMode="cover"
              />
            ) : (
              <Image
                source={require("../assets/img/hero.jpeg")}
                style={styles.productImage}
                resizeMode="cover"
              />
            )}
          </View>

          {/* Product Info */}
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{firstItem.produk?.nama_produk || 'Produk Seraphine'}</Text>
            <Text style={styles.productMeta}>Ukuran: {firstItem.ukuran || '-'}</Text>
            <Text style={styles.productMeta}>Jumlah: {firstItem.jumlah} pcs</Text>
            {order.detail_pesanan.length > 1 && (
              <Text style={[styles.productMeta, { marginTop: 4, color: '#C62828' }]}>
                + {order.detail_pesanan.length - 1} produk lainnya
              </Text>
            )}
          </View>
        </>
      )}

      {/* Total */}
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total Belanja</Text>
        <Text style={styles.totalValue}>{formatRupiah(order.total_harga)}</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.btnOutline}
          activeOpacity={0.8}
          onPress={() => navigation.navigate("OrderDetail", { orderId: order.id_pesanan })}
        >
          <Text style={styles.btnOutlineText}>Lihat Detail</Text>
        </TouchableOpacity>

        {order.status_pesanan === "menunggu" && (
          <TouchableOpacity
            style={styles.btnFilledBatal}
            activeOpacity={0.8}
            onPress={() => onCancel(order.id_pesanan)}
          >
            <Text style={styles.btnFilledText}>Batalkan</Text>
          </TouchableOpacity>
        )}

        {order.status_pesanan === "dikirim" && (
          <TouchableOpacity
            style={styles.btnFilledTrack}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("TrackPackage", { 
              orderId: order.id_pesanan,
              productImage: firstItem?.produk?.gambar || null,
              productName: firstItem?.produk?.nama_produk || 'Produk'
            })}
          >
            <Ionicons name="navigate-outline" size={14} color="#FAFAF7" />
            <Text style={styles.btnFilledTrackText}>Lacak Paket</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

function OrderSkeleton() {
  return (
    <View style={styles.card}>
      {/* Header Skeleton */}
      <View style={styles.cardHeader}>
        <View style={styles.storeInfo}>
          <Skeleton width={20} height={20} borderRadius={10} />
          <Skeleton width={100} height={14} style={{ marginLeft: 6 }} />
        </View>
        <Skeleton width={60} height={20} borderRadius={10} />
      </View>
      <View style={styles.divider} />

      {/* Body Skeleton */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Skeleton width={60} height={60} borderRadius={4} />
        <View style={{ marginLeft: 12, flex: 1, gap: 6 }}>
          <Skeleton width="80%" height={16} />
          <Skeleton width="40%" height={12} />
          <Skeleton width="30%" height={12} />
        </View>
      </View>

      {/* Total & Action Skeleton */}
      <View style={[styles.totalRow, { marginTop: 16 }]}>
        <Skeleton width={80} height={14} />
        <Skeleton width={100} height={18} />
      </View>
      <View style={styles.actionsRow}>
        <Skeleton width="100%" height={36} borderRadius={8} />
      </View>
    </View>
  );
}

export default function OrderHistoryScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { formatRupiah } = useFormatter();

  const [activeFilter, setActiveFilter] = useState("semua");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ visible: false, title: '', message: '', type: 'info' });

  const fetchOrders = async () => {
    try {
      const response = await orderService.getOrders({ page: 1, limit: 10 });
      if (response.success && response.data) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error("Gagal memuat pesanan:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const initFetch = async () => {
        setLoading(true);
        await fetchOrders();
        setLoading(false);
      };
      initFetch();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  const filtered = activeFilter === "semua" 
    ? orders 
    : orders.filter((o) => o.status_pesanan === activeFilter);

  const handleCancelPrompt = (orderId) => {
    setAlertConfig({
      visible: true,
      title: 'Batalkan Pesanan?',
      message: 'Apakah Anda yakin ingin membatalkan pesanan ini? Aksi ini tidak dapat diurungkan.',
      type: 'confirm',
      onConfirm: () => confirmCancel(orderId),
      onCancel: () => setAlertConfig(prev => ({...prev, visible: false}))
    });
  };

  const confirmCancel = async (orderId) => {
    setAlertConfig(prev => ({...prev, visible: false}));
    setCanceling(true);
    try {
      const res = await orderService.cancelOrder(orderId);
      if (res.success) {
        setAlertConfig({
          visible: true,
          title: 'Berhasil',
          message: 'Pesanan telah berhasil dibatalkan.',
          type: 'success',
          onConfirm: () => {
            setAlertConfig(prev => ({...prev, visible: false}));
            fetchOrders();
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

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
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
        <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="bag-outline" size={22} color="#2C0A0A" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 16 },
        ]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#5C1A1A"]} />
        }
      >
        {/* Page Title */}
        <Text style={styles.pageTitle}>Riwayat Pesanan</Text>
        <Text style={styles.pageSubtitle}>
          A curated archive of your acquired heritage textiles.
        </Text>

        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.id}
              style={[
                styles.filterChip,
                activeFilter === f.id && styles.filterChipActive,
              ]}
              onPress={() => setActiveFilter(f.id)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === f.id && styles.filterTextActive,
                ]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Order Cards */}
        {loading ? (
          <View style={{ gap: 16 }}>
            <OrderSkeleton />
            <OrderSkeleton />
            <OrderSkeleton />
          </View>
        ) : filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={48} color="#C8B8A8" />
            <Text style={styles.emptyText}>
              Tidak ada pesanan di kategori ini.
            </Text>
          </View>
        ) : (
          filtered.map((order) => (
            <OrderCard key={order.id_pesanan} order={order} onCancel={handleCancelPrompt} formatRupiah={formatRupiah} />
          ))
        )}
      </ScrollView>

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
    backgroundColor: "#FAFAF7",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E8DDD4",
  },
  backButton: {
    marginRight: 8,
  },
  brandName: {
    fontFamily: "Playfair",
    fontSize: 22,
    color: "#5C1A1A",
    letterSpacing: 0.4,
    flex: 1,
    textAlign: "center",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  pageTitle: {
    fontFamily: "Playfair",
    fontSize: 32,
    color: "#1A0A0A",
    letterSpacing: 0.3,
    marginBottom: 6,
  },
  pageSubtitle: {
    fontFamily: "Poppins",
    fontSize: 13,
    color: "#7A6A65",
    lineHeight: 20,
    marginBottom: 20,
  },
  filterScroll: {
    gap: 8,
    paddingBottom: 20,
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: "#D4C4BC",
    backgroundColor: "transparent",
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: "#6B0000",
    borderColor: "#6B0000",
  },
  filterText: {
    fontFamily: "PoppinsMedium",
    fontSize: 13,
    color: "#5C1A1A",
  },
  filterTextActive: {
    color: "#FAFAF7",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#2C0A0A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  orderId: {
    fontFamily: "PoppinsMedium",
    fontSize: 11,
    color: "#9B8A85",
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  orderDate: {
    fontFamily: "PoppinsMedium",
    fontSize: 13,
    color: "#2C0A0A",
  },
  cardDivider: {
    height: 0.5,
    backgroundColor: "#F0E8E2",
    marginHorizontal: 0,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeText: {
    fontFamily: "PoppinsMedium",
    fontSize: 11,
    marginLeft: 3,
  },
  productImageWrapper: {
    width: "100%",
    height: 180,
    backgroundColor: "#E8DDD5",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  productInfo: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 4,
  },
  productName: {
    fontFamily: "Playfair",
    fontSize: 20,
    color: "#5C1A1A",
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  productMeta: {
    fontFamily: "Poppins",
    fontSize: 13,
    color: "#7A6A65",
    lineHeight: 20,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 0.5,
    borderTopColor: "#F0E8E2",
    marginTop: 10,
  },
  totalLabel: {
    fontFamily: "Poppins",
    fontSize: 13,
    color: "#7A6A65",
  },
  totalValue: {
    fontFamily: "Playfair",
    fontSize: 18,
    color: "#1A0A0A",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  btnOutline: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#C4B5AE",
    alignItems: "center",
    justifyContent: "center",
  },
  btnOutlineText: {
    fontFamily: "PoppinsMedium",
    fontSize: 13,
    color: "#2C0A0A",
  },
  btnFilledBatal: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: "#FFF",
    borderWidth: 1.5,
    borderColor: "#C62828",
    alignItems: "center",
    justifyContent: "center",
  },
  btnFilledText: {
    fontFamily: 'PoppinsSemiBold',
    fontSize: 13,
    color: '#C62828',
  },
  btnFilledTrack: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: '#6B0000',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  btnFilledTrackText: {
    fontFamily: 'PoppinsSemiBold',
    fontSize: 13,
    color: '#FAFAF7',
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    fontFamily: "Poppins",
    fontSize: 13,
    color: "#9B8A85",
    textAlign: "center",
  },
});
