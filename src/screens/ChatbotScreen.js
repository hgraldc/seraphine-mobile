import React, { useState, useEffect } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { chatService } from '../services/chatService';
import { COLORS } from '../theme/colors';

const LIGHT_BG = '#FAFAF7';

export default function ChatbotScreen() {
  const navigation = useNavigation();
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const initChat = async () => {
      try {
        const userInfo = await AsyncStorage.getItem('userInfo');
        if (userInfo) {
          const parsed = JSON.parse(userInfo);
          if (parsed.nama_lengkap) {
            setUserName(parsed.nama_lengkap.split(' ')[0]);
          }
        }
        
        // Load chat history
        const savedHistory = await AsyncStorage.getItem('chatHistory');
        if (savedHistory) {
          setMessages(JSON.parse(savedHistory));
        }
      } catch (error) {
        console.error('Error initializing chatbot:', error);
      }
    };
    initChat();
  }, []);

  const handleSend = async (textOverride = null) => {
    const textToSend = typeof textOverride === 'string' ? textOverride : inputText.trim();
    if (!textToSend || loading) return;

    setInputText('');

    const newUserMsg = { id: Date.now().toString(), role: 'user', text: textToSend };
    const history = messages.map(m => ({ role: m.role, text: m.text }));
    
    const newMessages = [...messages, newUserMsg];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await chatService.sendMessage(textToSend, history);
      let aiText = "Maaf, tidak dapat merespon.";
      if (res && res.data) {
        if (typeof res.data === 'string') aiText = res.data;
        else if (res.data.reply) aiText = res.data.reply;
        else if (res.data.text) aiText = res.data.text;
        else if (res.data.message) aiText = res.data.message;
      }
      const aiMsg = { id: (Date.now() + 1).toString(), role: 'model', text: aiText };
      const updatedMessages = [...newMessages, aiMsg];
      setMessages(updatedMessages);
      await AsyncStorage.setItem('chatHistory', JSON.stringify(updatedMessages));
    } catch (error) {
      const errorMsg = { id: (Date.now() + 1).toString(), role: 'model', text: 'Maaf, terjadi kendala jaringan atau server.' };
      const updatedMessages = [...newMessages, errorMsg];
      setMessages(updatedMessages);
      await AsyncStorage.setItem('chatHistory', JSON.stringify(updatedMessages));
    } finally {
      setLoading(false);
    }
  };

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
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <View style={styles.sparkleIconBox}>
              <Sparkles size={28} color={COLORS.maroon} />
            </View>
            <Text style={styles.welcomeTitle}>
              Rahayu{userName ? `, ${userName}` : ''}. Bagaimana saya bisa membantu?
            </Text>
            <Text style={styles.welcomeSubtitle}>
              Tanyakan tentang motif, rekomendasi kain untuk acara, atau cek ketersediaan karya tenun Sumba.
            </Text>
          </View>

          {/* Suggestion Chips */}
          {messages.length === 0 && (
            <View style={styles.chipsContainer}>
              <TouchableOpacity style={styles.chip} onPress={() => handleSend("Rekomendasi Acara")}>
                <Ionicons name="calendar-outline" size={14} color={COLORS.maroon} />
                <Text style={styles.chipText}>Rekomendasi Acara</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.chip} onPress={() => handleSend("Apa arti motif Sumba?")}>
                <Ionicons name="book-outline" size={14} color={COLORS.maroon} />
                <Text style={styles.chipText}>Arti Motif</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.chip} onPress={() => handleSend("Tolong cek status pesanan terakhir saya")}>
                <Ionicons name="cube-outline" size={14} color={COLORS.maroon} />
                <Text style={styles.chipText}>Cek Pesanan</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Dynamic Messages */}
          {messages.map((msg) => {
            if (msg.role === 'user') {
              return (
                <View key={msg.id} style={styles.userMessageContainer}>
                  <View style={styles.userBubble}>
                    <Text style={styles.userMessageText}>{msg.text}</Text>
                  </View>
                </View>
              );
            } else {
              return (
                <View key={msg.id} style={styles.aiMessageContainer}>
                  <View style={styles.aiAvatar}>
                    <Bot size={16} color="#FFFFFF" />
                  </View>
                  <View style={styles.aiBubble}>
                    <Text style={styles.aiMessageText}>{msg.text}</Text>
                  </View>
                </View>
              );
            }
          })}

          {loading && (
            <View style={styles.aiMessageContainer}>
              <View style={styles.aiAvatar}>
                <Bot size={16} color="#FFFFFF" />
              </View>
              <View style={styles.aiBubble}>
                <Text style={styles.aiMessageText}>Berpikir...</Text>
              </View>
            </View>
          )}
          
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
            <TouchableOpacity style={styles.sendButton} activeOpacity={0.8} onPress={handleSend} disabled={loading}>
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
    borderBottomColor: COLORS.borderColor,
    backgroundColor: '#FAFAF7',
  },
  headerTitle: {
    fontFamily: 'Playfair',
    fontSize: 20,
    color: COLORS.maroon,
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
    color: COLORS.maroon,
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
    color: COLORS.maroon,
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
    backgroundColor: COLORS.maroon,
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
    shadowColor: COLORS.maroon,
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
    borderColor: COLORS.borderColor,
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
    color: COLORS.maroon,
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FAFAF7',
    borderTopWidth: 1,
    borderTopColor: COLORS.borderColor,
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
    backgroundColor: COLORS.maroon,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});