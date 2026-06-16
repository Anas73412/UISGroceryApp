import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing[5],
    paddingBottom: theme.spacing[6],
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing[6],
    paddingHorizontal: theme.spacing[5],
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  gif: {
    width: 220,
    height: 220,
    marginBottom: theme.spacing[4],
  },
  title: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.error,
    textAlign: 'center',
    marginBottom: theme.spacing[2],
  },
  message: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.gray600,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: theme.spacing[5],
  },
  countdownBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.gray50,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
    marginBottom: theme.spacing[5],
    width: '100%',
    justifyContent: 'center',
    gap: theme.spacing[2],
  },
  countdownText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  buttonWrap: {
    width: '100%',
  },
  hint: {
    marginTop: theme.spacing[4],
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.gray500,
    textAlign: 'center',
  },
});

export default styles;
