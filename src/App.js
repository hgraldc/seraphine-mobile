import React, { useCallback, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { View, Text, TextInput } from 'react-native';

// Disable global font scaling to prevent UI from getting too large on devices with custom display size
if (Text.defaultProps == null) Text.defaultProps = {};
Text.defaultProps.allowFontScaling = false;

if (TextInput.defaultProps == null) TextInput.defaultProps = {};
TextInput.defaultProps.allowFontScaling = false;
import RootNavigation from './navigation/RootNavigation';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import HelpScreen from './screens/HelpScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import NotificationScreen from './screens/NotificationScreen';
import ChatbotScreen from './screens/ChatbotScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import OrderDetailScreen from './screens/OrderDetailScreen';
import TrackPackageScreen from './screens/TrackPackageScreen';
import PaymentScreen from './screens/PaymentScreen';
import AddReviewScreen from './screens/AddReviewScreen';
import ArticleDetailScreen from './screens/ArticleDetailScreen';
import ArticleListScreen from './screens/ArticleListScreen';
import WeaverDetailScreen from './screens/WeaverDetailScreen';
import { navigationRef } from './navigation/navigationRef';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Load fonts
        await Font.loadAsync({
          'Playfair': require('./assets/fonts/PlayfairDisplay-Bold.ttf'),
          'PlayfairItalic': require('./assets/fonts/PlayfairDisplay-BoldItalic.ttf'),
          'Poppins': require('./assets/fonts/Poppins-Regular.ttf'),
          'PoppinsMedium': require('./assets/fonts/Poppins-Medium.ttf'),
          'PoppinsSemiBold': require('./assets/fonts/Poppins-SemiBold.ttf'),
        });
      } catch (e) {
        console.warn('Error loading fonts:', e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately!
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <NavigationContainer ref={navigationRef}>
        <StatusBar style="auto" />
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="MainTabs" component={RootNavigation} />
          <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
          <Stack.Screen name="Help" component={HelpScreen} />
          <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
          <Stack.Screen name="Notification" component={NotificationScreen} />
          <Stack.Screen name="Chatbot" component={ChatbotScreen} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} />
          <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
          <Stack.Screen name="TrackPackage" component={TrackPackageScreen} />
          <Stack.Screen name="Payment" component={PaymentScreen} />
          <Stack.Screen name="AddReview" component={AddReviewScreen} />
          <Stack.Screen name="ArticleDetail" component={ArticleDetailScreen} />
          <Stack.Screen name="ArticleList" component={ArticleListScreen} />
          <Stack.Screen name="WeaverDetail" component={WeaverDetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}