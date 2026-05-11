import { StyleSheet } from 'react-native';
import { theme } from '../../theme';

const { primary, background } = theme.colors;

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: background,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    paddingVertical: 12,
    marginBottom: 8,
  },
  backButton: {
    padding: 8,
    marginLeft: 0,
  },
  backArrow: {
    fontSize: 24,
    color: theme.colors.black,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.black,

    left: 0,
    right: 0,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  container: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 14,
    color: theme.colors.primary,
  },
  welcomeSubtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.colors.black,
    marginTop: 4,
  },
  label: {
    fontSize: 14,
    color: theme.colors.black,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.gray700,
    marginTop: 8,
    marginBottom: 10,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.white,
  },
  typeChipSelected: {
    backgroundColor: theme.colors.primary,
  },
  typeChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  typeChipTextSelected: {
    color: theme.colors.white,
  },
  receiverSection: {
    marginTop: 8,
  },
  permBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.gray50,
    marginBottom: 16,
  },
  permIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  permContent: {
    flex: 1,
  },
  permTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.gray800,
    marginBottom: 4,
  },
  permBody: {
    fontSize: 13,
    lineHeight: 18,
    color: theme.colors.gray600,
    marginBottom: 10,
  },
  permActions: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  permPrimaryBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
  },
  permPrimaryBtnDisabled: {
    opacity: 0.6,
  },
  permPrimaryLabel: {
    color: theme.colors.white,
    fontWeight: '600',
    fontSize: 13,
  },
  permSecondaryBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.white,
  },
  permSecondaryLabel: {
    color: theme.colors.gray700,
    fontWeight: '600',
    fontSize: 13,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.gray700,
    marginBottom: 6,
    marginTop: 12,
  },
  addAddressContainer: {
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[2],
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
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: theme.spacing[4],
  },
  actionBtn: {
    flex: 1,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing[3],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  cancelBtn: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  submitBtn: {
    backgroundColor: theme.colors.primary,
  },
  actionLabel: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: '700',
  },
  cancelLabel: {
    color: theme.colors.primary,
  },
  submitLabel: {
    color: theme.colors.textOnPrimary,
  },
});
