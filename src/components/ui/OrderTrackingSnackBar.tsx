import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { theme } from '../../theme';
import { useOrderTracking } from '../context/OrderTrackingContext';

const SNACK_HEIGHT = 56;
const TAB_BAR_OFFSET = 72;

export function OrderTrackingSnackBar() {
  const insets = useSafeAreaInsets();
  const { tracking, snackVisible, openTrackingScreen, dismissSnack } =
    useOrderTracking();

  if (!snackVisible || !tracking) return null;

  const eta =
    tracking.etaMinutesMin != null && tracking.etaMinutesMax != null
      ? `${tracking.etaMinutesMin}–${tracking.etaMinutesMax} mins`
      : 'On the way';

  return (
    <View
      style={[
        styles.wrap,
        { bottom: insets.bottom + TAB_BAR_OFFSET, minHeight: SNACK_HEIGHT },
      ]}
      pointerEvents="box-none"
    >
      <View style={styles.bar}>
        <Pressable
          style={({ pressed }) => [
            styles.barMain,
            pressed && styles.barPressed,
          ]}
          onPress={openTrackingScreen}
        >
          <View style={styles.iconCircle}>
            <MaterialIcons
              name="delivery-dining"
              size={22}
              color={theme.colors.textOnPrimary}
            />
          </View>
          <View style={styles.textCol}>
            <Text style={styles.statusLabel} numberOfLines={1}>
              {tracking.statusLabel?.toUpperCase() ?? 'IN TRANSIT'}
            </Text>
            <Text style={styles.subtitle} numberOfLines={1}>
              Order #{tracking.orderKey} · {eta}
            </Text>
          </View>
          <MaterialIcons
            name="chevron-right"
            size={24}
            color={theme.colors.primary}
          />
        </Pressable>
        <Pressable hitSlop={12} onPress={dismissSnack} style={styles.closeBtn}>
          <MaterialIcons
            name="close"
            size={18}
            color={theme.colors.gray500}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: theme.spacing[4],
    right: theme.spacing[4],
    zIndex: 100,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    paddingRight: theme.spacing[1],
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    shadowColor: theme.colors.black,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  barMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing[2],
    paddingLeft: theme.spacing[3],
  },
  barPressed: {
    opacity: 0.92,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing[3],
  },
  textCol: {
    flex: 1,
    minWidth: 0,
  },
  statusLabel: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    letterSpacing: 0.5,
  },
  subtitle: {
    marginTop: 2,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.gray700,
  },
  closeBtn: {
    marginLeft: theme.spacing[1],
    padding: theme.spacing[1],
  },
});
