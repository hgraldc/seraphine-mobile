import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import CustomAlert from '../components/CustomAlert';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authService } from '../services/authService';
import { COLORS } from '../theme/colors';


export default function SignUpScreen() {
  const navigation = useNavigation();
  
  const [namaLengkap, setNamaLengkap] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [noTelepon, setNoTelepon] = useState('');
  const [alamat, setAlamat] = useState('');
  const [kota, setKota] = useState('');
  const [provinsi, setProvinsi] = useState('');
  const [kodePos, setKodePos] = useState('');
  
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [noTeleponError, setNoTeleponError] = useState('');

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('error');
  const [alertTitle, setAlertTitle] = useState('Sign Up Gagal');

  const validateEmail = (text) => {
    const cleanText = text.replace(/\s/g, '');
    setEmail(cleanText);
    if (!cleanText) {
      setEmailError('Email tidak boleh kosong');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanText)) {
      setEmailError('Format email tidak valid (cth: nama@email.com)');
    } else {
      setEmailError('');
    }
  };

  const validatePassword = (text) => {
    setPassword(text);
    if (!text) {
      setPasswordError('Password tidak boleh kosong');
    } else if (text.length < 6) {
      setPasswordError('Password minimal 6 karakter');
    } else {
      setPasswordError('');
    }
    // Re-validate confirm password if it's already filled
    if (confirmPassword && text !== confirmPassword) {
      setConfirmPasswordError('Password tidak cocok');
    } else if (confirmPassword && text === confirmPassword) {
      setConfirmPasswordError('');
    }
  };

  const validateConfirmPassword = (text) => {
    setConfirmPassword(text);
    if (!text) {
      setConfirmPasswordError('Konfirmasi password tidak boleh kosong');
    } else if (text !== password) {
      setConfirmPasswordError('Password tidak cocok');
    } else {
      setConfirmPasswordError('');
    }
  };

  const validateNoTelepon = (text) => {
    setNoTelepon(text);
    if (!text) {
      setNoTeleponError('No. Telepon tidak boleh kosong');
    } else if (!/^[0-9]+$/.test(text)) {
      setNoTeleponError('No. Telepon hanya boleh berisi angka');
    } else if (text.length < 10) {
      setNoTeleponError('No. Telepon minimal 10 digit');
    } else {
      setNoTeleponError('');
    }
  };

  const handleSignUp = async () => {
    // Basic empty check for non-validated fields
    if (
      !namaLengkap || 
      !alamat || 
      !kota || 
      !provinsi || 
      !kodePos
    ) {
      setAlertTitle('Sign Up Gagal');
      setAlertMessage('Harap lengkapi semua data alamat dan nama.');
      setAlertType('error');
      setAlertVisible(true);
      return;
    }
    
    // Check if there are still active inline validation errors
    if (!email || emailError || !password || passwordError || !confirmPassword || confirmPasswordError || !noTelepon || noTeleponError) {
      if (!email) setEmailError('Email tidak boleh kosong');
      if (!password) setPasswordError('Password tidak boleh kosong');
      if (!confirmPassword) setConfirmPasswordError('Konfirmasi password tidak boleh kosong');
      if (!noTelepon) setNoTeleponError('No. Telepon tidak boleh kosong');
      return;
    }

    try {
      const response = await authService.register({
        nama_lengkap: namaLengkap,
        email,
        password,
        no_telepon: noTelepon,
        alamat,
        kota,
        provinsi,
        kode_pos: kodePos,
      });

      if (response.success) {
        setAlertTitle('Sign Up Berhasil');
        setAlertMessage(response.message || 'Registrasi berhasil. Silakan login.');
        setAlertType('success');
        setAlertVisible(true);
      } else {
        setAlertTitle('Sign Up Gagal');
        setAlertMessage(response.message || 'Registrasi gagal. Silakan coba lagi.');
        setAlertType('error');
        setAlertVisible(true);
      }
    } catch (error) {
      console.error('Sign Up gagal:', error);
      setAlertTitle('Sign Up Gagal');
      setAlertMessage('Terjadi kesalahan pada server.');
      setAlertType('error');
      setAlertVisible(true);
    }
  };

  const handleAlertConfirm = () => {
    setAlertVisible(false);
    if (alertType === 'success') {
      navigation.navigate('Login');
    }
  };

  const handleGoogleSignUp = () => {
    console.log('Sign up dengan Google');
  };

  const handleFacebookSignUp = () => {
    console.log('Sign up dengan Facebook');
  };

  const handleSignIn = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Judul */}
          <View style={styles.titleWrapper}>
            <Text style={styles.titleText}>Balai Tenun</Text>
            <Text style={styles.titleText}>CD Seraphine Weetabula</Text>
          </View>

          {/* Heading */}
          <Text style={styles.heading}>Create your Account</Text>

          {/* Form Inputs */}
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Nama Lengkap"
              placeholderTextColor="rgba(139,26,26,0.5)"
              value={namaLengkap}
              onChangeText={setNamaLengkap}
            />
          </View>

          {/* Email */}
          <View style={[styles.inputWrapper, emailError ? { borderColor: 'red', borderWidth: 1 } : null, { marginBottom: emailError ? 0 : 16 }]}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="rgba(139,26,26,0.5)"
              value={email}
              onChangeText={validateEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

          {/* Password */}
          <View style={[styles.inputWrapper, passwordError ? { borderColor: 'red', borderWidth: 1 } : null, { marginBottom: passwordError ? 0 : 16, marginTop: emailError ? 12 : 0 }]}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="rgba(139,26,26,0.5)"
              value={password}
              onChangeText={validatePassword}
              secureTextEntry
            />
          </View>
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

          {/* Confirm Password */}
          <View style={[styles.inputWrapper, confirmPasswordError ? { borderColor: 'red', borderWidth: 1 } : null, { marginBottom: confirmPasswordError ? 0 : 16, marginTop: passwordError ? 12 : 0 }]}>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="rgba(139,26,26,0.5)"
              value={confirmPassword}
              onChangeText={validateConfirmPassword}
              secureTextEntry
            />
          </View>
          {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}

          {/* No Telepon */}
          <View style={[styles.inputWrapper, noTeleponError ? { borderColor: 'red', borderWidth: 1 } : null, { marginBottom: noTeleponError ? 0 : 16, marginTop: confirmPasswordError ? 12 : 0 }]}>
            <TextInput
              style={styles.input}
              placeholder="No. Telepon"
              placeholderTextColor="rgba(139,26,26,0.5)"
              value={noTelepon}
              onChangeText={validateNoTelepon}
              keyboardType="phone-pad"
            />
          </View>
          {noTeleponError ? <Text style={styles.errorText}>{noTeleponError}</Text> : null}

          <View style={[styles.inputWrapper, { marginTop: noTeleponError ? 12 : 0 }]}>
            <TextInput
              style={styles.input}
              placeholder="Alamat"
              placeholderTextColor="rgba(139,26,26,0.5)"
              value={alamat}
              onChangeText={setAlamat}
            />
          </View>

          <View style={styles.rowInputs}>
            <View style={[styles.inputWrapper, { flex: 1, marginRight: 8 }]}>
              <TextInput
                style={styles.input}
                placeholder="Kota"
                placeholderTextColor="rgba(139,26,26,0.5)"
                value={kota}
                onChangeText={setKota}
              />
            </View>
            <View style={[styles.inputWrapper, { flex: 1, marginLeft: 8 }]}>
              <TextInput
                style={styles.input}
                placeholder="Provinsi"
                placeholderTextColor="rgba(139,26,26,0.5)"
                value={provinsi}
                onChangeText={setProvinsi}
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Kode Pos"
              placeholderTextColor="rgba(139,26,26,0.5)"
              value={kodePos}
              onChangeText={setKodePos}
              keyboardType="number-pad"
            />
          </View>

          {/* Tombol Sign Up */}
          <TouchableOpacity
            style={styles.signUpButton}
            onPress={handleSignUp}
            activeOpacity={0.85}
          >
            <Text style={styles.signUpButtonText}>Sign up</Text>
          </TouchableOpacity>

          {/* Atau Sign Up Dengan */}
          <Text style={styles.orText}>Or Sign up With</Text>

          {/* Tombol Sosial Media */}
          <View style={styles.socialRow}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={handleGoogleSignUp}
              activeOpacity={0.7}
            >
              <Icon name="google" size={26} color="#DB4437" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialButton}
              onPress={handleFacebookSignUp}
              activeOpacity={0.7}
            >
              <Icon name="facebook-square" size={30} color="#3b5998" />
            </TouchableOpacity>
          </View>

          {/* Link Sign In */}
          <TouchableOpacity
            style={styles.signInWrapper}
            onPress={handleSignIn}
            activeOpacity={0.7}
          >
            <Text style={styles.signInText}>
              Already have an account? Sign In
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>

      <CustomAlert
        visible={alertVisible}
        type={alertType}
        title={alertTitle}
        message={alertMessage}
        onConfirm={handleAlertConfirm}
        confirmText="Tutup"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingBottom: 40,
  },
  titleWrapper: {
    marginTop: 60,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 19,
    color: COLORS.maroon,
    fontFamily: 'Playfair',
    textAlign: 'center',
    lineHeight: 26,
  },
  heading: {
    marginTop: 40,
    marginBottom: 24,
    fontSize: 20,
    color: COLORS.maroon,
    fontFamily: 'Playfair',
  },
  inputWrapper: {
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 234, 234, 0.4)',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    fontFamily: 'Poppins',
    marginTop: 4,
    marginBottom: 12,
    alignSelf: 'flex-start',
    marginLeft: 4,
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    height: 52,
    borderWidth: 1.5,
    borderColor: COLORS.maroon,
    borderRadius: 8,
    paddingHorizontal: 18,
    fontSize: 15,
    color: COLORS.maroon,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Playfair',
    shadowColor: COLORS.maroon,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 0,
    elevation: 3,
  },
  signUpButton: {
    backgroundColor: COLORS.maroon,
    height: 52,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: COLORS.maroon,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 0,
    elevation: 4,
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    letterSpacing: 0.5,
    fontFamily: 'Playfair',
  },
  orText: {
    textAlign: 'center',
    color: COLORS.maroon,
    fontSize: 13,
    marginTop: 32,
    fontFamily: 'Playfair',
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },
  socialButton: {
    marginHorizontal: 14,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInWrapper: {
    marginTop: 30,
    alignItems: 'center',
  },
  signInText: {
    color: COLORS.maroon,
    fontSize: 14,
    fontFamily: 'Playfair',
    textDecorationLine: 'underline',
  },
});
