import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from './types';
import { HomeStackNavigator } from './HomeStackNavigator';
import { CartScreen } from '../features/cart/CartScreen';
import { ProfileScreen } from '../features/profile/ProfileScreen';
import { ShareScreen } from '../features/share/screens/ShareScreen';
import { SettingsStackNavigator } from './SettingsStackNavigator';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BottomTabBar } from './BottomTabBar';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

const Tab = createBottomTabNavigator<MainTabParamList>();

const renderTabBar = (props: BottomTabBarProps) => <BottomTabBar {...props} />;

const HIDE_TAB_BAR_ROUTES = [
  'ProductScreen',
  'ProductDetailScreen',
  'HomeDeliveryAddress',
  'MyProductRequest',
  'NewProductRequest',
  'Order',
  'OrderDetail',
];
export function MainTabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={renderTabBar}>
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';
          const shouldHideBottomBar = HIDE_TAB_BAR_ROUTES.includes(routeName);
          return {
            title: 'Home',
            tabBarStyle: { display: shouldHideBottomBar ? 'none' : 'flex' },
          };
        }}
        // options={{ title: 'Home' }}
      />
      <Tab.Screen
        name="ShareTab"
        component={ShareScreen}
        options={{ title: 'Share' }}
      />
      <Tab.Screen
        name="CartTab"
        component={CartScreen}
        options={{ title: 'Cart' }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsStackNavigator}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'SettingsMain';
          const shouldHideBottomBar = routeName === 'DeliveryAddress';
          return {
            title: 'Setting',
            tabBarStyle: { display: shouldHideBottomBar ? 'none' : 'flex' },
          };
        }}
      />
    </Tab.Navigator>
  );
}
