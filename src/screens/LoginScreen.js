import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import CustomAlert from '../components/CustomAlert';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authService } from '../services/authService';
import { COLORS } from '../theme/colors';


export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);

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
  };

  const handleSignIn = async () => {
    // Cek kembali jika ada field yang kosong saat disubmit
    if (!email || emailError) {
      setEmailError(emailError || 'Email tidak boleh kosong');
      return;
    }
    if (!password || passwordError) {
      setPasswordError(passwordError || 'Password tidak boleh kosong');
      return;
    }
    try {
      const { success, message } = await authService.login(email, password);
      
      if (success) {
        console.log('Login berhasil:', message);
        navigation.navigate('MainTabs');
      } else {
        console.error('Login gagal: Kredensial salah');
        setAlertVisible(true);
      }
    } catch (error) {
      console.error('Login gagal:', error);
      setAlertVisible(true);
    }
  };

  const handleGoogleSignIn = () => {
    console.log('Sign in dengan Google');
  };

  const handleFacebookSignIn = () => {
    console.log('Sign in dengan Facebook');
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.container}>
        {/* Judul */}
        <View style={styles.titleWrapper}>
          <Text style={styles.titleText}>Balai Tenun</Text>
          <Text style={styles.titleText}>CD Seraphine Weetabula</Text>
        </View>

        {/* Heading Login */}
        <Text style={styles.loginHeading}>Login to your Account</Text>

        {/* Input Email */}
        <View style={[styles.inputWrapper, emailError ? { borderColor: 'red', borderWidth: 1 } : null]}>
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

        {/* Input Password */}
        <View style={[styles.inputWrapper, passwordError ? { borderColor: 'red', borderWidth: 1 } : null, { marginTop: emailError ? 4 : 16 }]}>
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

        {/* Tombol Sign In */}
        <TouchableOpacity
          style={styles.signInButton}
          onPress={handleSignIn}
          activeOpacity={0.85}
        >
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>

        {/* Atau Sign In Dengan */}
        <Text style={styles.orText}>Or Sign In With</Text>

        {/* Tombol Sosial Media */}
        <View style={styles.socialRow}>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={handleGoogleSignIn}
            activeOpacity={0.7}
          >
            <Icon name="google" size={26} color="#DB4437" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.socialButton}
            onPress={handleFacebookSignIn}
            activeOpacity={0.7}
          >
            <Icon name="facebook-square" size={30} color="#3b5998" />
          </TouchableOpacity>
        </View>

        {/* Link Sign Up */}
        <TouchableOpacity
          style={styles.signUpWrapper}
          onPress={handleSignUp}
          activeOpacity={0.7}
        >
          <Text style={styles.signUpText}>
            Don&apos;t have an account? Sign Up
          </Text>
        </TouchableOpacity>

        <CustomAlert
          visible={alertVisible}
          type="error"
          title="Login Gagal"
          message="Email atau password salah."
          onConfirm={() => setAlertVisible(false)}
          confirmText="Tutup"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 28,
  },
  titleWrapper: {
    marginTop: 110,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 19,
    color: COLORS.maroon,
    fontFamily: 'Playfair',
    textAlign: 'center',
    lineHeight: 26,
  },
  loginHeading: {
    marginTop: 70,
    marginBottom: 24,
    fontSize: 20,
    color: COLORS.maroon,
    fontFamily: 'Playfair',
  },
  inputWrapper: {
    marginBottom: 0,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    fontFamily: 'Poppins',
    marginTop: 4,
    marginBottom: 14,
    alignSelf: 'flex-start',
    marginLeft: 4,
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
    // bayangan tipis seperti pada desain
    shadowColor: COLORS.maroon,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 0,
    elevation: 3,
  },
  signInButton: {
    backgroundColor: COLORS.maroon,
    height: 52,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    shadowColor: COLORS.maroon,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 0,
    elevation: 4,
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    letterSpacing: 0.5,
    fontFamily: 'Playfair',
  },
  orText: {
    textAlign: 'center',
    color: COLORS.maroon,
    fontSize: 13,
    marginTop: 48,
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
  signUpWrapper: {
    marginTop: 'auto',
    marginBottom: 60,
    alignItems: 'center',
  },
  signUpText: {
    color: COLORS.maroon,
    fontSize: 14,
    fontFamily: 'Playfair',
    textDecorationLine: 'underline',
  },
});
