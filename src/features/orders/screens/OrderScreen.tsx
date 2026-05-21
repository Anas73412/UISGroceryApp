import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  type ListRenderItem,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { SettingsStackParamList } from '../../../navigation/types';
import { AppHeader } from '../../../components/ui';
import type { OrderModel } from '../../../data/models/OrderModel';
import type { OrderItemModel } from '../../../data/models/OrderItemModel';
import { IMAGE_BASE_URL, RUPEE_SIGN, SUCCESS } from '../../../utils/constants';
import { useLoading } from '../../../components/context/LoadingContext';
import { useMessageDialog } from '../../../components/context/MessageDialogContext';
import styles from './OrderScreen.Style';
import { OrderController } from '../controller';

type OrderTab = 'all' | 'pending' | 'completed' | 'cancelled';

type OrderUiStatus = 'pending' | 'delivered' | 'cancelled';

const TAB_ITEMS: { key: OrderTab; label: string }[] = [
  { key: 'all', label: 'All Orders' },
  { key: 'pending', label: 'Pending' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

const STATUS_BADGE: Record<
  OrderUiStatus,
  { label: string; color: string; bg: string }
> = {
  pending: {
    label: 'IN TRANSIT',
    color: '#1565C0',
    bg: '#E3F2FD',
  },
  delivered: {
    label: 'DELIVERED',
    color: '#2E7D32',
    bg: '#E8F5E9',
  },
  cancelled: {
    label: 'CANCELLED',
    color: '#C62828',
    bg: '#FFEBEE',
  },
};

const MAX_THUMBS = 3;

/** Map API numeric status to UI; adjust when backend contract is known. */
function getOrderUiStatus(order: OrderModel): OrderUiStatus {
  if (order.reason?.trim()) return 'cancelled';
  const s = order.status;
  if (s === 4) return 'cancelled';
  if (s === 3) return 'delivered';
  return 'pending';
}

function formatOrderDate(milliseconds: string | number): string {
  const d = new Date(Number(milliseconds));

  if (Number.isNaN(d.getTime())) return '';

  const now = new Date();

  const isSameDay =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();

  const timeStr = d.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  if (isSameDay) {
    return `Today, ${timeStr}`;
  }

  const dateStr = d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return `${dateStr}, ${timeStr}`;
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

function buildOrderDetailLine(order: OrderModel): string {
  const n = order.orderItemsList?.length ?? 0;
  const parts: string[] = [`${n} item${n === 1 ? '' : 's'}`];
  if (order.paymentStatus?.trim()) {
    parts.push(order.paymentStatus.trim());
  }
  parts.push(`${RUPEE_SIGN}${(order.deliveryCharge ?? 0).toFixed(2)} delivery`);
  return parts.join(' · ');
}

function filterOrdersByTab(list: OrderModel[], tab: OrderTab): OrderModel[] {
  if (tab === 'all') return list;
  if (tab === 'pending') {
    return list.filter(o => getOrderUiStatus(o) === 'pending');
  }
  if (tab === 'cancelled') {
    return list.filter(o => getOrderUiStatus(o) === 'cancelled');
  }
  return list.filter(o => {
    const u = getOrderUiStatus(o);
    return u === 'delivered';
  });
}

const OrderScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<SettingsStackParamList>>();
  const { show, hide } = useLoading();
  const { showErrorDialog } = useMessageDialog();
  const [tab, setTab] = useState<OrderTab>('all');
  const [orders, setOrders] = useState<OrderModel[]>([]);

  const loadOrders = useCallback(async () => {
    show('Loading...');
    try {
      const res = await OrderController.getAllUserOrders();
      if (res.status !== SUCCESS || !Array.isArray(res.data)) {
        setOrders([]);
        if (res.message) showErrorDialog('Orders', res.message);
        return;
      }
      const sorted = [...res.data].sort(
        (a, b) => (b.orderId ?? 0) - (a.orderId ?? 0),
      );
      setOrders(sorted);
    } catch {
      setOrders([]);
      showErrorDialog('Orders', 'Could not load order history.');
    } finally {
      hide();
    }
  }, [hide, show, showErrorDialog]);

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [loadOrders]),
  );

  const filtered = useMemo(() => filterOrdersByTab(orders, tab), [orders, tab]);

  const onPrimaryAction = (order: OrderModel) => {
    if (getOrderUiStatus(order) === 'pending') {
      showErrorDialog('Track order', 'Tracking will be available soon.');
      return;
    }
    showErrorDialog('Reorder', 'Reorder will be available soon.');
  };

  const renderItem: ListRenderItem<OrderModel> = ({ item: order }) => {
    const uiStatus = getOrderUiStatus(order);
    const badge = STATUS_BADGE[uiStatus];
    const isCancelled = uiStatus === 'cancelled';
    const displayKey = getOrderDisplayKey(order);
    const items = order.orderItemsList ?? [];
    const thumbItems = items.slice(0, MAX_THUMBS);
    const overflowCount =
      items.length > MAX_THUMBS ? items.length - MAX_THUMBS : 0;

    return (
      <View style={styles.card}>
        <Pressable
          onPress={() => navigation.navigate('OrderDetail', { order })}
          style={({ pressed }) => [pressed && { opacity: 0.92 }]}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.orderIdText}>Order #{displayKey}</Text>
            <View style={[styles.badge, { backgroundColor: badge.bg }]}>
              <Text style={[styles.badgeText, { color: badge.color }]}>
                {badge.label}
              </Text>
            </View>
          </View>

          <Text style={styles.dateText}>
            {formatOrderDate(order.createdAt)}
          </Text>
          <Text style={styles.detailText} numberOfLines={2}>
            {buildOrderDetailLine(order)}
          </Text>

          <View style={styles.thumbRow}>
            {thumbItems.map((line, idx) => {
              const uri = getItemImageUri(line);
              return (
                <View
                  key={`${order.orderId}-img-${line.itemId ?? idx}`}
                  style={styles.thumbWrap}
                >
                  {uri ? (
                    <Image source={{ uri }} style={styles.thumb} />
                  ) : (
                    <View style={[styles.thumb, styles.thumbPlaceholder]} />
                  )}
                </View>
              );
            })}
            {overflowCount > 0 ? (
              <View style={styles.moreBox}>
                <Text style={styles.moreText}>+{overflowCount}</Text>
              </View>
            ) : null}
          </View>
        </Pressable>

        <View style={styles.cardFooter}>
          <Pressable onPress={() => navigation.navigate('OrderDetail', { order })}>
            <Text style={styles.totalText}>
              {RUPEE_SIGN}
              {(order.grandTotal ?? 0).toFixed(2)}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => onPrimaryAction(order)}
            style={({ pressed }) => [
              styles.actionBtn,
              isCancelled ? styles.actionBtnMuted : styles.actionBtnSolid,
              pressed && { opacity: 0.85 },
            ]}
          >
            <Text
              style={[
                styles.actionBtnText,
                isCancelled && styles.actionBtnTextMuted,
              ]}
            >
              {uiStatus === 'pending' ? 'Track Order' : 'Reorder'}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <AppHeader title="Order History" showCartIcon={false} />

      <View style={styles.tabs}>
        {TAB_ITEMS.map(t => {
          const active = tab === t.key;
          return (
            <Pressable
              key={t.key}
              style={styles.tabPress}
              onPress={() => setTab(t.key)}
            >
              <Text
                style={[
                  styles.tabLabel,
                  active ? styles.tabLabelActive : styles.tabLabelInactive,
                ]}
              >
                {t.label}
              </Text>
              {active ? <View style={styles.tabUnderline} /> : null}
            </Pressable>
          );
        })}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={o => String(o.orderId)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No orders in this tab.</Text>
        }
      />
    </View>
  );
};

export default OrderScreen;
