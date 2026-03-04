import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

const { primary } = theme.colors;

export const styles = StyleSheet.create({
  text: {
    color: primary,
    fontWeight: '600',
    fontSize: 14,
  },
});
