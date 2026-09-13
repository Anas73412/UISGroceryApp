import { StyleSheet } from 'react-native';
import { theme } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  list: { flex: 1 },
  content: {
    paddingHorizontal: theme.spacing[4],
    paddingBottom: theme.spacing[10],
  },
  hero: {
    marginTop: theme.spacing[2],
    marginBottom: theme.spacing[4],
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
    backgroundColor: '#E8F6F7',
    borderWidth: 1,
    borderColor: '#C5E8EC',
  },
  heroTitle: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.secondary,
  },
  heroSubtitle: {
    marginTop: theme.spacing[1],
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.gray600,
    lineHeight: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: theme.spacing[3],
  },
  gridItem: {
    width: '48%',
  },
  empty: {
    textAlign: 'center',
    color: theme.colors.gray500,
    marginTop: 80,
    fontSize: theme.typography.fontSize.base,
  },
  stateWrap: {
    paddingHorizontal: theme.spacing[6],
  },
  error: {
    textAlign: 'center',
    color: theme.colors.error,
    marginTop: 60,
  },
  retry: {
    color: theme.colors.primary,
    textAlign: 'center',
    marginTop: 16,
    fontWeight: '700',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
