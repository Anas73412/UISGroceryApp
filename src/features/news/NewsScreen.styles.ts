import { StyleSheet } from 'react-native';
import { theme } from '../../theme';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.backgroundSecondary },
  list: { flex: 1 },
  content: { padding: theme.spacing[4], paddingBottom: theme.spacing[8] },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing[3],
    overflow: 'hidden',
    elevation: 2,
  },
  cardBody: { padding: theme.spacing[4] },
  image: { width: '100%', height: 150, backgroundColor: theme.colors.gray100 },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start' },
  title: {
    flex: 1,
    color: theme.colors.gray800,
    fontSize: 17,
    fontWeight: '700',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
    marginLeft: theme.spacing[2],
    marginTop: 5,
  },
  preview: {
    color: theme.colors.gray600,
    marginTop: theme.spacing[2],
    lineHeight: 20,
  },
  date: {
    color: theme.colors.gray500,
    marginTop: theme.spacing[3],
    fontSize: 12,
  },
  empty: { textAlign: 'center', color: theme.colors.gray500, marginTop: 80 },
  error: {
    textAlign: 'center',
    color: theme.colors.error,
    marginTop: 60,
    paddingHorizontal: 24,
  },
  retry: {
    color: theme.colors.primary,
    textAlign: 'center',
    marginTop: 16,
    fontWeight: '700',
  },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
