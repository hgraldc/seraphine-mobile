import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import CustomAlert from "../components/CustomAlert";
import { userService } from "../services/userService";
import { authService } from "../services/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

const ImpactStat = ({ value, label, showDivider }) => (
  <>
    <View style={styles.statRow}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
    {showDivider && <View style={styles.statDivider} />}
  </>
);

export default function AccountScreen() {
  const navigation = useNavigation();
  const [logoutAlertVisible, setLogoutAlertVisible] = useState(false);
  
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editForm, setEditForm] = useState({
    nama_lengkap: '',
    no_telepon: '',
    alamat: '',
    kota: '',
    provinsi: '',
    kode_pos: '',
  });

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState('info');
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // 1. Ambil dari Cache (Instan, 0 loading time)
      const cachedUser = await AsyncStorage.getItem("userInfo");
      if (cachedUser) {
        setUserData(JSON.parse(cachedUser));
        setLoading(false); // Hilangkan spinner langsung
      }

      // 2. Ambil dari API diam-diam
      if (!cachedUser) setLoading(true);
      const res = await userService.getProfile();
      if (res && res.success && res.data) {
        setUserData(res.data);
        await AsyncStorage.setItem("userInfo", JSON.stringify(res.data));
      }
    } catch (err) {
      console.log('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = () => {
    if (userData) {
      setEditForm({
        nama_lengkap: userData?.nama_lengkap || '',
        no_telepon: userData?.no_telepon || '',
        alamat: userData?.alamat || '',
        kota: userData?.kota || '',
        provinsi: userData?.provinsi || '',
        kode_pos: userData?.kode_pos || '',
      });
      setIsEditModalVisible(true);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const res = await userService.updateProfile(editForm);
      if (res && res.success) {
        setIsEditModalVisible(false);
        setAlertTitle('Berhasil');
        setAlertMessage(res.message || 'Profil berhasil diperbarui.');
        setAlertType('success');
        setAlertVisible(true);
        // Refresh profile data using the returned data if available, or fetch again
        if (res.data) {
          setUserData(res.data);
          await AsyncStorage.setItem("userInfo", JSON.stringify(res.data));
        } else {
          fetchProfile();
        }
      } else {
        setAlertTitle('Gagal');
        setAlertMessage(res?.message || 'Gagal memperbarui profil.');
        setAlertType('error');
        setAlertVisible(true);
      }
    } catch (err) {
      setAlertTitle('Gagal');
      setAlertMessage('Terjadi kesalahan saat memperbarui profil.');
      setAlertType('error');
      setAlertVisible(true);
    }
  };

  const handleLogout = () => {
    setLogoutAlertVisible(true);
  };

  const handleConfirmLogout = async () => {
    setLogoutAlertVisible(false);
    try {
      await authService.logout();
    } catch(e) {}
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
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
              source={userData?.foto_profil ? { uri: userData.foto_profil } : require("../assets/img/avatar.png")}
              style={styles.avatar}
              resizeMode="cover"
            />
          </View>
          <View style={[styles.profileInfo, { flex: 1 }]}>
            {loading ? (
              <ActivityIndicator size="small" color="#8B1A1A" style={{ alignSelf: 'flex-start' }} />
            ) : (
              <>
                <Text style={styles.profileName} numberOfLines={1}>{userData?.nama_lengkap || 'Pengguna'}</Text>
                <Text style={styles.profileRole} numberOfLines={1}>{userData?.email || 'Email tidak tersedia'}</Text>
              </>
            )}
          </View>
          <TouchableOpacity onPress={handleOpenEdit} style={styles.editBtn}>
            <Ionicons name="pencil" size={18} color="#5C1A1A" />
          </TouchableOpacity>
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

      {/* Modal Edit Profil */}
      <Modal visible={isEditModalVisible} animationType="slide" transparent={true} onRequestClose={() => setIsEditModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
            style={styles.modalContainer}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Profil</Text>
                <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#1A0A0A" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Nama Lengkap</Text>
                  <TextInput
                    style={styles.input}
                    value={editForm.nama_lengkap}
                    onChangeText={(val) => setEditForm({...editForm, nama_lengkap: val})}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>No. Telepon</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="phone-pad"
                    value={editForm.no_telepon}
                    onChangeText={(val) => setEditForm({...editForm, no_telepon: val})}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Alamat</Text>
                  <TextInput
                    style={styles.input}
                    value={editForm.alamat}
                    onChangeText={(val) => setEditForm({...editForm, alamat: val})}
                  />
                </View>
                <View style={styles.rowInputs}>
                  <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.inputLabel}>Kota</Text>
                    <TextInput
                      style={styles.input}
                      value={editForm.kota}
                      onChangeText={(val) => setEditForm({...editForm, kota: val})}
                    />
                  </View>
                  <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                    <Text style={styles.inputLabel}>Provinsi</Text>
                    <TextInput
                      style={styles.input}
                      value={editForm.provinsi}
                      onChangeText={(val) => setEditForm({...editForm, provinsi: val})}
                    />
                  </View>
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Kode Pos</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="number-pad"
                    value={editForm.kode_pos}
                    onChangeText={(val) => setEditForm({...editForm, kode_pos: val})}
                  />
                </View>

                <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile}>
                  <Text style={styles.saveBtnText}>Simpan Perubahan</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      <CustomAlert
        visible={logoutAlertVisible}
        type="confirm"
        title="Konfirmasi Logout"
        message="Apakah Anda yakin ingin keluar?"
        onCancel={() => setLogoutAlertVisible(false)}
        onConfirm={handleConfirmLogout}
        cancelText="Batal"
        confirmText="Keluar"
      />

      <CustomAlert
        visible={alertVisible}
        type={alertType}
        title={alertTitle}
        message={alertMessage}
        onConfirm={() => setAlertVisible(false)}
        confirmText="Tutup"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F3EF",
  },

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

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 28,
  },

  pageTitle: {
    fontFamily: "Playfair",
    fontSize: 32,
    color: "#1A0A0A",
    letterSpacing: 0.3,
    marginBottom: 28,
  },

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
  editBtn: {
    padding: 10,
    backgroundColor: '#E8DDD4',
    borderRadius: 20,
  },

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

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    maxHeight: '90%',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontFamily: 'Playfair',
    fontSize: 22,
    color: '#1A0A0A',
  },
  inputGroup: {
    marginBottom: 16,
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputLabel: {
    fontFamily: 'PoppinsMedium',
    fontSize: 12,
    color: '#7A6A65',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1.5,
    borderColor: '#E2D9D0',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontFamily: 'Poppins',
    fontSize: 14,
    color: '#1A0A0A',
    backgroundColor: '#FAF9F7',
  },
  saveBtn: {
    backgroundColor: '#8B1A1A',
    height: 52,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 10,
    shadowColor: '#8B1A1A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  saveBtnText: {
    fontFamily: 'PoppinsMedium',
    fontSize: 15,
    color: '#FFFFFF',
  },
});
