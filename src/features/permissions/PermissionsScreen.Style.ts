import { StyleSheet } from 'react-native';
import { theme } from '../../theme';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  headerIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.colors.gray50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.gray800,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.gray600,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  cardList: {
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.white,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.gray50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconWrapGranted: {
    backgroundColor: theme.colors.success,
  },
  cardContent: {
    flex: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.gray800,
  },
  cardBody: {
    fontSize: 13,
    lineHeight: 18,
    color: theme.colors.gray600,
    marginBottom: 10,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  allowBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
  },
  allowBtnDisabled: {
    opacity: 0.6,
  },
  allowBtnLabel: {
    color: theme.colors.white,
    fontWeight: '600',
    fontSize: 13,
  },
  statusGranted: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.success,
  },
  statusBlocked: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.error,
  },
  statusInfo: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.gray500,
  },
  unavailableNote: {
    fontSize: 12,
    color: theme.colors.gray500,
    fontStyle: 'italic',
  },
  footer: {
    paddingTop: 12,
    gap: 10,
  },
  continueBtn: {
    height: 52,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueBtnDisabled: {
    opacity: 0.6,
  },
  continueLabel: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.base,
    fontWeight: '700',
  },
  skipBtn: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipLabel: {
    color: theme.colors.gray600,
    fontSize: 14,
    fontWeight: '500',
  },
});
