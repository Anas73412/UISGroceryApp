import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { HomeStackParamList } from './types';
import { HomeScreen } from '../features/home/screens/HomeScreen';
import { CategoryScreen } from '../features/categrories/CategoryScreen';
import { ProductScreen } from '../features/products/ProductScreen';
import { ProductDetailScreen } from '../features/productdetails/ProductDetailScreen';
import { SearchScreen } from '../features/search/SearchScreen';
import { AddressScreen } from '../features/address/AddressScreen';
import { AddAddressScreen } from '../features/address/AddAddressScreen';
import { BillsScreen } from '../features/bills/BillsScreen';
import { NewsScreen } from '../features/news/NewsScreen';
import { NewsDetailsScreen } from '../features/news/NewsDetailsScreen';
import { OttChannelsScreen } from '../features/ott/OttChannelsScreen';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="CategoryScreen" component={CategoryScreen} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      <Stack.Screen name="ProductScreen" component={ProductScreen} />
      <Stack.Screen name="HomeDeliveryAddress" component={AddressScreen} />
      <Stack.Screen name="MyBills" component={BillsScreen} />
      <Stack.Screen name="AddAddress" component={AddAddressScreen} />
      <Stack.Screen
        name="ProductDetailScreen"
        component={ProductDetailScreen}
      />
      <Stack.Screen name="News" component={NewsScreen} />
      <Stack.Screen name="NewsDetails" component={NewsDetailsScreen} />
      <Stack.Screen name="OttChannels" component={OttChannelsScreen} />
    </Stack.Navigator>
  );
}
