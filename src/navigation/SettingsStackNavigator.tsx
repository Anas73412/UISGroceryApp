import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { SettingsStackParamList } from './types';
import { SettingsScreen } from '../features/settings/screens/SettingsScreen';
import { AboutUsScreen } from '../features/settings/screens/AboutUsScreen';
import { ContactUsScreen } from '../features/settings/screens/ContactUsScreen';
import { AddressScreen } from '../features/address/AddressScreen';

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export function SettingsStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingsMain" component={SettingsScreen} />
      <Stack.Screen name="AboutUs" component={AboutUsScreen} />
      <Stack.Screen name="ContactUs" component={ContactUsScreen} />
      <Stack.Screen name="DeliveryAddress" component={AddressScreen} />
    </Stack.Navigator>
  );
}
