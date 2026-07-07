import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { articleService } from '../services/articleService';
import Skeleton from '../components/Skeleton';
import { COLORS } from '../theme/colors';

const { maroon: MAROON, textDark: TEXT_DARK, textGrey: TEXT_GREY } = COLORS;
const { width } = Dimensions.get('window');

export default function ArticleListScreen() {
  const navigation = useNavigation();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await articleService.getArticles();
      if (res.success && res.data) {
        setArticles(res.data);
      }
    } catch (error) {
      console.error('Error fetching articles list:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchArticles();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top:10, bottom:10, left:10, right:10}}>
          <Ionicons name="arrow-back" size={24} color={TEXT_DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cerita Budaya</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={MAROON} />
        }
      >
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>Jelajahi Sejarah & Budaya Sumba</Text>
          <Text style={styles.pageSubtitle}>Baca ragam cerita tentang tenun, budaya, dan kearifan lokal.</Text>
        </View>

        {loading ? (
          <View style={styles.listContainer}>
            {[1, 2, 3, 4].map((i) => (
              <View key={i} style={styles.articleCard}>
                <Skeleton width="100%" height={200} borderRadius={0} />
                <View style={styles.articleInfo}>
                  <Skeleton width="90%" height={20} style={{ marginBottom: 8 }} />
                  <Skeleton width="40%" height={14} style={{ marginBottom: 16 }} />
                  <Skeleton width={100} height={14} />
                </View>
              </View>
            ))}
          </View>
        ) : articles.length > 0 ? (
          <View style={styles.listContainer}>
            {articles.map((article) => {
              const dateObj = new Date(article.created_at);
              const dateStr = dateObj.toLocaleDateString('id-ID', {
                day: 'numeric', month: 'long', year: 'numeric'
              });

              return (
                <TouchableOpacity 
                  key={article.id_artikel} 
                  style={styles.articleCard}
                  activeOpacity={0.9}
                  onPress={() => navigation.navigate('ArticleDetail', { articleId: article.id_artikel })}
                >
                  <View style={styles.articleImageContainer}>
                    {article.thumbnail ? (
                      <Image source={{ uri: article.thumbnail }} style={styles.articleImage} />
                    ) : (
                      <View style={styles.placeholderImage} />
                    )}
                  </View>
                  <View style={styles.articleInfo}>
                    <Text style={styles.articleTitle} numberOfLines={2}>{article.judul}</Text>
                    <Text style={styles.articleMeta}>Ditulis oleh {article.admin?.nama || 'Admin'} • {dateStr}</Text>
                    
                    <View style={styles.readMoreContainer}>
                      <Text style={styles.readMoreText}>Baca Selengkapnya</Text>
                      <Ionicons name="arrow-forward" size={14} color={MAROON} />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="book-outline" size={48} color="#D4C4BC" style={{ marginBottom: 16 }} />
            <Text style={styles.emptyText}>Belum ada cerita yang diterbitkan.</Text>
          </View>
        )}
      </ScrollView>
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
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EBE6',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontFamily: 'Playfair',
    fontSize: 18,
    color: TEXT_DARK,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  titleSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0EBE6',
  },
  pageTitle: {
    fontFamily: 'Playfair',
    fontSize: 24,
    color: TEXT_DARK,
    marginBottom: 8,
  },
  pageSubtitle: {
    fontFamily: 'Poppins',
    fontSize: 14,
    color: TEXT_GREY,
    lineHeight: 22,
  },
  listContainer: {
    paddingTop: 16,
  },
  articleCard: {
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F0EBE6',
  },
  articleImageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#F0EBE6',
  },
  articleImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#EBE5E0',
  },
  articleInfo: {
    padding: 20,
  },
  articleTitle: {
    fontFamily: 'Playfair',
    fontSize: 20,
    color: TEXT_DARK,
    marginBottom: 8,
    lineHeight: 28,
  },
  articleMeta: {
    fontFamily: 'Poppins',
    fontSize: 12,
    color: TEXT_GREY,
    marginBottom: 20,
  },
  readMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readMoreText: {
    fontFamily: 'PoppinsMedium',
    fontSize: 13,
    color: MAROON,
    marginRight: 8,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: 'Poppins',
    color: TEXT_GREY,
    textAlign: 'center',
  },
});
