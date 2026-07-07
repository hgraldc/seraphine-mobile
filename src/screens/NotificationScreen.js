import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { notificationService } from '../services/notificationService';

export default function NotificationScreen() {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationService.getNotifications({ page: 1, limit: 20 });
      if (res.success && res.data) {
        setNotifications(res.data);
      }
    } catch (err) {
      console.error("Gagal mengambil notifikasi", err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [])
  );

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.readAll();
      fetchNotifications();
    } catch (err) {
      console.error("Gagal menandai semua dibaca", err);
    }
  };

  const handleReadNotification = async (notif) => {
    if (notif.is_read) return;
    try {
      await notificationService.readOne(notif.id_notifikasi);
      setNotifications(prev => 
        prev.map(n => n.id_notifikasi === notif.id_notifikasi ? { ...n, is_read: true } : n)
      );
    } catch (err) {
      console.error("Gagal menandai notifikasi dibaca", err);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top:10, bottom:10, left:10, right:10}} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#5C1A1A" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>NOTIFIKASI</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Mark as Read */}
        <TouchableOpacity style={styles.markReadBtn} activeOpacity={0.7} onPress={handleMarkAllAsRead}>
          <Ionicons name="checkmark-done" size={18} color="#8B1A1A" />
          <Text style={styles.markReadText}>Tandai semua dibaca</Text>
        </TouchableOpacity>

        {loading ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <ActivityIndicator size="small" color="#8B1A1A" />
          </View>
        ) : notifications.length === 0 ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <Text style={{ fontFamily: 'Poppins', color: '#7A6A65' }}>Belum ada notifikasi.</Text>
          </View>
        ) : (
          <View style={styles.categorySection}>
            {notifications.map((notif) => (
              <TouchableOpacity 
                key={notif.id_notifikasi.toString()} 
                style={styles.notifCard} 
                activeOpacity={0.8}
                onPress={() => handleReadNotification(notif)}
              >
                {!notif.is_read && <View style={styles.unreadDot} />}
                
                <View style={[styles.iconBox, { backgroundColor: notif.is_read ? '#F0F4EC' : '#FCEAE8' }]}>
                  <Ionicons name={notif.is_read ? 'checkmark-circle-outline' : 'notifications-outline'} size={20} color="#5C1A1A" />
                </View>

                <View style={styles.notifContent}>
                  <View style={styles.notifHeader}>
                    <Text style={styles.notifTitle} numberOfLines={1}>{notif.judul}</Text>
                    <Text style={styles.notifTime}>
                      {new Date(notif.created_at).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}
                    </Text>
                  </View>
                  <Text style={styles.bodyText}>{notif.pesan}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <View style={{height: 20}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F3EF',
  },
  backButton: { zIndex: 1 },
  headerTitleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Playfair',
    fontSize: 20,
    color: '#5C1A1A',
    letterSpacing: 2,
  },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16 },
  markReadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 20,
    gap: 6,
  },
  markReadText: {
    fontFamily: 'PoppinsSemiBold',
    fontSize: 12,
    color: '#8B1A1A',
  },
  categorySection: { marginBottom: 24 },
  categoryTitle: {
    fontFamily: 'Playfair',
    fontSize: 22,
    color: '#1A0A0A',
    marginBottom: 16,
  },
  notifCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E8DDD4',
    marginBottom: 12,
    position: 'relative',
    backgroundColor: '#FFFFFF',
  },
  unreadDot: {
    position: 'absolute',
    top: 16,
    left: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#8B1A1A',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginLeft: 8,
  },
  notifContent: { flex: 1 },
  notifHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  notifTitle: {
    fontFamily: 'PoppinsSemiBold',
    fontSize: 13,
    color: '#1A0A0A',
    flex: 1,
    marginRight: 8,
  },
  notifTime: {
    fontFamily: 'Poppins',
    fontSize: 10,
    color: '#7A6A65',
    marginTop: 2,
  },
  bodyText: {
    fontFamily: 'Poppins',
    fontSize: 12,
    color: '#4A3A35',
    lineHeight: 20,
  },
  highlightText: {
    fontFamily: 'PoppinsSemiBold',
    color: '#5C1A1A',
  },
  actionText: {
    fontFamily: 'PoppinsMedium',
    fontSize: 11,
    color: '#8B1A1A',
    letterSpacing: 1,
    marginTop: 12,
  },
});
