import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { SettingsStackParamList } from './types';
import { SettingsScreen } from '../features/settings/screens/SettingsScreen';
import { AboutUsScreen } from '../features/settings/screens/AboutUsScreen';
import { ContactUsScreen } from '../features/settings/screens/ContactUsScreen';
import { AddressScreen } from '../features/address/AddressScreen';
import { AddAddressScreen } from '../features/address/AddAddressScreen';
import OrderScreen from '../features/orders/screens/OrderScreen';
import OrderDetailScreen from '../features/orders/screens/OrderDetailScreen';
import { MyProductRequestScreen } from '../features/productrequests/MyProductRequestScreen';
import { NewProductRequestScreen } from '../features/productrequests/NewProductRequestScreen';

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export function SettingsStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingsMain" component={SettingsScreen} />
      <Stack.Screen name="AboutUs" component={AboutUsScreen} />
      <Stack.Screen name="ContactUs" component={ContactUsScreen} />
      <Stack.Screen name="DeliveryAddress" component={AddressScreen} />
      <Stack.Screen name="AddAddress" component={AddAddressScreen} />
      <Stack.Screen name="Order" component={OrderScreen} />
      <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
      <Stack.Screen
        name="MyProductRequest"
        component={MyProductRequestScreen}
      />
      <Stack.Screen
        name="NewProductRequest"
        component={NewProductRequestScreen}
      />
    </Stack.Navigator>
  );
}
