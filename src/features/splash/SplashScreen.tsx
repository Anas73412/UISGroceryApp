import React, { useEffect } from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { theme } from '../../theme';
import { styles } from './style';
import { SplashController } from './SplashControllet';
import AuthRepository from '../../data/repositories/AuthRepository';
import { SUCCESS } from '../../utils/constants';
const appIcon = require('../../assets/images/app_icon.png');

type SplashScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Splash'>;
};

export function SplashScreen({ navigation }: SplashScreenProps) {
  useEffect(() => {
    initializeStartApp();
  }, [navigation]);

  const initializeStartApp = async () => {
    try {
      const res = await SplashController.loadAppConfig();
      if (res.status === SUCCESS) {
        const isLoggedIn = await AuthRepository.isLoggedIn();
        if (isLoggedIn) {
          navigation.replace('Main');
        } else {
          navigation.replace('Auth');
        }
      } else {
        navigation.replace('Auth');
      }
    } catch (err) {
      console.log('Intialization Error', err);
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
