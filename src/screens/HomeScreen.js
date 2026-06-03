import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search } from "lucide-react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const PRODUCT_CARD_WIDTH = SCREEN_WIDTH * 0.42;
const BLOG_CARD_WIDTH = SCREEN_WIDTH * 0.58;

const CATEGORIES = ["Semua", "Kain", "Tas", "Aksesoris"];

// ── Dummy Products ─────────────────────────────────────────────────
const DUMMY_PRODUCTS = [
  {
    id: "1",
    nama_produk: "Kain Pahikung Sumba - Motif Kuda",
    harga: 2500000,
    kategori: "Kain",
    badge: true,
    gambar: null,
  },
  {
    id: "2",
    nama_produk: "Tas Selempang Tenun Hinggi",
    harga: 850000,
    kategori: "Tas",
    badge: false,
    gambar: null,
  },
  {
    id: "3",
    nama_produk: "Kain Hinggi Sumba Klasik",
    harga: 3200000,
    kategori: "Kain",
    badge: true,
    gambar: null,
  },
  {
    id: "4",
    nama_produk: "Dompet Tenun Motif Sekong",
    harga: 350000,
    kategori: "Aksesoris",
    badge: false,
    gambar: null,
  },
  {
    id: "5",
    nama_produk: "Gelang Benang Emas Sumba",
    harga: 180000,
    kategori: "Aksesoris",
    badge: false,
    gambar: null,
  },
];

// ── Dummy Blogs ────────────────────────────────────────────────────
const DUMMY_BLOGS = [
  {
    id: "1",
    judul: "Kenali Penenun Kami",
    thumbnail: null,
  },
  {
    id: "2",
    judul: "Makna di Balik Motif Pahikung",
    thumbnail: null,
  },
  {
    id: "3",
    judul: "Perjalanan Kain dari Sumba ke Dunia",
    thumbnail: null,
  },
];

const formatRupiah = (amount) =>
  "Rp " + Number(amount).toLocaleString("id-ID");

// ── Placeholder warna untuk dummy image ───────────────────────────
const PLACEHOLDER_COLORS = ["#D4C4B8", "#C8B8A8", "#BFB0A2", "#D8CCBF", "#C2B5A8"];

