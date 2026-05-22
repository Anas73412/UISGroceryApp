import { Dimensions, StyleSheet } from 'react-native';
import { theme } from '../../../theme';

const SCREEN_WIDTH = Dimensions.get('window').width;

export const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    marginBottom: theme.spacing[4],
  },
  indicatorRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing[1],
    marginTop: theme.spacing[2],
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.gray300,
  },
  dotActive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  },
});
