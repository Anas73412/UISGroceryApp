import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export default StyleSheet.create({
  wrapper: {
    marginBottom: theme.spacing[4],
    gap: theme.spacing[3],
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[2],
    shadowColor: theme.colors.black,
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  servicePlanRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  servicePlanColumn: {
    flex: 1,
    paddingHorizontal: theme.spacing[2],
  },
  servicePlanDivider: {
    width: 1,
    borderLeftWidth: 1,
    borderStyle: 'dotted',
    borderColor: theme.colors.gray300,
    marginVertical: theme.spacing[1],
  },
  sectionLabel: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.normal,
    letterSpacing: 0.8,

    color: theme.colors.gray500,
    textTransform: 'uppercase',
    marginBottom: theme.spacing[2],
  },
  serviceValue: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.primary,
    marginBottom: theme.spacing[3],
  },
  planValue: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.gray800,
    marginBottom: theme.spacing[3],
  },
  detailsButton: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.gray100,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
  },
  detailsButtonText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.gray700,
  },
  connectionCard: {
    padding: theme.spacing[3],
  },
  connectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[2],
  },
  routerIconWrap: {
    width: 38,
    height: 38,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing[2],
  },
  connectionTitle: {
    flex: 1,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.gray800,
  },
  updateLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  updateText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.gray800,
  },
  horizontalDivider: {
    height: 1,
    backgroundColor: theme.colors.gray200,
    marginBottom: theme.spacing[2],
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing[2],
  },
  infoColumn: {
    flex: 1,
  },
  connectionLabel: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.normal,
    letterSpacing: 0.8,
    color: theme.colors.gray500,
    textTransform: 'uppercase',
    marginBottom: theme.spacing[1],
  },
  infoValue: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.gray800,
  },
  billedOnText: {
    marginTop: theme.spacing[1],
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.error,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing[2],
  },
  footerSpacer: {
    flex: 1,
  },
  overdueText: {
    flex: 1,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.error,
  },
  viewBillsButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.base,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
  },
  viewBillsButtonText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textOnPrimary,
  },
});
