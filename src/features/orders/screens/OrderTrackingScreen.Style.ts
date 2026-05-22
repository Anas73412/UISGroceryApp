import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[3],
    paddingBottom: theme.spacing[12],
  },
  mapCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    overflow: 'hidden',
    marginBottom: theme.spacing[4],
    minHeight: 200,
  },
  mapInner: {
    flex: 1,
    minHeight: 200,
    backgroundColor: '#E8F4F6',
    padding: theme.spacing[4],
    justifyContent: 'center',
  },
  mapRoad: {
    position: 'absolute',
    left: theme.spacing[6],
    right: theme.spacing[6],
    top: '45%',
    height: 4,
    backgroundColor: theme.colors.gray200,
    borderRadius: 2,
  },
  mapMarkersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: theme.spacing[2],
    zIndex: 1,
  },
  markerCol: {
    alignItems: 'center',
    maxWidth: '42%',
  },
  markerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[3],
    borderRadius: theme.borderRadius.full,
    gap: theme.spacing[1],
  },
  markerPillRider: {
    backgroundColor: theme.colors.primaryLightBG,
  },
  markerPillHome: {
    backgroundColor: theme.colors.secondary,
  },
  markerTag: {
    marginTop: theme.spacing[1],
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing[2],
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  markerTagText: {
    fontSize: 10,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
  },
  summaryBlock: {
    marginBottom: theme.spacing[5],
  },
  summaryStatus: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    letterSpacing: 0.8,
    marginBottom: theme.spacing[1],
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryEta: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.gray800,
    flex: 1,
  },
  distancePill: {
    backgroundColor: '#E3F2FD',
    paddingVertical: theme.spacing[1],
    paddingHorizontal: theme.spacing[3],
    borderRadius: theme.borderRadius.full,
  },
  distanceText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    color: '#1565C0',
  },
  timelineCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    padding: theme.spacing[4],
    marginBottom: theme.spacing[4],
  },
  stepRow: {
    flexDirection: 'row',
    minHeight: 72,
  },
  stepRail: {
    width: 32,
    alignItems: 'center',
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotDone: {
    backgroundColor: theme.colors.success,
  },
  stepDotActive: {
    backgroundColor: theme.colors.primary,
  },
  stepDotPending: {
    backgroundColor: theme.colors.gray200,
  },
  stepLine: {
    width: 2,
    flex: 1,
    minHeight: 24,
    marginVertical: 4,
  },
  stepLineDone: {
    backgroundColor: theme.colors.success,
  },
  stepLinePending: {
    backgroundColor: theme.colors.gray200,
  },
  stepBody: {
    flex: 1,
    paddingLeft: theme.spacing[3],
    paddingBottom: theme.spacing[4],
  },
  stepTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.gray700,
  },
  stepTitleActive: {
    color: theme.colors.primary,
  },
  stepTitlePending: {
    color: theme.colors.gray400,
  },
  stepSubtitle: {
    marginTop: 4,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.gray500,
    lineHeight: 20,
  },
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    padding: theme.spacing[4],
    marginBottom: theme.spacing[6],
    shadowColor: theme.colors.black,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  driverAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: theme.colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing[3],
  },
  driverInfo: {
    flex: 1,
    minWidth: 0,
  },
  driverNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
    flexWrap: 'wrap',
  },
  driverName: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.gray800,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: theme.spacing[2],
    paddingVertical: 2,
    borderRadius: theme.borderRadius.full,
    gap: 2,
  },
  ratingText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.gray700,
  },
  driverVehicle: {
    marginTop: 4,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.gray500,
  },
  driverActions: {
    flexDirection: 'row',
    gap: theme.spacing[2],
  },
  actionCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionCircleMuted: {
    backgroundColor: theme.colors.gray100,
  },
  actionCirclePrimary: {
    backgroundColor: theme.colors.primary,
  },
  footer: {
    paddingHorizontal: theme.spacing[4],
    paddingBottom: theme.spacing[6],
    paddingTop: theme.spacing[2],
    backgroundColor: theme.colors.backgroundSecondary,
  },
});

export default styles;
