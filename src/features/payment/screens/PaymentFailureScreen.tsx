import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader, Button } from '../../../components/ui';
import type { CartStackParamList } from '../../../navigation/types';
import { theme } from '../../../theme';
import {
  PAYMENT_FAILURE_ANIMATION,
  PAYMENT_FAILURE_AUTO_CLOSE_MS,
  PAYMENT_FAILURE_GIF,
} from '../constants';
import type { PaymentFailureParams } from '../types';
import styles from './PaymentFailureScreen.Style';
import LottieView from 'lottie-react-native';
import { paymentService } from '../../cart/paymentService';
import { SUCCESS } from '../../../utils/constants';

type PaymentFailureRouteProp = RouteProp<CartStackParamList, 'PaymentFailure'>;
type PaymentFailureNavProp = NativeStackNavigationProp<
  CartStackParamList,
  'PaymentFailure'
>;

const AUTO_CLOSE_SECONDS = Math.ceil(PAYMENT_FAILURE_AUTO_CLOSE_MS / 1000);

export function PaymentFailureScreen() {
  const navigation = useNavigation<PaymentFailureNavProp>();
  const route = useRoute<PaymentFailureRouteProp>();
  const { title, message, orderId, orderKey, paymentId, amount } =
    route.params as PaymentFailureParams;

  const closedRef = useRef(false);
  const statusUpdatedRef = useRef(false);
  const [secondsLeft, setSecondsLeft] = useState(AUTO_CLOSE_SECONDS);

  const returnToCart = useCallback(() => {
    if (closedRef.current) return;
    closedRef.current = true;
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('CartMain');
    }
  }, [navigation]);

  useEffect(() => {
    if (!orderId || statusUpdatedRef.current) return;
    statusUpdatedRef.current = true;

    const syncFailedStatus = async () => {
      try {
        const res = await paymentService.updatePaymentStatus({
          orderId,
          orderKey,
          razorpayPaymentId: paymentId,
          grandTotal: amount, // Amount is not relevant for failed status update
          paymentStatus: 'failed',
        });
        if (res.status !== SUCCESS) {
        }
      } catch (error) {}
    };

    syncFailedStatus();
  }, [orderId, orderKey, paymentId]);

  useEffect(() => {
    const closeTimer = setTimeout(returnToCart, PAYMENT_FAILURE_AUTO_CLOSE_MS);

    const tickTimer = setInterval(() => {
      setSecondsLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      clearTimeout(closeTimer);
      clearInterval(tickTimer);
    };
  }, [returnToCart]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <AppHeader
        title="Payment"
        showCartIcon={false}
        onBackPress={returnToCart}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <LottieView
            source={PAYMENT_FAILURE_ANIMATION}
            autoPlay
            loop
            style={styles.gif}
            resizeMode="contain"
          />

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.countdownBox}>
            <MaterialIcons
              name="schedule"
              size={20}
              color={theme.colors.primary}
            />
            <Text style={styles.countdownText}>
              Returning to cart in {secondsLeft}s…
            </Text>
          </View>

          <View style={styles.buttonWrap}>
            <Button
              title="Back to Cart"
              variant="primary"
              onPress={returnToCart}
            />
          </View>

          <Text style={styles.hint}>
            You can update your cart and try checkout again.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
