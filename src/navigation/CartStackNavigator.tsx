import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { CartStackParamList } from './types';
import { CartScreen } from '../features/cart/CartScreen';
import { PaymentSuccessScreen } from '../features/cart/PaymentSuccessScreen';
import { PaymentFailureScreen } from '../features/payment/screens/PaymentFailureScreen';

const Stack = createNativeStackNavigator<CartStackParamList>();

export function CartStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CartMain" component={CartScreen} />
      <Stack.Screen
        name="PaymentSuccess"
        component={PaymentSuccessScreen}
        options={{ animation: 'fade' }}
      />
      <Stack.Screen
        name="PaymentFailure"
        component={PaymentFailureScreen}
        options={{ animation: 'fade' }}
      />
    </Stack.Navigator>
  );
}
