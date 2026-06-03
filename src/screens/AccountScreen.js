import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons";

// ─── Menu Items ────────────────────────────────────────────────────
const MENU_ITEMS = [
  {
    id: "1",
    icon: "receipt-outline",
    label: "Riwayat Pesanan",
    screen: "OrderHistory",
  },
  {
    id: "2",
    icon: "location-outline",
    label: "Informasi Alamat",
    screen: "Address",
  },
  {
    id: "3",
    icon: "card-outline",
    label: "Metode Pembayaran",
    screen: "Payment",
  },
  {
    id: "4",
    icon: "help-circle-outline",
    label: "Pusat Bantuan",
    screen: "Help",
  },
  {
    id: "5",
    icon: "information-circle-outline",
    label: "Tentang Balai Sumba",
    screen: "About",
  },
];

// ─── Impact Stat ───────────────────────────────────────────────────
const ImpactStat = ({ value, label, showDivider }) => (
  <>
    <View style={styles.statRow}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
    {showDivider && <View style={styles.statDivider} />}
  </>
);

// ─── Main AccountScreen ────────────────────────────────────────────
export default function AccountScreen({ navigation }) {
  const handleLogout = () => {
    // handle logout
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F3EF" />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.brandName}>SUMBA HERITAGE</Text>
        <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="bag-outline" size={22} color="#2C0A0A" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Page Title */}
        <Text style={styles.pageTitle}>Profil &amp; Impact</Text>

        {/* Profile Card */}
        <View style={styles.profileRow}>
          <View style={styles.avatarWrapper}>
            <Image
              source={require("../assets/img/avatar.png")}
              style={styles.avatar}
              resizeMode="cover"
            />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Ananda Putri</Text>
            <Text style={styles.profileRole}>Heritage Collector</Text>
          </View>
        </View>

        {/* Dampak Sosial Card */}
        <View style={styles.impactCard}>
          <View style={styles.impactHeader}>
            <Text style={styles.impactTitle}>Dampak Sosial Anda</Text>
            <Ionicons
              name="leaf-outline"
              size={20}
              color="rgba(255,255,255,0.7)"
            />
          </View>

          <ImpactStat value="3" label="KAIN TERBELI" showDivider />
          <ImpactStat value="2" label="PERAJIN TERBANTU" showDivider />
          <ImpactStat
            value={
              <Text style={styles.statValue}>
                1.5<Text style={styles.statUnit}>jt</Text>
              </Text>
            }
            label="KONTRIBUSI (RP)"
            showDivider={false}
          />
        </View>

        {/* Menu List */}
        <View style={styles.menuContainer}>
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                index < MENU_ITEMS.length - 1 && styles.menuItemBorder,
              ]}
              onPress={() => navigation?.navigate(item.screen)}
              activeOpacity={0.7}
            >
              <View style={styles.menuLeft}>
                <Ionicons
                  name={item.icon}
                  size={20}
                  color="#5C1A1A"
                  style={styles.menuIcon}
                />
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#C4B5AE" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={20} color="#5C1A1A" />
          <Text style={styles.logoutText}>Keluar</Text>
        </TouchableOpacity>

        {/* Spacer tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F3EF",
  },

  // Top Bar
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E2D9D0",
    backgroundColor: "#F5F3EF",
  },
  brandName: {
    fontFamily: "PoppinsMedium",
    fontSize: 11,
    color: "#5C1A1A",
    letterSpacing: 2.5,
    textTransform: "uppercase",
  },

  // Scroll
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 28,
  },

  // Page Title
  pageTitle: {
    fontFamily: "Playfair",
    fontSize: 32,
    color: "#1A0A0A",
    letterSpacing: 0.3,
    marginBottom: 28,
  },

  // Profile
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },
  avatarWrapper: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#E8DDD4",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  profileInfo: {
    marginLeft: 16,
  },
  profileName: {
    fontFamily: "Playfair",
    fontSize: 22,
    color: "#1A0A0A",
    letterSpacing: 0.2,
    marginBottom: 4,
  },
  profileRole: {
    fontFamily: "Poppins",
    fontSize: 13,
    color: "#7A6A65",
  },

  // Impact Card
  impactCard: {
    backgroundColor: "#6B0000",
    borderRadius: 16,
    padding: 24,
    marginBottom: 28,
  },
  impactHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  impactTitle: {
    fontFamily: "Playfair",
    fontSize: 18,
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  statRow: {
    paddingVertical: 14,
  },
  statValue: {
    fontFamily: "Playfair",
    fontSize: 36,
    color: "#FFFFFF",
    lineHeight: 40,
  },
  statUnit: {
    fontFamily: "Playfair",
    fontSize: 20,
    color: "#FFFFFF",
  },
  statLabel: {
    fontFamily: "PoppinsMedium",
    fontSize: 10,
    color: "rgba(255,255,255,0.6)",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginTop: 2,
  },
  statDivider: {
    height: 0.5,
    backgroundColor: "rgba(255,255,255,0.2)",
  },

  // Menu
  menuContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 4,
    marginBottom: 8,
    shadowColor: "#2C0A0A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 17,
  },
  menuItemBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#F0E8E2",
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuIcon: {
    marginRight: 14,
    width: 22,
  },
  menuLabel: {
    fontFamily: "PoppinsMedium",
    fontSize: 14,
    color: "#2C0A0A",
  },

  // Logout
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 4,
    gap: 12,
  },
  logoutText: {
    fontFamily: "PoppinsSemiBold",
    fontSize: 14,
    color: "#5C1A1A",
    marginLeft: 4,
  },
});
