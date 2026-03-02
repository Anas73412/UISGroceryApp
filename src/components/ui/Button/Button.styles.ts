import { StyleSheet } from 'react-native';
import { appTheme } from '../../../theme';

const { primary, secondary } = appTheme;

export const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: primary,
  },
  secondary: {
    backgroundColor: secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: primary,
  },
  primaryText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  secondaryText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  outlineText: {
    color: primary,
    fontWeight: '700',
    fontSize: 16,
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {},
  pressed: {
    opacity: 0.9,
  },
});
