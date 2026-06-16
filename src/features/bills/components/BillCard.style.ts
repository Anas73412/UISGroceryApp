import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export default StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
    marginBottom: theme.spacing[2],
    shadowColor: theme.colors.black,
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[2],
  },
  invoiceBlock: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: theme.typography.fontSize.xxs,
    fontWeight: theme.typography.fontWeight.normal,
    letterSpacing: 0.4,
    color: theme.colors.gray500,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  invoiceNumber: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.gray800,
  },
  pdfButton: {
    padding: 2,
  },
  amountDateRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing[2],
  },
  amountDateColumn: {
    flex: 1,
  },
  amountValue: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.primary,
  },
  dateValue: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.gray800,
  },
  summaryBox: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: theme.colors.gray100,
    borderRadius: theme.borderRadius.base,
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[2],
    marginBottom: theme.spacing[2],
  },
  summaryColumn: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: theme.colors.gray300,
    marginHorizontal: theme.spacing[1],
  },
  summaryLabel: {
    fontSize: theme.typography.fontSize.xxs,
    color: theme.colors.gray500,
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.gray800,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing[1],
  },
  statusBadge: {
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing[2],
    paddingVertical: 2,
  },
  statusText: {
    fontSize: theme.typography.fontSize.xxs,
    fontWeight: theme.typography.fontWeight.semibold,
    letterSpacing: 0.2,
  },
  timestampRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  timestampText: {
    fontSize: theme.typography.fontSize.xxs,
    color: theme.colors.gray500,
    flexShrink: 1,
    textAlign: 'right',
  },
});
