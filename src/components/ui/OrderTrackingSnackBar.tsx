import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { theme } from '../../theme';
import { useOrderTracking } from '../context/OrderTrackingContext';

const TAB_BAR_OFFSET = 72;

export function OrderTrackingSnackBar() {
  const insets = useSafeAreaInsets();

  const { tracking, snackVisible, openTrackingScreen, dismissSnack } =
    useOrderTracking();

  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.08, {
          duration: 800,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(1, {
          duration: 800,
          easing: Easing.inOut(Easing.ease),
        }),
      ),
      -1,
      true,
    );
  }, []);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (!snackVisible || !tracking) {
    return null;
  }

  const eta =
    tracking.etaMinutesMin != null && tracking.etaMinutesMax != null
      ? `${tracking.etaMinutesMin}-${tracking.etaMinutesMax} min`
      : 'On the way';

  const status = tracking.statusLabel?.toLowerCase();

  const statusColor =
    status === 'delivered'
      ? theme.colors.success
      : status === 'cancelled'
      ? theme.colors.error
      : theme.colors.primary;

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.wrapper,
        {
          bottom: insets.bottom + TAB_BAR_OFFSET,
        },
      ]}
    >
      <Pressable
        onPress={openTrackingScreen}
        style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: statusColor,
              },
            ]}
          >
            <Text style={styles.statusBadgeText}>
              {tracking.statusLabel?.toUpperCase() ?? 'IN TRANSIT'}
            </Text>
          </View>

          <Pressable
            hitSlop={12}
            onPress={dismissSnack}
            style={styles.closeButton}
          >
            <MaterialIcons
              name="close"
              size={18}
              color={theme.colors.gray600}
            />
          </Pressable>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <Animated.View
            style={[
              styles.iconContainer,
              {
                backgroundColor: statusColor,
              },
              animatedIconStyle,
            ]}
          >
            <MaterialIcons name="delivery-dining" size={30} color="#FFFFFF" />
          </Animated.View>

          <View style={styles.infoContainer}>
            <Text style={styles.orderId} numberOfLines={1}>
              Order #{tracking.orderKey}
            </Text>

            <Text
              style={[
                styles.etaText,
                {
                  color: statusColor,
                },
              ]}
            >
              {eta === 'On the way'
                ? 'Your order is on the way'
                : `Arriving in ${eta}`}
            </Text>

            <Text style={styles.helperText}>Tap to view live tracking</Text>
          </View>

          <View
            style={[
              styles.trackButton,
              {
                backgroundColor: statusColor,
              },
            ]}
          >
            <Text style={styles.trackButtonText}>Track</Text>
          </View>
        </View>

        {/* Progress Bar */}
        {status !== 'delivered' && status !== 'cancelled' && (
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: statusColor,
                  width: '65%',
                },
              ]}
            />
          </View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 999,
    backgroundColor: '#FFFFFF',
  },

  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,

    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 8,
    },

    elevation: 12,
  },

  pressed: {
    opacity: 0.95,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },

  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
  },

  closeButton: {
    padding: 4,
  },

  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconContainer: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
  },

  infoContainer: {
    flex: 1,
    marginLeft: 14,
    marginRight: 10,
  },

  orderId: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },

  etaText: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '600',
  },

  helperText: {
    marginTop: 4,
    fontSize: 12,
    color: '#6B7280',
  },

  trackButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  trackButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  progressTrack: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 999,
    marginTop: 14,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
});
