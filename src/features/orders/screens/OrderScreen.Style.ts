import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.borderLight,
    paddingHorizontal: theme.spacing[2],
  },
  tabPress: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing[3],
  },
  tabLabel: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  tabLabelActive: {
    color: theme.colors.primary,
  },
  tabLabelInactive: {
    color: theme.colors.gray500,
  },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    width: '70%',
    borderRadius: 2,
    backgroundColor: theme.colors.primary,
  },
  listContent: {
    padding: theme.spacing[4],
    paddingBottom: theme.spacing[8],
    flexGrow: 1,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    padding: theme.spacing[4],
    marginBottom: theme.spacing[4],
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[1],
  },
  orderIdText: {
    flex: 1,
    marginRight: theme.spacing[2],
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.black,
  },
  badge: {
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing[1],
    paddingHorizontal: theme.spacing[2],
  },
  badgeText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    letterSpacing: 0.5,
  },
  dateText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    color: '#757575',
    marginBottom: theme.spacing[1],
  },
  detailText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.gray600,
    marginBottom: theme.spacing[3],
  },
  thumbRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[4],
  },
  thumbWrap: {
    marginRight: theme.spacing[2],
  },
  thumb: {
    width: 52,
    height: 52,
    borderRadius: theme.borderRadius.base,
    backgroundColor: theme.colors.gray100,
  },
  thumbPlaceholder: {
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    borderStyle: 'dashed',
  },
  moreBox: {
    width: 52,
    height: 52,
    borderRadius: theme.borderRadius.base,
    borderWidth: 1,
    borderColor: theme.colors.gray300,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.gray50,
  },
  moreText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.gray600,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.black,
  },
  actionBtn: {
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[5],
    borderRadius: theme.borderRadius.lg,
    minWidth: 112,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnSolid: {
    backgroundColor: theme.colors.primary,
  },
  actionBtnMuted: {
    backgroundColor: '#D6EEF2',
  },
  actionBtnText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.white,
  },
  actionBtnTextMuted: {
    color: theme.colors.primary,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: theme.spacing[10],
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.gray500,
  },
});

export default styles;
