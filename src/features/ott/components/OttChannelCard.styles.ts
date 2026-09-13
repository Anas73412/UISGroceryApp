import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[3],
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  cardCompact: {
    width: '100%',
    flex: 0,
    padding: theme.spacing[2],
    marginRight: 0,
  },
  cardPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  imageWrap: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: theme.borderRadius.md,
    backgroundColor: '#F0F8F9',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: theme.spacing[2],
  },
  imageWrapCompact: {
    marginBottom: theme.spacing[1],
  },
  image: {
    width: '78%',
    height: '78%',
  },
  name: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.gray800,
    textAlign: 'center',
    lineHeight: 18,
  },
  nameCompact: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.secondary,
    lineHeight: 15,
  },
});
