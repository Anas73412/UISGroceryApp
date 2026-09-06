import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../../theme';
import { RUPEE_SIGN, SUCCESS } from '../../utils/constants';
import { paymentService } from './paymentService';
import type { CartStackParamList } from '../../navigation/types';
import type { PaymentSuccessParams } from '../payment/types';
import { appPrefs } from '../../data/repositories/AppPrefRepository';
import { PREF_KEYS } from '../../data/repositories/GenericPrefRepository';

type PaymentSuccessRouteProp = RouteProp<CartStackParamList, 'PaymentSuccess'>;
type PaymentSuccessNavProp = NativeStackNavigationProp<
  CartStackParamList,
  'PaymentSuccess'
>;

export function PaymentSuccessScreen() {
  const navigation = useNavigation<PaymentSuccessNavProp>();
  const route = useRoute<PaymentSuccessRouteProp>();
  const { paymentId, orderId, orderKey, amount } =
    route.params as PaymentSuccessParams;
  const statusUpdatedRef = useRef(false);

  useEffect(() => {
    if (statusUpdatedRef.current) return;
    statusUpdatedRef.current = true;

    const syncPaymentStatus = async () => {
      try {
        const res = await paymentService.updatePaymentStatus({
          orderId,
          orderKey,
          grandTotal: amount,
          razorpayPaymentId: paymentId,
          paymentStatus: 'captured',
        });
        await appPrefs.set(PREF_KEYS.ACTIVE_ORDER_ID, orderId);
        await appPrefs.set(
          PREF_KEYS.ACTIVE_ORDER_KEY,
          orderKey?.toString() ?? '',
        );
      } catch {
        // Payment status sync should not block order tracking setup.
      }
    };

    syncPaymentStatus();
  }, [orderId, orderKey, paymentId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleContinue();
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    navigation.navigate('CartMain');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <MaterialIcons
            name="check-circle"
            size={80}
            color={theme.colors.success || '#4CAF50'}
          />
        </View>

        {/* Success Message */}
        <Text style={styles.title}>Payment Successful!</Text>
        <Text style={styles.subtitle}>
          Your order has been placed successfully
        </Text>

        {/* Order Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment ID</Text>
            <Text style={styles.detailValue} selectable>
              {paymentId}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Order ID</Text>
            <Text style={styles.detailValue} selectable>
              {String(orderId)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount</Text>
            <Text style={styles.amountValue}>
              {RUPEE_SIGN}
              {amount.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Info Message */}
        <View style={styles.infoBox}>
          <MaterialIcons
            name="info"
            size={20}
            color={theme.colors.primary}
            style={{ marginRight: 12 }}
          />
          <Text style={styles.infoText}>
            You will receive an order confirmation via email and SMS shortly.
          </Text>
        </View>
      </View>

      {/* Continue Button */}
      <Pressable style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueButtonText}>Continue Shopping</Text>
        <MaterialIcons
          name="arrow-forward"
          size={20}
          color={theme.colors.textOnPrimary}
          style={{ marginLeft: 8 }}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'space-between',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  detailsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    maxWidth: '60%',
  },
  amountValue: {
    fontSize: 18,
    color: theme.colors.primary || '#FF5722',
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 12,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#0277BD',
    lineHeight: 18,
  },
  continueButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary || '#FF5722',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  continueButtonText: {
    color: theme.colors.textOnPrimary || '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
