import React, { useCallback, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, Linking } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { AppHeader, Button } from '../../../components/ui';
import type { SettingsStackParamList } from '../../../navigation/types';
import type { OrderTrackingModel } from '../../../data/models/OrderTrackingModel';
import type { OrderTrackingStepKey } from '../../../data/models/OrderTrackingModel';
import { useOrderTracking } from '../../../components/context/OrderTrackingContext';
import { useMessageDialog } from '../../../components/context/MessageDialogContext';
import {
  getOrderDisplayKey,
  getOrderUiStatus,
} from '../orderStatus';
import { trackingFromOrder } from '../../../services/orderTrackingService';
import { theme } from '../../../theme';
import styles from './OrderTrackingScreen.Style';

type Props = NativeStackScreenProps<SettingsStackParamList, 'OrderTracking'>;

const STEP_ORDER: OrderTrackingStepKey[] = [
  'placed',
  'packed',
  'out_for_delivery',
  'delivered',
];

function getActiveStepIndex(status: number): number {
  if (status >= 3 && status !== 4) return 3;
  if (status >= 2) return 2;
  if (status >= 1) return 1;
  return 0;
}

function OrderTrackingScreen({ route, navigation }: Props) {
  const { order } = route.params;
  const { showErrorDialog } = useMessageDialog();
  const { startTracking, tracking: contextTracking } = useOrderTracking();
  const displayKey = getOrderDisplayKey(order);

  useEffect(() => {
    void startTracking(order);
  }, [order, startTracking]);

  const tracking: OrderTrackingModel =
    contextTracking?.orderKey === displayKey ||
    contextTracking?.orderKey === String(order.orderId)
      ? contextTracking
      : trackingFromOrder(order);

  const activeStepIndex = useMemo(
    () => getActiveStepIndex(tracking.status),
    [tracking.status],
  );

  const steps = tracking.steps ?? trackingFromOrder(order).steps ?? [];
  const etaLabel =
    tracking.etaMinutesMin != null && tracking.etaMinutesMax != null
      ? `${tracking.etaMinutesMin} – ${tracking.etaMinutesMax} mins`
      : 'Soon';
  const distanceLabel =
    tracking.distanceKm != null
      ? `${tracking.distanceKm.toFixed(1)} km away`
      : '';

  const onViewDetails = () => {
    navigation.navigate('OrderDetail', { order });
  };

  const onCallDriver = useCallback(() => {
    const phone = tracking.driverPhone?.trim();
    if (!phone) {
      showErrorDialog('Call', 'Driver contact is not available yet.');
      return;
    }
    void Linking.openURL(`tel:${phone}`);
  }, [showErrorDialog, tracking.driverPhone]);

  const onMessageDriver = () => {
    showErrorDialog('Message', 'Chat with delivery partner will be available soon.');
  };

  const uiStatus = getOrderUiStatus(order);

  return (
    <View style={styles.screen}>
      <AppHeader
        title="Track Your Order"
        showCartIcon={false}
        titleColor={theme.colors.primary}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.mapCard}>
          <View style={styles.mapInner}>
            <View style={styles.mapRoad} />
            <View style={styles.mapMarkersRow}>
              <View style={styles.markerCol}>
                <View style={[styles.markerPill, styles.markerPillRider]}>
                  <MaterialIcons
                    name="two-wheeler"
                    size={22}
                    color={theme.colors.textOnPrimary}
                  />
                </View>
                {uiStatus === 'pending' ? (
                  <View style={styles.markerTag}>
                    <Text style={styles.markerTagText}>MOVING</Text>
                  </View>
                ) : null}
              </View>
              <View style={styles.markerCol}>
                <View style={[styles.markerPill, styles.markerPillHome]}>
                  <MaterialIcons
                    name="home"
                    size={22}
                    color={theme.colors.textOnPrimary}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.summaryBlock}>
          <Text style={styles.summaryStatus}>
            {tracking.statusLabel?.toUpperCase() ?? 'IN TRANSIT'}
          </Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryEta}>{etaLabel}</Text>
            {distanceLabel ? (
              <View style={styles.distancePill}>
                <Text style={styles.distanceText}>{distanceLabel}</Text>
              </View>
            ) : null}
          </View>
        </View>

        <View style={styles.timelineCard}>
          {STEP_ORDER.map((stepKey, index) => {
            const step = steps.find(s => s.key === stepKey);
            const isDone = index < activeStepIndex;
            const isActive = index === activeStepIndex && uiStatus === 'pending';
            const isPending = index > activeStepIndex;
            const isLast = index === STEP_ORDER.length - 1;

            let iconName: string = 'inventory-2';
            if (stepKey === 'placed') iconName = 'check';
            if (stepKey === 'packed') iconName = 'check';
            if (stepKey === 'out_for_delivery') iconName = 'local-shipping';
            if (stepKey === 'delivered') iconName = 'inventory-2';

            return (
              <View style={styles.stepRow} key={stepKey}>
                <View style={styles.stepRail}>
                  <View
                    style={[
                      styles.stepDot,
                      isDone && styles.stepDotDone,
                      isActive && styles.stepDotActive,
                      isPending && styles.stepDotPending,
                    ]}
                  >
                    <MaterialIcons
                      name={iconName as 'check'}
                      size={16}
                      color={
                        isPending
                          ? theme.colors.gray500
                          : theme.colors.textOnPrimary
                      }
                    />
                  </View>
                  {!isLast ? (
                    <View
                      style={[
                        styles.stepLine,
                        isDone ? styles.stepLineDone : styles.stepLinePending,
                      ]}
                    />
                  ) : null}
                </View>
                <View style={styles.stepBody}>
                  <Text
                    style={[
                      styles.stepTitle,
                      isActive && styles.stepTitleActive,
                      isPending && styles.stepTitlePending,
                    ]}
                  >
                    {step?.title ?? stepKey}
                  </Text>
                  <Text style={styles.stepSubtitle} numberOfLines={2}>
                    {step?.subtitle ?? ''}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {uiStatus === 'pending' ? (
          <View style={styles.driverCard}>
            <View style={styles.driverAvatar}>
              <MaterialIcons
                name="person"
                size={28}
                color={theme.colors.gray500}
              />
            </View>
            <View style={styles.driverInfo}>
              <View style={styles.driverNameRow}>
                <Text style={styles.driverName}>
                  {tracking.driverName ?? 'Delivery Partner'}
                </Text>
                {tracking.driverRating != null ? (
                  <View style={styles.ratingPill}>
                    <MaterialIcons name="star" size={12} color="#F9A825" />
                    <Text style={styles.ratingText}>
                      {tracking.driverRating.toFixed(1)}
                    </Text>
                  </View>
                ) : null}
              </View>
              <Text style={styles.driverVehicle} numberOfLines={2}>
                {tracking.driverVehicle ?? 'On the way to your address'}
              </Text>
            </View>
            <View style={styles.driverActions}>
              <Pressable
                style={[styles.actionCircle, styles.actionCircleMuted]}
                onPress={onMessageDriver}
              >
                <MaterialIcons
                  name="chat-bubble-outline"
                  size={22}
                  color={theme.colors.gray600}
                />
              </Pressable>
              <Pressable
                style={[styles.actionCircle, styles.actionCirclePrimary]}
                onPress={onCallDriver}
              >
                <MaterialIcons
                  name="phone"
                  size={22}
                  color={theme.colors.textOnPrimary}
                />
              </Pressable>
            </View>
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="View Order Details"
          variant="secondary"
          onPress={onViewDetails}
        />
      </View>
    </View>
  );
}

export default OrderTrackingScreen;
