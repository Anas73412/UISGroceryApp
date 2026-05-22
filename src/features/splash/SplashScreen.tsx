import React, { useEffect } from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { theme } from '../../theme';
import { styles } from './style';
import { SplashController } from './SplashControllet';
import AuthRepository from '../../data/repositories/AuthRepository';
import { sessionStore } from '../../store/sessionStore';
import { appPrefs } from '../../data/repositories/AppPrefRepository';
import { clearAllSessionData } from '../../services/sessionLifecycle';

const appIcon = require('../../assets/images/app_icon.png');

type SplashScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Splash'>;
};

async function loadRemoteConfigInBackground() {
  try {
    await SplashController.loadAppConfig();
    await SplashController.loadDeliveryCharges();
  } catch (err) {
    console.log('Background config load failed:', err);
  }
}

export function SplashScreen({ navigation }: SplashScreenProps) {
  useEffect(() => {
    initializeStartApp();
  }, [navigation]);

  const initializeStartApp = async () => {
    try {
      const permissionsRequested = await appPrefs.get('permissionsRequested');
      if (!permissionsRequested) {
        navigation.replace('Permissions');
        return;
      }

      void loadRemoteConfigInBackground();

      const isLoggedIn = await AuthRepository.isLoggedIn();
      if (isLoggedIn) {
        const restored = await sessionStore.getState().loadSession();
        if (restored) {
          navigation.replace('Main');
          return;
        }
        await clearAllSessionData();
      }

      navigation.replace('Auth');
    } catch (err) {
      console.log('Initialization error', err);
      try {
        const permissionsRequested = await appPrefs.get('permissionsRequested');
        if (!permissionsRequested) {
          navigation.replace('Permissions');
          return;
        }

        const isLoggedIn = await AuthRepository.isLoggedIn();
        if (isLoggedIn) {
          const restored = await sessionStore.getState().loadSession();
          if (restored) {
            navigation.replace('Main');
            return;
          }
        }
      } catch {
        /* fall through to Auth */
      }
      navigation.replace('Auth');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image source={appIcon} style={styles.appIcon} resizeMode="contain" />
        <Text style={styles.brandText}>UIS Groceries</Text>
        <ActivityIndicator
          size="small"
          color={theme.colors.primary}
          style={styles.spinner}
        />
      </View>
    </View>
  );
}
