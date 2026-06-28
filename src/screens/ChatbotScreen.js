import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Bot, Sparkles, Send } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const MAROON = '#8B1A1A';
const LIGHT_BG = '#FAFAF7';
const BORDER_COLOR = '#E8DDD4';

export default function ChatbotScreen() {
  const navigation = useNavigation();
  const [inputText, setInputText] = useState('');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top:10, bottom:10, left:10, right:10}} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#5C1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ASISTEN AI</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <View style={styles.sparkleIconBox}>
              <Sparkles size={28} color={MAROON} />
            </View>
            <Text style={styles.welcomeTitle}>Rahayu. Bagaimana saya bisa membantu?</Text>
            <Text style={styles.welcomeSubtitle}>
              Tanyakan tentang motif, rekomendasi kain untuk acara, atau cek ketersediaan karya tenun Sumba.
            </Text>
          </View>

          {/* Suggestion Chips */}
          <View style={styles.chipsContainer}>
            <TouchableOpacity style={styles.chip}>
              <Ionicons name="calendar-outline" size={14} color={MAROON} />
              <Text style={styles.chipText}>Rekomendasi Acara</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.chip}>
              <Ionicons name="book-outline" size={14} color={MAROON} />
              <Text style={styles.chipText}>Arti Motif</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.chip}>
              <Ionicons name="cube-outline" size={14} color={MAROON} />
              <Text style={styles.chipText}>Cek Stok</Text>
            </TouchableOpacity>
          </View>

          {/* User Message */}
          <View style={styles.userMessageContainer}>
            <View style={styles.userBubble}>
              <Text style={styles.userMessageText}>Kain untuk budget 500rb ada?</Text>
            </View>
          </View>

          {/* AI Message */}
          <View style={styles.aiMessageContainer}>
            <View style={styles.aiAvatar}>
              <Bot size={16} color="#FFFFFF" />
            </View>
            <View style={styles.aiBubble}>
              <Text style={styles.aiMessageText}>
                Tentu. Untuk kisaran nilai 500 ribu rupiah, kami merekomendasikan karya tenun berukuran selendang atau syal dengan motif yang lebih kontemporer atau tingkat kerumitan menengah. Ini beberapa pilihan yang tersedia saat ini:
              </Text>
              
              {/* Product Card inside AI Bubble */}
              <View style={styles.productCard}>
                <Image 
                  source={require('../assets/img/hero.jpeg')} 
                  style={styles.productImage} 
                  resizeMode="cover" 
                />
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>Selendang Pahikung Motif Mamuli</Text>
                  <Text style={styles.productPrice}>Rp 450.000</Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* Spacer */}
          <View style={{ height: 20 }} />
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Tulis pesan..."
              placeholderTextColor="#A99B95"
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
            <TouchableOpacity style={styles.sendButton} activeOpacity={0.8}>
              <Send size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAF7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
    backgroundColor: '#FAFAF7',
  },
  headerTitle: {
    fontFamily: 'Playfair',
    fontSize: 20,
    color: MAROON,
    letterSpacing: 2,
  },
  backButton: {
    padding: 4,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  sparkleIconBox: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#F0EBE6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  welcomeTitle: {
    fontFamily: 'Playfair',
    fontSize: 22,
    color: MAROON,
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 12,
  },
  welcomeSubtitle: {
    fontFamily: 'Poppins',
    fontSize: 13,
    color: '#7A6A65',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 40,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D4C4BC',
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  chipText: {
    fontFamily: 'PoppinsSemiBold',
    fontSize: 12,
    color: MAROON,
  },
  userMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 24,
  },
  userBubble: {
    backgroundColor: '#EBEBEB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderBottomRightRadius: 4,
    maxWidth: '80%',
  },
  userMessageText: {
    fontFamily: 'Poppins',
    fontSize: 13,
    color: '#2C0A0A',
    lineHeight: 20,
  },
  aiMessageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: MAROON,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 4,
  },
  aiBubble: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8D5CE',
    borderRadius: 16,
    borderTopLeftRadius: 4,
    padding: 16,
    shadowColor: MAROON,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  aiMessageText: {
    fontFamily: 'Poppins',
    fontSize: 13,
    color: '#2C0A0A',
    lineHeight: 22,
    marginBottom: 16,
  },
  productCard: {
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    borderRadius: 8,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 120,
  },
  productInfo: {
    padding: 12,
    backgroundColor: '#FFFFFF',
  },
  productName: {
    fontFamily: 'PoppinsSemiBold',
    fontSize: 12,
    color: '#1A0A0A',
    marginBottom: 4,
  },
  productPrice: {
    fontFamily: 'PoppinsSemiBold',
    fontSize: 12,
    color: MAROON,
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FAFAF7',
    borderTopWidth: 1,
    borderTopColor: BORDER_COLOR,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D4C4BC',
    borderRadius: 24,
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,
  },
  input: {
    flex: 1,
    fontFamily: 'Poppins',
    fontSize: 13,
    color: '#2C0A0A',
    minHeight: 36,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: MAROON,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});
