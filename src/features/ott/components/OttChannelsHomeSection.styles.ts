import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export const styles = StyleSheet.create({
  section: {
    marginBottom: theme.spacing[5],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[3],
  },
  titleBlock: {
    flex: 1,
    paddingRight: theme.spacing[3],
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.gray800,
  },
  subtitle: {
    marginTop: 2,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.gray500,
  },
  viewAll: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.primary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '23.5%',
  },
});
