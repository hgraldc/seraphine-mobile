import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function LoginScreen() {
  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f',
      }}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.overlay}>
          <Text style={styles.title}>
            CD Seraphine
          </Text>
          <Text style={styles.subtitle}>
            Tenun Sumba Mobile App
          </Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Username
            </Text>
            <TextInput
              placeholder="Masukkan Username"
              placeholderTextColor="#777"
              style={styles.input}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Email
            </Text>
            <TextInput
              placeholder="Masukkan Email"
              placeholderTextColor="#777"
              keyboardType="email-address"
              style={styles.input}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Password
            </Text>
            <TextInput
              placeholder="Masukkan Password"
              placeholderTextColor="#777"
              secureTextEntry
              style={styles.input}
            />
          </View>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Belum punya akun?{' '}
            <Text style={styles.signUp}>
              Sign Up
            </Text>
          </Text>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  overlay: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 25,
    padding: 25,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#5C3317',
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    color: '#777',
    marginTop: 5,
    marginBottom: 30,
    fontSize: 16,
  },
  inputContainer: {
    marginBottom: 18,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 14,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#8B4513',
    height: 55,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 30,
  },
  footerText: {
    color: '#fff',
    fontSize: 16,
  },
  signUp: {
    fontWeight: 'bold',
  },
});
