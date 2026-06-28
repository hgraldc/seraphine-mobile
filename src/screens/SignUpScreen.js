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

const MAROON = '#8B1A1A';

export default function SignUpScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleSignUp = () => {
    if (!email || !password || !confirmPassword) {
      setAlertMessage('Harap isi semua kolom.');
      setAlertVisible(true);
      return;
    }
    if (password !== confirmPassword) {
      setAlertMessage('Password tidak cocok.');
      setAlertVisible(true);
      return;
    }
    console.log('Sign Up berhasil:', { email });
    // Navigate to Login after successful registration
    navigation.navigate('Login');
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
      <View style={styles.container}>
        {/* Judul */}
        <View style={styles.titleWrapper}>
          <Text style={styles.titleText}>Balai Tenun</Text>
          <Text style={styles.titleText}>CD Seraphine Weetabula</Text>
        </View>

        {/* Heading */}
        <Text style={styles.heading}>Create your Account</Text>

        {/* Input Email */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="rgba(139,26,26,0.5)"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Input Password */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="rgba(139,26,26,0.5)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {/* Input Confirm Password */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="rgba(139,26,26,0.5)"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
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

        <CustomAlert
          visible={alertVisible}
          title="Sign Up Gagal"
          message={alertMessage}
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
    color: MAROON,
    fontFamily: 'Playfair',
    textAlign: 'center',
    lineHeight: 26,
  },
  heading: {
    marginTop: 70,
    marginBottom: 24,
    fontSize: 20,
    color: MAROON,
    fontFamily: 'Playfair',
  },
  inputWrapper: {
    marginBottom: 18,
  },
  input: {
    height: 52,
    borderWidth: 1.5,
    borderColor: MAROON,
    borderRadius: 8,
    paddingHorizontal: 18,
    fontSize: 15,
    color: MAROON,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Playfair',
    shadowColor: MAROON,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 0,
    elevation: 3,
  },
  signUpButton: {
    backgroundColor: MAROON,
    height: 52,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    shadowColor: MAROON,
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
    color: MAROON,
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
  signInWrapper: {
    marginTop: 'auto',
    marginBottom: 60,
    alignItems: 'center',
  },
  signInText: {
    color: MAROON,
    fontSize: 14,
    fontFamily: 'Playfair',
    textDecorationLine: 'underline',
  },
});
