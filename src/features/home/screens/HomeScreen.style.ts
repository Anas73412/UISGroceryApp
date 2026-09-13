import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';
import {
  SCREEN_WIDTH,
  SLIDER_ITEM_WIDTH,
  SLIDER_PEEK,
} from '../../../utils/constants';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing[4],
  },
  listContent: {
    paddingBottom: theme.spacing[6],
    paddingTop: theme.spacing[4],
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[4],
    gap: theme.spacing[3],
  },
  addressSection: {
    flex: 1,
    minWidth: 0,
  },
  deliveryLabel: {
    fontSize: theme.typography.fontSize.xs,
    letterSpacing: 1,
    color: theme.colors.gray500,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing[1],
  },
  locationIcon: {
    marginRight: theme.spacing[2],
  },
  locationText: {
    flex: 1,
    minWidth: 0,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.gray800,
  },
  locationChevron: {
    marginLeft: theme.spacing[2],
  },
  bellButton: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.black,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  bellIcon: {
    color: theme.colors.gray800,
  },
  newsBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: theme.colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  newsBadgeText: {
    color: theme.colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
    shadowColor: theme.colors.black,
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
    marginBottom: theme.spacing[4],
  },
  searchInput: {
    flex: 1,
    fontSize: theme.typography.fontSize.sm,
    paddingVertical: theme.spacing[1],
    color: theme.colors.gray800,
  },
  filterButton: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.spacing[2],
  },
  filterIcon: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textOnPrimary,
  },
  banner: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,

    marginBottom: theme.spacing[5],
  },
  bannerContent: {
    maxWidth: '90%',
  },
  bannerLabel: {
    fontSize: theme.typography.fontSize.xs,
    letterSpacing: 1,
    color: theme.colors.gray200,
    marginBottom: theme.spacing[1],
  },
  bannerTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.white,
    marginBottom: theme.spacing[1],
  },
  bannerCode: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.gray200,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[3],
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.gray800,
  },
  viewAllText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.primary,
  },
  hotPill: {
    marginLeft: theme.spacing[2],
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.warning,
  },
  hotPillText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.white,
  },
  categoriesList: {
    paddingVertical: theme.spacing[1],
    marginBottom: theme.spacing[5],
  },
  productRow: {
    justifyContent: 'space-between',
  },
  productColumn: {
    flex: 1,
    marginHorizontal: theme.spacing[1],
  },

  sliderContainer: {
    marginHorizontal: -theme.spacing[4], // Break out of container padding
    width: SCREEN_WIDTH,
    marginBottom: theme.spacing[4],
  },
  sliderList: {
    paddingLeft: 0, // Start from screen edge
    paddingRight: SLIDER_PEEK,
  },
  sliderItem: {
    width: SLIDER_ITEM_WIDTH,
    height: 160,
    marginRight: theme.spacing[2],
  },
  sliderIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing[1],
    marginTop: theme.spacing[2],
  },
  sliderDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.gray300,
  },
  sliderDotActive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  },
  loadingFooter: {
    paddingVertical: theme.spacing[6],
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
});

export default styles;
