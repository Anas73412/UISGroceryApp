import { StyleSheet } from 'react-native';
import { theme } from '../../theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
    paddingTop: theme.spacing[5],
    backgroundColor: theme.colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.borderLight,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -theme.spacing[1],
  },
  headerTitle: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: '600',
    color: theme.colors.primary,
  },
  headerRight: {
    width: 40,
  },
  listContent: {
    padding: theme.spacing[4],
    paddingBottom: theme.spacing[8],
  },
  addressCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    padding: theme.spacing[4],
    marginBottom: theme.spacing[3],
    shadowColor: theme.colors.black,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  selectedCard: {
    borderColor: theme.colors.primary,
    backgroundColor: '#f0fbfd',
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[2],
  },
  cardRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  chip: {
    backgroundColor: theme.colors.gray100,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
  },
  chipText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.gray700,
    fontWeight: '600',
  },
  defaultBadge: {
    backgroundColor: theme.colors.success,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
  },
  defaultBadgeText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.white,
    fontWeight: '600',
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  cardIconButton: {
    width: 34,
    height: 34,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.gray50,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  deleteIconButton: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  receiverName: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: '600',
    color: theme.colors.gray800,
    marginBottom: theme.spacing[1],
  },
  receiverMobile: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.gray600,
    marginBottom: theme.spacing[2],
  },
  fullAddress: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.gray700,
    lineHeight: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: theme.spacing[12],
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.gray500,
  },
  addAddressBtn: {
    marginTop: theme.spacing[4],
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing[3],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addAddressLabel: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: '700',
    color: theme.colors.textOnPrimary,
  },
  addAddressContainer: {
    paddingHorizontal: theme.spacing[6],
    paddingVertical: theme.spacing[2],
  },
});

export default styles;
