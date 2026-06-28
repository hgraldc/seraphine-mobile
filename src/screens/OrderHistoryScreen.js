import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useFormatter } from "../hooks/useFormatter";

const TAB_BAR_HEIGHT = 70;

// ─── Status config ─────────────────────────────────────────────────
const STATUS_CONFIG = {
  Dikirim: {
    label: "Dikirim",
    icon: "car-outline",
    bg: "#EAF0FF",
    color: "#2255CC",
  },
  Dikemas: {
    label: "Dikemas",
    icon: "cube-outline",
    bg: "#FFF8E6",
    color: "#B07800",
  },
  Selesai: {
    label: "Selesai",
    icon: "checkmark-circle-outline",
    bg: "#E8F5E9",
    color: "#2E7D32",
  },
};

// ─── Dummy Orders ──────────────────────────────────────────────────
const DUMMY_ORDERS = [
  {
    id: "ST-2023-089",
    date: "12 Oktober 2023",
    status: "Dikirim",
    productName: "Pahikung Habaku Motif",
    meta1: "Artisan: Rambu Kahi",
    meta2: "Dimensions: 240cm x 120cm",
    total: 8500000,
    image: require("../assets/img/hero.jpeg"),
    actions: ["detail", "track"],
  },
  {
    id: "ST-2023-102",
    date: "15 Oktober 2023",
    status: "Dikemas",
    productName: "Hinggi Kombu Andung",
    meta1: "Pre-order Custom Sizing",
    meta2: "Motif: Skull Tree",
    total: 12000000,
    image: require("../assets/img/hero.jpeg"),
    actions: ["detail"],
  },
  {
    id: "ST-2023-014",
    date: "02 Agustus 2023",
    status: "Selesai",
    productName: "Lau Pahudu Kiku",
    meta1: "Artisan Collection",
    meta2: "Acquired",
    total: 6200000,
    image: require("../assets/img/hero.jpeg"),
    actions: ["certificate", "rebuy"],
  },
];

const FILTERS = ["Semua", "Dikemas", "Dikirim", "Selesai"];

const formatRupiahLocal = (amount) =>
  "Rp " + Number(amount).toLocaleString("id-ID");

// ─── Status Badge ──────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status];
  if (!cfg) return null;
  return (
    <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
      <Ionicons name={cfg.icon} size={12} color={cfg.color} />
      <Text style={[styles.badgeText, { color: cfg.color }]}>{cfg.label}</Text>
    </View>
  );
}

// ─── Order Card ────────────────────────────────────────────────────
function OrderCard({ order }) {
  const navigation = useNavigation();

  return (
    <View style={styles.card}>
      {/* Card Header */}
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.orderId}>ID: {order.id}</Text>
          <Text style={styles.orderDate}>{order.date}</Text>
        </View>
        <StatusBadge status={order.status} />
      </View>

      <View style={styles.cardDivider} />

      {/* Product Image */}
      <View style={styles.productImageWrapper}>
        <Image
          source={order.image}
          style={styles.productImage}
          resizeMode="cover"
        />
      </View>

      {/* Product Info */}
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{order.productName}</Text>
        <Text style={styles.productMeta}>{order.meta1}</Text>
        <Text style={styles.productMeta}>{order.meta2}</Text>
      </View>

      {/* Total */}
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{formatRupiahLocal(order.total)}</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsRow}>
        {order.actions.includes("detail") && (
          <TouchableOpacity
            style={styles.btnOutline}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate("OrderDetail", { orderId: order.id })
            }
          >
            <Text style={styles.btnOutlineText}>Lihat Detail</Text>
          </TouchableOpacity>
        )}
        {order.actions.includes("track") && (
          <TouchableOpacity
            style={styles.btnFilled}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate("TrackPackage", { orderId: order.id })
            }
          >
            <Ionicons name="navigate-outline" size={14} color="#FAFAF7" />
            <Text style={styles.btnFilledText}>Lacak Paket</Text>
          </TouchableOpacity>
        )}
        {order.actions.includes("certificate") && (
          <TouchableOpacity
            style={styles.btnOutline}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate("Certificate", { orderId: order.id })
            }
          >
            <Text style={styles.btnOutlineText}>Sertifikat</Text>
          </TouchableOpacity>
        )}
        {order.actions.includes("rebuy") && (
          <TouchableOpacity
            style={styles.btnFilled}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("Catalog")}
          >
            <Text style={styles.btnFilledText}>Beli Lagi</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

// ─── Main Screen ───────────────────────────────────────────────────
export default function OrderHistoryScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState("Semua");

  const filtered =
    activeFilter === "Semua"
      ? DUMMY_ORDERS
      : DUMMY_ORDERS.filter((o) => o.status === activeFilter);

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
              key={f}
              style={[
                styles.filterChip,
                activeFilter === f && styles.filterChipActive,
              ]}
              onPress={() => setActiveFilter(f)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === f && styles.filterTextActive,
                ]}
              >
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Order Cards */}
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={48} color="#C8B8A8" />
            <Text style={styles.emptyText}>
              Tidak ada pesanan di kategori ini.
            </Text>
          </View>
        ) : (
          filtered.map((order) => <OrderCard key={order.id} order={order} />)
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FAFAF7",
  },

  // Top Bar
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

  // Scroll
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  // Page Title
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

  // Filter
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

  // Card
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

  // Badge
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

  // Product
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

  // Total
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

  // Actions
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
  btnFilled: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: "#6B0000",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },
  btnFilledText: {
    fontFamily: "PoppinsSemiBold",
    fontSize: 13,
    color: "#FAFAF7",
  },

  // Empty
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
