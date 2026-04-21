import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from './types';
import { HomeStackNavigator } from './HomeStackNavigator';
import { CartScreen } from '../features/cart/screens/CartScreen';
import { ProfileScreen } from '../features/profile/ProfileScreen';
import { ShareScreen } from '../features/share/screens/ShareScreen';
import { SettingsScreen } from '../features/settings/screens/SettingsScreen';
import { BottomTabBar } from './BottomTabBar';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

const Tab = createBottomTabNavigator<MainTabParamList>();

const HIDE_TAB_BAR_ROUTES = ['ProductScreen', 'ProductDetailScreen'];
export function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={props => <BottomTabBar {...props} />}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';
          const shouldHideBottomBar = HIDE_TAB_BAR_ROUTES.includes(routeName);
          console.log('Route', routeName);
          console.log('Route1', shouldHideBottomBar);
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
        component={SettingsScreen}
        options={{ title: 'Setting' }}
      />
    </Tab.Navigator>
  );
}
