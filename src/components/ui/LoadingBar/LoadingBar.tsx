import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View, type ViewStyle } from 'react-native';
import { theme } from '../../../theme';

export type LoadingBarProps = {
  /** Whether to show the loading indicator */
  visible?: boolean;
  /**
   * Visual variant.
   * - 'circular' (default): pill with animated circular loader
   * - 'bar': legacy full‑width bar
   */
  variant?: 'circular' | 'bar';
  /** Overall height for the bar variant */
  height?: number;
  /** Corner radius for the bar variant */
  borderRadius?: number;
  /** Optional style override for the outer container */
  containerStyle?: ViewStyle;
};

export function LoadingBar({
  visible = true,
  variant = 'circular',
  height = 4,
  borderRadius = 999,
  containerStyle,
}: LoadingBarProps) {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible || variant !== 'circular') {
      rotation.stopAnimation();
      return;
    }

    const loop = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    loop.start();
    return () => {
      loop.stop();
    };
  }, [rotation, visible, variant]);

  if (!visible) {
    return null;
  }

  // Legacy bar variant kept for compatibility
  if (variant === 'bar') {
    const { primaryLight, primaryDark } = theme.colors;

    const outer: ViewStyle = {
      width: '100%',
      backgroundColor: primaryDark,
      borderRadius,
      overflow: 'hidden',
      height,
      ...containerStyle,
    };

    const inner: ViewStyle = {
      flex: 1,
      backgroundColor: primaryLight,
    };

    return (
      <View style={outer}>
        <View style={inner} />
      </View>
    );
  }

  // New circular variant
  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <View style={styles.pill}>
        <Animated.View style={[styles.spinner, { transform: [{ rotate: spin }] }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: {
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
    shadowColor: theme.colors.black,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  spinner: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 3,
    borderColor: theme.colors.gray200,
    borderTopColor: theme.colors.primary,
    borderRightColor: theme.colors.primaryLight,
  },
});
