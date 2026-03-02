import React, { useEffect } from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { appTheme } from '../../theme';
import { styles } from './style';

const appIcon = require('../../assets/images/app_icon.png');

type SplashScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Splash'>;
};

export function SplashScreen({ navigation }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      // TODO: Check authentication state here
      // If user is authenticated: navigation.replace('Main')
      // If not authenticated: navigation.replace('Auth')
      navigation.replace('Auth');
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image source={appIcon} style={styles.appIcon} resizeMode="contain" />
        <Text style={styles.brandText}>UIS Groceries</Text>
        <ActivityIndicator
          size="small"
          color={appTheme.primary}
          style={styles.spinner}
        />
      </View>
    </View>
  );
}
