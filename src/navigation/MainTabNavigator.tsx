import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from './types';
import { HomeStackNavigator } from './HomeStackNavigator';
import { CartScreen } from '../features/cart/screens/CartScreen';
import { ProfileScreen } from '../features/profile/screens/ProfileScreen';
import { ShareScreen } from '../features/share/screens/ShareScreen';
import { SettingsScreen } from '../features/settings/screens/SettingsScreen';
import { BottomTabBar } from './BottomTabBar';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={props => <BottomTabBar {...props} />}
    >
      <Tab.Screen name="HomeTab" component={HomeStackNavigator} options={{ title: 'Home' }} />
      <Tab.Screen name="ShareTab" component={ShareScreen} options={{ title: 'Share' }} />
      <Tab.Screen name="CartTab" component={CartScreen} options={{ title: 'Cart' }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: 'Profile' }} />
      <Tab.Screen name="SettingsTab" component={SettingsScreen} options={{ title: 'Setting' }} />
    </Tab.Navigator>
  );
}
