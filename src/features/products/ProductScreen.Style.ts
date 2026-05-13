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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
    marginHorizontal: theme.spacing[4],
    marginTop: theme.spacing[4],
    marginBottom: theme.spacing[4],
    shadowColor: theme.colors.black,
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.typography.fontSize.sm,
    paddingVertical: theme.spacing[1],
    color: theme.colors.gray800,
  },

  categoryRow: {
    justifyContent: 'space-between',
    marginBottom: theme.spacing[4],
  },
  categoryColumn: {
    flex: 1,
    marginHorizontal: theme.spacing[2],
    alignItems: 'center',
  },
  loadingContainer: {
    paddingVertical: theme.spacing[10],
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.gray500,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  productColumn: {
    flex: 1,
    marginHorizontal: theme.spacing[1],
  },
  listContent: {
    paddingBottom: theme.spacing[6],
    paddingTop: theme.spacing[2],
  },
  loadingFooter: {
    paddingVertical: theme.spacing[6],
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
});

export default styles;
