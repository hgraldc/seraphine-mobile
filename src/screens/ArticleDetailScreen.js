import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { articleService } from '../services/articleService';
import { productService } from '../services/productService';
import Skeleton from '../components/Skeleton';

import { COLORS } from '../theme/colors';

const { maroon: MAROON, textDark: TEXT_DARK, textGrey: TEXT_GREY } = COLORS;
const { width } = Dimensions.get('window');

export default function ArticleDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  
  const { articleId } = route.params || {};

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (articleId) {
          const res = await articleService.getArticleDetail(articleId);
          if (res.success && res.data) {
            setArticle(res.data);
          }
        }
        
        // Fetch some products for "Jelajahi Koleksi Kami"
        const prodRes = await productService.getProducts({ limit: 2 });
        if (prodRes.success && prodRes.data) {
          setProducts(prodRes.data);
        }
      } catch (error) {
        console.error('Error fetching article details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [articleId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Skeleton width={24} height={24} borderRadius={12} />
          <View style={{ alignItems: 'center' }}>
            <Skeleton width={100} height={18} />
            <Skeleton width={80} height={18} style={{ marginTop: 4 }} />
          </View>
          <Skeleton width={24} height={24} borderRadius={12} />
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.articleHeader}>
            <Skeleton width={80} height={12} style={{ marginBottom: 16 }} />
            <Skeleton width="80%" height={28} style={{ marginBottom: 8 }} />
            <Skeleton width="60%" height={28} style={{ marginBottom: 16 }} />
            <Skeleton width={150} height={14} />
          </View>
          <Skeleton width="100%" height={width * 0.7} borderRadius={0} />
          <View style={styles.contentContainer}>
            <Skeleton width="100%" height={20} style={{ marginBottom: 8 }} />
            <Skeleton width="100%" height={20} style={{ marginBottom: 8 }} />
            <Skeleton width="100%" height={20} style={{ marginBottom: 8 }} />
            <Skeleton width="80%" height={20} style={{ marginBottom: 24 }} />
            <Skeleton width="100%" height={20} style={{ marginBottom: 8 }} />
            <Skeleton width="90%" height={20} style={{ marginBottom: 8 }} />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (!article) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontFamily: 'Poppins', color: TEXT_GREY }}>Artikel tidak ditemukan.</Text>
        <TouchableOpacity style={{ marginTop: 20 }} onPress={() => navigation.goBack()}>
          <Text style={{ color: MAROON, fontFamily: 'PoppinsMedium' }}>Kembali</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Format date: "12 Okt 2023"
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  // Render content with basic styling
  // Split by double newline to render paragraphs
  const renderContent = () => {
    if (!article.konten) return null;
    const paragraphs = article.konten.split('\n\n');
    return paragraphs.map((p, index) => {
      // Very basic formatting: if it starts with #, make it a heading (red)
      // if it starts with ", make it a quote block
      if (p.startsWith('# ')) {
        return <Text key={index} style={styles.contentHeading}>{p.replace('# ', '')}</Text>;
      }
      if (p.startsWith('"')) {
        return (
          <View key={index} style={styles.quoteBlock}>
            <Text style={styles.quoteText}>{p}</Text>
          </View>
        );
      }
      return <Text key={index} style={styles.paragraph}>{p}</Text>;
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top:10, bottom:10, left:10, right:10}}>
          <Ionicons name="arrow-back" size={24} color={MAROON} />
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.headerTitleLine1}>SUMBA</Text>
          <Text style={styles.headerTitleLine2}>HERITAGE</Text>
        </View>
        <TouchableOpacity hitSlop={{top:10, bottom:10, left:10, right:10}} onPress={() => navigation.navigate('Cart')}>
          <Ionicons name="bag-outline" size={24} color={MAROON} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* ARTICLE HERO SECTION */}
        <View style={styles.articleHeader}>
          <Text style={styles.detailLabel}>DETAIL CERITA</Text>
          <Text style={styles.articleTitle}>{article.judul}</Text>
          <Text style={styles.articleMeta}>
            Ditulis oleh {article.admin?.nama_lengkap || 'Admin'} • {formatDate(article.created_at)}
          </Text>
        </View>

        {article.thumbnail && (
          <Image source={{ uri: article.thumbnail }} style={styles.articleImage} />
        )}

        {/* CONTENT */}
        <View style={styles.contentContainer}>
          {renderContent()}
        </View>

        {/* COLLECTION SECTION */}
        <View style={styles.collectionSection}>
          <Text style={styles.collectionTitle}>Jelajahi Koleksi Kami</Text>
          {products.map(product => (
            <TouchableOpacity 
              key={product.id_produk} 
              style={styles.collectionCard}
              activeOpacity={0.9}
              onPress={() => navigation.navigate('ProductDetail', { product })}
            >
              <Image source={{ uri: product.gambar }} style={styles.collectionImage} />
              <Text style={styles.collectionName}>{product.nama_produk}</Text>
              <Text style={styles.collectionRegion}>{product.kategori?.nama_kategori || 'Sumba'}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EBE6',
    backgroundColor: '#FFFFFF',
  },
  headerTitleLine1: {
    fontFamily: 'Playfair',
    fontSize: 16,
    color: '#8B0000',
    letterSpacing: 2,
    lineHeight: 18,
  },
  headerTitleLine2: {
    fontFamily: 'Playfair',
    fontSize: 16,
    color: '#8B0000',
    letterSpacing: 2,
    lineHeight: 18,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  articleHeader: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },
  detailLabel: {
    fontFamily: 'PoppinsMedium',
    fontSize: 10,
    color: '#7A6A65',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  articleTitle: {
    fontFamily: 'Playfair',
    fontSize: 24,
    color: '#8B0000',
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 16,
  },
  articleMeta: {
    fontFamily: 'PoppinsMedium',
    fontSize: 11,
    color: '#4A4A4A',
  },
  articleImage: {
    width: '100%',
    height: width * 0.7,
    resizeMode: 'cover',
  },
  contentContainer: {
    padding: 24,
    paddingTop: 32,
    backgroundColor: '#FFFFFF',
  },
  paragraph: {
    fontFamily: 'Poppins',
    fontSize: 14,
    lineHeight: 24,
    color: '#333333',
    marginBottom: 16,
  },
  contentHeading: {
    fontFamily: 'Playfair',
    fontSize: 22,
    color: '#8B0000',
    lineHeight: 30,
    marginTop: 24,
    marginBottom: 16,
  },
  quoteBlock: {
    backgroundColor: '#FAFAF7',
    padding: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#8B0000',
    marginVertical: 24,
    borderRadius: 4,
  },
  quoteText: {
    fontFamily: 'PlayfairItalic',
    fontSize: 20,
    color: '#8B0000',
    lineHeight: 32,
  },
  collectionSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
    alignItems: 'center',
  },
  collectionTitle: {
    fontFamily: 'Playfair',
    fontSize: 24,
    color: '#8B0000',
    marginBottom: 32,
  },
  collectionCard: {
    width: '100%',
    marginBottom: 32,
  },
  collectionImage: {
    width: '100%',
    height: width * 0.8,
    resizeMode: 'cover',
    borderRadius: 2,
    marginBottom: 16,
  },
  collectionName: {
    fontFamily: 'Playfair',
    fontSize: 18,
    color: '#8B0000',
    marginBottom: 4,
  },
  collectionRegion: {
    fontFamily: 'Poppins',
    fontSize: 13,
    color: '#7A6A65',
  }
});
