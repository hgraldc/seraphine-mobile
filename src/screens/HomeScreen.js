import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search, Heart } from "lucide-react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { categoryService } from "../services/categoryService";
import { productService } from "../services/productService";
import { userService } from "../services/userService";
import { articleService } from "../services/articleService";
import { useFormatter } from "../hooks/useFormatter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Skeleton from "../components/Skeleton";
import { moderateScale, scale, verticalScale } from "../utils/responsive";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const PRODUCT_CARD_WIDTH = SCREEN_WIDTH * 0.42;
const BLOG_CARD_WIDTH = SCREEN_WIDTH * 0.58;



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

// ── Placeholder warna untuk dummy image ───────────────────────────
const PLACEHOLDER_COLORS = ["#D4C4B8", "#C8B8A8", "#BFB0A2", "#D8CCBF", "#C2B5A8"];

function ProductSkeleton() {
  return (
    <View style={styles.productCard}>
      <Skeleton width="100%" height={200} borderRadius={8} />
      <View style={{ marginTop: 12 }}>
        <Skeleton width="90%" height={16} />
        <Skeleton width="60%" height={16} style={{ marginTop: 4 }} />
        <Skeleton width="50%" height={14} style={{ marginTop: 8 }} />
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const navigation = useNavigation();
  const { formatRupiah } = useFormatter();
  
  const [activeCategoryId, setActiveCategoryId] = useState("semua");
  const [categories, setCategories] = useState([{ id_kategori: "semua", nama_kategori: "Semua" }]);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  
  const [articles, setArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState("Guest");

  const fetchProfile = async () => {
    try {
      const cachedUser = await AsyncStorage.getItem("userInfo");
      if (cachedUser) {
        const parsed = JSON.parse(cachedUser);
        if (parsed.nama_lengkap) {
          setUserName(parsed.nama_lengkap.split(" ")[0]);
        }
      }
      const res = await userService.getProfile();
      if (res.success && res.data) {
        setUserName(res.data.nama_lengkap.split(" ")[0]);
        await AsyncStorage.setItem("userInfo", JSON.stringify(res.data));
      }
    } catch (error) {
      console.error("Gagal memuat profil di Home:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      if (response.success && response.data) {
        setCategories([{ id_kategori: "semua", nama_kategori: "Semua" }, ...response.data]);
      }
    } catch (error) {
      console.error("Gagal memuat kategori:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const params = { limit: 10, page: 1 };
      if (activeCategoryId !== "semua") {
        params.id_kategori = activeCategoryId;
      }
      const response = await productService.getProducts(params);
      if (response.success && response.data) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error("Gagal memuat produk:", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchArticles = async () => {
    try {
      setLoadingArticles(true);
      const response = await articleService.getArticles();
      if (response.success && response.data) {
        setArticles(response.data);
      }
    } catch (error) {
      console.error("Gagal memuat artikel:", error);
    } finally {
      setLoadingArticles(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [])
  );

  useEffect(() => {
    fetchCategories();
    fetchArticles();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [activeCategoryId]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchProfile(), fetchCategories(), fetchProducts(), fetchArticles()]);
    setRefreshing(false);
  }, [activeCategoryId]);

  return (
    // edges={['top']} → SafeAreaView hanya handle top safe area
    // bottom dihandle tab bar dari RootNavigation
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F3EE" />

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Welcome Back,{" "}
          <Text style={styles.greetingBold}>{userName}</Text>
        </Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation?.navigate("Wishlist")}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Heart color="#3A0000" size={20} strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation?.navigate("Search")}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Search color="#3A0000" size={20} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#5C1A1A"]} />
        }
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
            <TouchableOpacity 
              style={styles.heroButton}
              onPress={() => navigation.navigate("Catalog")}
            >
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
            {categories.map((cat) => {
              const isActive = activeCategoryId === cat.id_kategori;
              return (
                <TouchableOpacity
                  key={cat.id_kategori.toString()}
                  style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                  onPress={() => setActiveCategoryId(cat.id_kategori)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[styles.categoryChipText, isActive && styles.categoryChipTextActive]}
                  >
                    {cat.nama_kategori}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

        {/* ── PRODUCTS ── */}
        {loadingProducts ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productScroll}
          >
            {[1, 2, 3].map((key) => (
              <ProductSkeleton key={key} />
            ))}
          </ScrollView>
        ) : products.length === 0 ? (
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
            {products.map((item, index) => (
              <TouchableOpacity
                key={item.id_produk.toString()}
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
                  {item.stok > 0 && (
                    <View style={styles.badgeWrapper}>
                      <Text style={styles.badgeText}>Sisa Stok: {item.stok}</Text>
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
          <TouchableOpacity onPress={() => navigation.navigate('ArticleList')}>
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
          {loadingArticles ? (
            [1, 2].map((i) => (
              <View key={i} style={[styles.blogCard, { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#F0EBE6' }]}>
                <View style={styles.blogImageContainer}>
                  <Skeleton width="100%" height="100%" />
                </View>
                <View style={styles.blogInfo}>
                  <Skeleton width="90%" height={16} style={{ marginBottom: 4 }} />
                  <Skeleton width="70%" height={16} style={{ marginBottom: 12 }} />
                  <Skeleton width={100} height={14} />
                </View>
              </View>
            ))
          ) : (
            articles.map((blog, index) => (
              <TouchableOpacity 
                key={blog.id_artikel} 
                style={styles.blogCard} 
                activeOpacity={0.88}
                onPress={() => navigation.navigate("ArticleDetail", { articleId: blog.id_artikel })}
              >
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
                  <Text style={styles.blogTitle} numberOfLines={2}>{blog.judul}</Text>
                  <View style={styles.blogButton}>
                    <Text style={styles.blogButtonText}>BACA CERITA</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
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
    fontSize: moderateScale(22),
    color: "#7B0000",
    fontFamily: "Playfair",
  },
  greetingBold: {
    fontFamily: "Playfair",
    color: "#3A0000",
  },
  iconButton: {
    width: moderateScale(42),
    height: moderateScale(42),
    borderRadius: moderateScale(21),
    backgroundColor: "#EEE7DF",
    justifyContent: "center",
    alignItems: "center",
  },

  heroContainer: {
    marginHorizontal: scale(16),
    marginTop: verticalScale(4),
    height: verticalScale(300),
    borderRadius: moderateScale(24),
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
    bottom: verticalScale(26),
    left: scale(24),
    right: scale(24),
  },
  heroTitle: {
    fontSize: moderateScale(34),
    color: "#FFFFFF",
    lineHeight: moderateScale(42),
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

  sectionHeader: {
    marginTop: verticalScale(28),
    marginBottom: verticalScale(14),
    paddingHorizontal: scale(20),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: moderateScale(24),
    color: "#7B0000",
    fontFamily: "PlayfairItalic",
  },
  seeAll: {
    fontSize: moderateScale(12),
    color: "#9A8C8C",
    fontFamily: "PoppinsSemiBold",
    letterSpacing: 0.5,
  },

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
    fontSize: moderateScale(14),
    color: "#6E6464",
    fontFamily: "PoppinsMedium",
  },
  categoryChipTextActive: {
    color: "#FFFFFF",
  },

  centered: {
    height: PRODUCT_CARD_WIDTH * 1.5,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  emptyText: {
    fontSize: moderateScale(13),
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
    fontSize: moderateScale(13),
    color: "#3A0000",
    fontFamily: "PoppinsSemiBold",
    lineHeight: moderateScale(19),
  },
  productPrice: {
    marginTop: verticalScale(5),
    fontSize: moderateScale(12),
    color: "#6E6464",
    fontFamily: "PoppinsMedium",
  },

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
    fontSize: moderateScale(20),
    color: "#3A0000",
    fontFamily: "Playfair",
    lineHeight: moderateScale(26),
  },
  blogButton: {
    marginTop: 8,
    alignSelf: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "#7B0000",
    paddingBottom: 2,
  },
  blogButtonText: {
    fontSize: moderateScale(10),
    color: "#7B0000",
    fontFamily: "PoppinsSemiBold",
    letterSpacing: 1,
  },
});