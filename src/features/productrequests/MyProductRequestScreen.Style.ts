import { StyleSheet } from 'react-native';
import { theme } from '../../theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  body: {
    flex: 1,
    position: 'relative',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[3],
    paddingBottom: 100,
    flexGrow: 1,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    padding: theme.spacing[4],
    marginBottom: theme.spacing[4],
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  thumbWrap: {
    marginRight: theme.spacing[3],
  },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: theme.borderRadius.base,
    backgroundColor: theme.colors.gray100,
  },
  thumbPlaceholder: {
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    borderStyle: 'dashed',
  },
  cardBody: {
    flex: 1,
    minWidth: 0,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[1],
  },
  productName: {
    flex: 1,
    marginRight: theme.spacing[2],
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.black,
  },
  statusBadge: {
    borderRadius: theme.borderRadius.sm,
    paddingVertical: 3,
    paddingHorizontal: theme.spacing[2],
  },
  statusBadgeText: {
    fontSize: theme.typography.fontSize.xxs,
    fontWeight: theme.typography.fontWeight.bold,
    letterSpacing: 0.3,
  },
  metaText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.gray500,
    marginBottom: 2,
  },
  timestamp: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.gray500,
    marginTop: theme.spacing[1],
    alignSelf: 'flex-end',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.borderLight,
    marginVertical: theme.spacing[3],
  },
  remarksHeading: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.black,
    marginBottom: theme.spacing[2],
  },
  remarksBox: {
    backgroundColor: theme.colors.gray100,
    borderRadius: theme.borderRadius.base,
    padding: theme.spacing[3],
  },
  remarkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingVertical: theme.spacing[1],
  },
  remarkRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.borderLight,
    marginBottom: theme.spacing[1],
    paddingBottom: theme.spacing[2],
  },
  remarkBadge: {
    borderRadius: theme.borderRadius.sm,
    paddingVertical: 2,
    paddingHorizontal: theme.spacing[2],
    marginRight: theme.spacing[2],
    marginBottom: theme.spacing[1],
  },
  remarkBadgeText: {
    fontSize: theme.typography.fontSize.xxs,
    fontWeight: theme.typography.fontWeight.bold,
  },
  remarkText: {
    flex: 1,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.gray700,
  },
  remarkPlaceholder: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.gray500,
    fontStyle: 'italic',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: theme.spacing[10],
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.gray500,
  },
  fabOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingRight: theme.spacing[5],
    zIndex: 999,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4CAF50',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
  },
  fabInner: {
    width: 56,
    height: 56,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
