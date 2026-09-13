import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from './types';
import { HomeStackNavigator } from './HomeStackNavigator';
import { CartStackNavigator } from './CartStackNavigator';
import { ProfileScreen } from '../features/profile/ProfileScreen';
import { ShareScreen } from '../features/share/screens/ShareScreen';
import { PlanScreen } from '../features/plan/screens/PlanScreen';
import { SettingsStackNavigator } from './SettingsStackNavigator';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BottomTabBar } from './BottomTabBar';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { sessionStore } from '../store/sessionStore';
import { isWiFiUserEnabled } from '../utils/userAccess';

const Tab = createBottomTabNavigator<MainTabParamList>();

const renderTabBar = (props: BottomTabBarProps) => <BottomTabBar {...props} />;

const HIDE_TAB_BAR_ROUTES = [
  'ProductScreen',
  'ProductDetailScreen',
  'HomeDeliveryAddress',
  'MyBills',
  'MyProductRequest',
  'NewProductRequest',
  'Order',
  'OrderDetail',
  'OrderTracking',
  'PaymentSuccess',
  'PaymentFailure',
  'News',
  'NewsDetails',
];
export function MainTabNavigator() {
  const user = sessionStore(state => state.user);
  const isWifiUser = isWiFiUserEnabled(user);

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
      {isWifiUser ? (
        <Tab.Screen
          name="PlanTab"
          component={PlanScreen}
          options={{ title: 'Plan' }}
        />
      ) : (
        <Tab.Screen
          name="ShareTab"
          component={ShareScreen}
          options={{ title: 'Share' }}
        />
      )}
      <Tab.Screen
        name="CartTab"
        component={CartStackNavigator}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'CartMain';
          const shouldHideBottomBar =
            routeName === 'PaymentFailure' || routeName === 'PaymentSuccess';
          return {
            title: 'Cart',
            tabBarStyle: { display: shouldHideBottomBar ? 'none' : 'flex' },
          };
        }}
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
          const routeName =
            getFocusedRouteNameFromRoute(route) ?? 'SettingsMain';
          const settingsHideRoutes = [
            'DeliveryAddress',
            'AddAddress',
            'ContactUs',
            'MyProductRequest',
            'NewProductRequest',
            'Order',
            'OrderDetail',
            'OrderTracking',
            'MyComplaints',
            'AddComplain',
            'News',
            'NewsDetails',
          ];
          const shouldHideBottomBar = settingsHideRoutes.includes(routeName);
          return {
            title: 'Setting',
            tabBarStyle: { display: shouldHideBottomBar ? 'none' : 'flex' },
          };
        }}
      />
    </Tab.Navigator>
  );
}
