import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { theme } from '../../../theme';

export type GlobalLoaderProps = {
  visible: boolean;
  textContent?: string;
};

export function GlobalLoader({ visible, textContent = '' }: GlobalLoaderProps) {
  return (
    <Spinner
      visible={visible}
      // We render our own indicator + text
      customIndicator={<GlobalLoaderIndicator text={textContent} />}
      overlayColor="rgba(0, 0, 0, 0.35)"
      animation="fade"
      cancelable={false}
    />
  );
}

type GlobalLoaderIndicatorProps = {
  text: string;
};

function GlobalLoaderIndicator({ text }: GlobalLoaderIndicatorProps) {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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
  }, [rotation]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.card}>
      <View style={styles.spinnerWrapper}>
        <Animated.View style={[styles.spinnerRing, { transform: [{ rotate: spin }] }]} />
        <View style={styles.spinnerDot} />
      </View>
      {text ? <Text style={styles.text}>{text}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minWidth: 160,
    maxWidth: 260,
    paddingHorizontal: theme.spacing[5],
    paddingVertical: theme.spacing[4],
    borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.black,
    shadowOpacity: 0.2,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  spinnerWrapper: {
    width: 48,
    height: 48,
    marginBottom: theme.spacing[3],
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerRing: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 4,
    borderColor: theme.colors.gray200,
    borderTopColor: theme.colors.primary,
    borderRightColor: theme.colors.primaryLight,
  },
  spinnerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
  },
  text: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.gray700,
    textAlign: 'center',
  },
});
