import { StyleSheet } from 'react-native';
import { theme } from '../../theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  headerWrap: {
    position: 'relative',
    backgroundColor: theme.colors.surface,
  },
  menuButton: {
    position: 'absolute',
    right: theme.spacing[4],
    top: theme.spacing[5],
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  body: {
    flex: 1,
    position: 'relative',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
    marginHorizontal: theme.spacing[4],
    marginTop: theme.spacing[3],
    marginBottom: theme.spacing[3],
  },
  searchIcon: {
    marginRight: theme.spacing[2],
  },
  searchInput: {
    flex: 1,
    fontSize: theme.typography.fontSize.sm,
    paddingVertical: theme.spacing[1],
    color: theme.colors.gray800,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: theme.spacing[4],
    paddingBottom: 100,
    flexGrow: 1,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    padding: theme.spacing[4],
    marginBottom: theme.spacing[4],
    overflow: 'hidden',
    position: 'relative',
  },
  cardWatermark: {
    position: 'absolute',
    right: -8,
    top: '35%',
    opacity: 0.08,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[3],
  },
  complainId: {
    flex: 1,
    marginRight: theme.spacing[2],
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
  },
  statusBadge: {
    borderRadius: theme.borderRadius.sm,
    paddingVertical: 4,
    paddingHorizontal: theme.spacing[2],
  },
  statusBadgeText: {
    fontSize: theme.typography.fontSize.xxs,
    fontWeight: theme.typography.fontWeight.bold,
    letterSpacing: 0.4,
  },
  gridRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing[3],
  },
  gridCol: {
    flex: 1,
    paddingRight: theme.spacing[2],
  },
  fieldLabel: {
    fontSize: theme.typography.fontSize.xxs,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.gray500,
    letterSpacing: 0.5,
    marginBottom: theme.spacing[1],
  },
  fieldValue: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.black,
  },
  descriptionBlock: {
    marginBottom: theme.spacing[3],
  },
  descriptionText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.gray700,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  metaCol: {
    flex: 1,
  },
  metaColRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  metaValue: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.gray500,
  },
  assigneeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 2,
  },
  assigneeAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing[1],
  },
  assigneeAvatarText: {
    fontSize: 9,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.white,
  },
  assigneeName: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.gray700,
    fontWeight: theme.typography.fontWeight.medium,
    flexShrink: 1,
    textAlign: 'right',
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
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: theme.colors.black,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
});

export default styles;
