import React, { useCallback, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { View } from 'react-native';
import RootNavigation from './navigation/RootNavigation';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

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
      <NavigationContainer>
        <StatusBar style="auto" />
        <RootNavigation />
      </NavigationContainer>
    </View>
  );
}
