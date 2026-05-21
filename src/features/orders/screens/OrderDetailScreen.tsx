import React from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { AppHeader } from '../../../components/ui';
import type { SettingsStackParamList } from '../../../navigation/types';
import type { OrderModel } from '../../../data/models/OrderModel';
import type { OrderItemModel } from '../../../data/models/OrderItemModel';
import { IMAGE_BASE_URL, RUPEE_SIGN } from '../../../utils/constants';
import { useMessageDialog } from '../../../components/context/MessageDialogContext';
import { theme } from '../../../theme';
import styles from './OrderDetailScreen.Style';

type Props = NativeStackScreenProps<SettingsStackParamList, 'OrderDetail'>;

type OrderUiStatus = 'pending' | 'delivered' | 'cancelled';

function getOrderUiStatus(order: OrderModel): OrderUiStatus {
  if (order.reason?.trim()) return 'cancelled';
  const s = order.status;
  if (s === 4) return 'cancelled';
  if (s === 3) return 'delivered';
  return 'pending';
}

function getOrderDisplayKey(order: OrderModel): string {
  return (
    order.orderKey?.trim() ||
    String(order.orderId ?? order.razorpayPaymentId ?? '')
  );
}

function getItemImageUri(item: OrderItemModel): string {
  const raw = item.productImage?.trim() ?? '';
  if (!raw) return '';
  return raw.startsWith('http') ? raw : `${IMAGE_BASE_URL}${raw}`;
}

function computeSavings(items: OrderItemModel[]): number {
  let saved = 0;
  for (const line of items) {
    const qty = line.quantity ?? 0;
    if (qty <= 0) continue;
    const sell = line.sellingPrice ?? line.price ?? 0;
    const mrp = line.costPrice ?? line.price ?? sell;
    if (mrp > sell) saved += (mrp - sell) * qty;
  }
  return Math.max(0, saved);
}

function OrderDetailScreen({ route, navigation }: Props) {
  const { order } = route.params;
  const { showErrorDialog } = useMessageDialog();
  const uiStatus = getOrderUiStatus(order);
  const displayKey = getOrderDisplayKey(order);
  const items = order.orderItemsList ?? [];
  const savings = computeSavings(items);

  const onTrack = () => {
    if (uiStatus === 'pending') {
      showErrorDialog('Track order', 'Tracking will be available soon.');
      return;
    }
    showErrorDialog('Track order', 'This order has been completed.');
  };

  const onHelp = () => {
    navigation.navigate('ContactUs');
  };

  const onNotification = () => {
    showErrorDialog('Notifications', 'You have no new notifications.');
  };

  return (
    <View style={styles.screen}>
      <AppHeader
        title="Order Details"
        showCartIcon={false}
        showNotificationIcon
        onNotificationPress={onNotification}
        titleColor={theme.colors.primary}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.statusCard}>
          {uiStatus === 'delivered' ? (
            <View style={styles.successPill}>
              <Text style={styles.successPillText}>Success</Text>
            </View>
          ) : uiStatus === 'cancelled' ? (
            <View style={styles.cancelledPill}>
              <Text style={styles.cancelledPillText}>Cancelled</Text>
            </View>
          ) : (
            <View style={styles.transitPill}>
              <Text style={styles.transitPillText}>In transit</Text>
            </View>
          )}
          <Text style={styles.statusOrderId} numberOfLines={1}>
            #{displayKey}
          </Text>
          <Pressable onPress={onTrack} hitSlop={8}>
            <Text style={styles.trackLink}>Track</Text>
          </Pressable>
        </View>

        {items.map((line, idx) => {
          const uri = getItemImageUri(line);
          const qty = line.quantity ?? 0;
          const unitSell = line.sellingPrice ?? line.price ?? 0;
          const unitMrp = line.costPrice ?? line.price ?? unitSell;
          const showStrike = unitMrp > unitSell;
          const lineTotal =
            line.itemTotalAmount ?? Math.round(unitSell * qty * 100) / 100;

          return (
            <View
              style={styles.itemCard}
              key={`${line.orderId}-${line.productId}-${idx}`}
            >
              {uri ? (
                <Image source={{ uri }} style={styles.itemThumb} />
              ) : (
                <View style={[styles.itemThumb, styles.itemThumbPlaceholder]} />
              )}
              <View style={styles.itemBody}>
                <Text style={styles.itemName} numberOfLines={3}>
                  {line.productName?.trim() ||
                    `Product #${line.productId ?? ''}`}
                </Text>
                <Text style={styles.itemQtyPrice}>
                  {qty}x {RUPEE_SIGN}
                  {unitSell.toFixed(1)}
                </Text>
                {showStrike ? (
                  <Text style={styles.itemMrp}>
                    {RUPEE_SIGN}
                    {unitMrp.toFixed(1)}
                  </Text>
                ) : (
                  <View style={{ marginBottom: theme.spacing[2] }} />
                )}
                <View style={styles.itemFinalRow}>
                  <Text style={styles.itemFinal}>
                    {RUPEE_SIGN}
                    {lineTotal.toFixed(1)}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}

        <View style={styles.billCard}>
          <Text style={styles.billTitle}>Bill details</Text>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Items total</Text>
            <Text style={styles.billValue}>
              {RUPEE_SIGN}
              {(order.totalItemAmount ?? 0).toFixed(1)}
            </Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Delivery charge</Text>
            <Text style={[styles.billValue, styles.billValueGreen]}>
              {RUPEE_SIGN}
              {(order.deliveryCharge ?? 0).toFixed(1)}
            </Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Small cart charge</Text>
            <Text style={styles.billValue}>
              {RUPEE_SIGN}
              {(order.smartCartCharge ?? 0).toFixed(1)}
            </Text>
          </View>

          <View style={styles.dashedRule} />

          <View style={styles.grandRow}>
            <Text style={styles.grandLabel}>Grand total</Text>
            <Text style={styles.grandValue}>
              {RUPEE_SIGN}
              {(order.grandTotal ?? 0).toFixed(1)}
            </Text>
          </View>

          {savings > 0 ? (
            <View style={styles.savingsStrip}>
              <MaterialIcons
                name="savings"
                size={22}
                color={theme.colors.primary}
              />
              <Text style={styles.savingsText}>
                You saved {RUPEE_SIGN}
                {savings.toFixed(1)} on this order!
              </Text>
            </View>
          ) : null}
        </View>

        <Pressable
          style={({ pressed }) => [styles.helpBox, pressed && { opacity: 0.9 }]}
          onPress={onHelp}
        >
          <View style={styles.helpBoxRow}>
            <MaterialIcons
              name="support-agent"
              size={22}
              color={theme.colors.gray500}
            />
            <Text style={styles.helpText} numberOfLines={1}>
              Need help with this order?
            </Text>
          </View>
        </Pressable>
      </ScrollView>
    </View>
  );
}

export default OrderDetailScreen;