export default function HomeScreen({ navigation }) {
  const [activeCategory, setActiveCategory] = useState("Semua");

  const filteredProducts =
    activeCategory === "Semua"
      ? DUMMY_PRODUCTS
      : DUMMY_PRODUCTS.filter((p) => p.kategori === activeCategory);

  return (
    // edges={['top']} → SafeAreaView hanya handle top safe area
    // bottom dihandle tab bar dari RootNavigation
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F3EE" />

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Welcome Back,{" "}
          <Text style={styles.greetingBold}>John</Text>
        </Text>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation?.navigate("Search")}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Search color="#3A0000" size={20} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        {/* ── HERO ── */}
        <View style={styles.heroContainer}>
          <Image
            source={require("../assets/img/hero.jpeg")}
            style={styles.heroImage}
          />
          <View style={styles.heroGradient} />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>
              Warisan Budaya{"\n"}dalam Setiap Helai
            </Text>
            <TouchableOpacity style={styles.heroButton}>
              <Text style={styles.heroButtonText}>JELAJAHI KOLEKSI</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── CATEGORIES ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setActiveCategory(cat)}
              style={[
                styles.categoryChip,
                activeCategory === cat && styles.categoryChipActive,
              ]}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  activeCategory === cat && styles.categoryChipTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── PRODUCTS ── */}
        {filteredProducts.length === 0 ? (
          <View style={styles.centered}>
            <Text style={styles.emptyText}>
              Belum ada produk di kategori ini.
            </Text>
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productScroll}
            decelerationRate="fast"
            snapToInterval={PRODUCT_CARD_WIDTH + 14}
            snapToAlignment="start"
          >
            {filteredProducts.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={styles.productCard}
                activeOpacity={0.88}
                onPress={() => navigation?.navigate("ProductDetail", { product: item })}
              >
                {/* Image / Placeholder */}
                <View style={[
                  styles.productImageContainer,
                  { backgroundColor: PLACEHOLDER_COLORS[index % PLACEHOLDER_COLORS.length] }
                ]}>
                  {item.gambar ? (
                    <Image source={{ uri: item.gambar }} style={styles.productImage} />
                  ) : (
                    // Placeholder kosong dengan warna berbeda tiap card
                    <View style={styles.productImagePlaceholder} />
                  )}
                  {/* Badge */}
                  {item.badge && (
                    <View style={styles.badgeWrapper}>
                      <Text style={styles.badgeText}>📐 Pilihan Ukuran Kustom</Text>
                    </View>
                  )}
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={2}>
                    {item.nama_produk}
                  </Text>
                  <Text style={styles.productPrice}>
                    {formatRupiah(item.harga)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* ── BLOG ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Blog</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>SEE ALL</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.blogScroll}
          decelerationRate="fast"
          snapToInterval={BLOG_CARD_WIDTH + 14}
          snapToAlignment="start"
        >
          {DUMMY_BLOGS.map((blog, index) => (
            <TouchableOpacity key={blog.id} style={styles.blogCard} activeOpacity={0.88}>
              <View style={[
                styles.blogImageContainer,
                { backgroundColor: PLACEHOLDER_COLORS[(index + 2) % PLACEHOLDER_COLORS.length] }
              ]}>
                {blog.thumbnail ? (
                  <Image source={{ uri: blog.thumbnail }} style={styles.blogImage} />
                ) : (
                  <View style={styles.blogImagePlaceholder} />
                )}
              </View>
              <View style={styles.blogInfo}>
                <Text style={styles.blogTitle}>{blog.judul}</Text>
                <TouchableOpacity style={styles.blogButton}>
                  <Text style={styles.blogButtonText}>BACA CERITA MEREKA</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F3EE",
  },

  // ── Header — TANPA paddingTop manual, SafeAreaView edges top sudah handle ──
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 14,
    backgroundColor: "#F7F3EE",
    zIndex: 10,           // pastikan header selalu di atas ScrollView
    elevation: 1,         // Android perlu elevation agar zIndex aktif
  },
  greeting: {
    fontSize: 22,
    color: "#7B0000",
    fontFamily: "Playfair",
  },
  greetingBold: {
    fontFamily: "Playfair",
    color: "#3A0000",
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#EEE7DF",
    justifyContent: "center",
    alignItems: "center",
  },

  // ── Hero ──
  heroContainer: {
    marginHorizontal: 16,
    marginTop: 4,
    height: 300,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#C5B5A0",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  heroGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "75%",
    backgroundColor: "rgba(25,0,0,0.48)",
  },
  heroOverlay: {
    position: "absolute",
    bottom: 26,
    left: 24,
    right: 24,
  },
  heroTitle: {
    fontSize: 34,
    color: "#FFFFFF",
    lineHeight: 42,
    fontFamily: "Playfair",
  },
  heroButton: {
    marginTop: 16,
    alignSelf: "flex-start",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.7)",
    borderRadius: 999,
    paddingHorizontal: 22,
    paddingVertical: 11,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  heroButtonText: {
    color: "#FFFFFF",
    fontSize: 11,
    letterSpacing: 1.5,
    fontFamily: "PoppinsSemiBold",
  },

  // ── Section Header ──
  sectionHeader: {
    marginTop: 28,
    marginBottom: 14,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 24,
    color: "#7B0000",
    fontFamily: "PlayfairItalic",
  },
  seeAll: {
    fontSize: 12,
    color: "#9A8C8C",
    fontFamily: "PoppinsSemiBold",
    letterSpacing: 0.5,
  },

  // ── Category ──
  categoryScroll: {
    paddingLeft: 20,
    paddingRight: 10,
    gap: 10,
  },
  categoryChip: {
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: "#C5B5A8",
    backgroundColor: "transparent",
  },
  categoryChipActive: {
    backgroundColor: "#6B0000",
    borderColor: "#6B0000",
  },
  categoryChipText: {
    fontSize: 14,
    color: "#6E6464",
    fontFamily: "PoppinsMedium",
  },
  categoryChipTextActive: {
    color: "#FFFFFF",
  },

  // ── Products ──
  centered: {
    height: PRODUCT_CARD_WIDTH * 1.5,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  emptyText: {
    fontSize: 13,
    color: "#9A8C8C",
    fontFamily: "Poppins",
    textAlign: "center",
  },
  productScroll: {
    paddingLeft: 20,
    paddingRight: 10,
    marginTop: 16,
  },
  productCard: {
    width: PRODUCT_CARD_WIDTH,
    marginRight: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#5A0000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  productImageContainer: {
    width: "100%",
    height: PRODUCT_CARD_WIDTH * 1.1,
  },
  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  productImagePlaceholder: {
    width: "100%",
    height: "100%",
  },
  badgeWrapper: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: "rgba(250,248,245,0.92)",
    borderRadius: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  badgeText: {
    fontFamily: "Poppins",
    fontSize: 9,
    color: "#5C1A1A",
  },
  productInfo: {
    padding: 12,
    paddingTop: 10,
  },
  productName: {
    fontSize: 13,
    color: "#3A0000",
    fontFamily: "PoppinsSemiBold",
    lineHeight: 19,
  },
  productPrice: {
    marginTop: 5,
    fontSize: 12,
    color: "#6E6464",
    fontFamily: "PoppinsMedium",
  },

  // ── Blog ──
  blogScroll: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  blogCard: {
    width: BLOG_CARD_WIDTH,
    marginRight: 14,
    backgroundColor: "#F7F3EE",
  },
  blogImageContainer: {
    width: "100%",
    height: BLOG_CARD_WIDTH * 0.85,
    borderRadius: 18,
    overflow: "hidden",
  },
  blogImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  blogImagePlaceholder: {
    width: "100%",
    height: "100%",
  },
  blogInfo: {
    paddingTop: 12,
  },
  blogTitle: {
    fontSize: 20,
    color: "#3A0000",
    fontFamily: "Playfair",
    lineHeight: 26,
  },
  blogButton: {
    marginTop: 8,
    alignSelf: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "#7B0000",
    paddingBottom: 2,
  },
  blogButtonText: {
    fontSize: 10,
    color: "#7B0000",
    fontFamily: "PoppinsSemiBold",
    letterSpacing: 1,
  },
});