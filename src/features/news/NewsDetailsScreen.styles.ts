import { StyleSheet } from 'react-native';
import { theme } from '../../theme';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.backgroundSecondary },
  content: { padding: theme.spacing[4], paddingBottom: theme.spacing[8] },
  image: {
    width: '100%',
    height: 220,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.gray100,
    marginBottom: theme.spacing[5],
  },
  title: { color: theme.colors.gray800, fontSize: 24, fontWeight: '700' },
  audience: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '700',
    marginTop: theme.spacing[3],
  },
  date: { color: theme.colors.gray500, marginTop: theme.spacing[2] },
  message: {
    color: theme.colors.gray700,
    fontSize: 16,
    lineHeight: 25,
    marginTop: theme.spacing[5],
  },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  error: {
    color: theme.colors.error,
    textAlign: 'center',
    marginTop: 80,
    paddingHorizontal: 24,
  },
});
