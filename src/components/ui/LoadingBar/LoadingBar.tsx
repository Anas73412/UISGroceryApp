import React from 'react';
import { View, type ViewStyle } from 'react-native';
import { theme } from '../../../theme';

export type LoadingBarProps = {
  /** Whether to show the loading bar */
  visible?: boolean;
  /** Overall height of the bar */
  height?: number;
  /** Corner radius */
  borderRadius?: number;
  /** Optional style override for the outer container (full width by default) */
  containerStyle?: ViewStyle;
};

export function LoadingBar({
  visible = true,
  height = 4,
  borderRadius = 999,
  containerStyle,
}: LoadingBarProps) {
  if (!visible) {
    return null;
  }

  const { primaryLight, primaryDark, surface } = theme.colors;

  const outer: ViewStyle = {
    width: '100%',
    backgroundColor: surface,
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

