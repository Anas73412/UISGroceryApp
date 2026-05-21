import { StyleSheet } from 'react-native';
import { theme } from '../../theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  keyboardView: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[4],
    paddingBottom: theme.spacing[4],
  },
  photoUpload: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    backgroundColor: '#E8F6F8',
    paddingVertical: theme.spacing[8],
    paddingHorizontal: theme.spacing[4],
    alignItems: 'center',
    marginBottom: theme.spacing[5],
    overflow: 'hidden',
    minHeight: 160,
    justifyContent: 'center',
  },
  photoUploadFilled: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    borderStyle: 'solid',
  },
  photoPreview: {
    width: '100%',
    height: 200,
    borderRadius: theme.borderRadius.md - 2,
  },
  cameraIconWrap: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.full,
    backgroundColor: '#D4EEF2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing[3],
  },
  addPhotoText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary,
    marginBottom: theme.spacing[1],
  },
  addPhotoHint: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.gray500,
    textAlign: 'center',
    paddingHorizontal: theme.spacing[4],
    lineHeight: 20,
  },
  fieldBlock: {
    marginBottom: theme.spacing[4],
  },
  fieldLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.gray700,
    marginBottom: theme.spacing[2],
  },
  textInput: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.black,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
    paddingTop: theme.spacing[3],
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#E8F6F8',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing[4],
    marginBottom: theme.spacing[4],
  },
  infoIconWrap: {
    width: 28,
    height: 28,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing[3],
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing[1],
  },
  infoText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.gray600,
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[3],
    backgroundColor: theme.colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.borderLight,
  },
  sendButton: {
    width: '100%',
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    backgroundColor: theme.colors.primary,
  },
  sendButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing[4],
    paddingHorizontal: theme.spacing[4],
    columnGap: theme.spacing[2],
  },
  sendButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.white,
  },
  fieldError: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.error,
    marginTop: theme.spacing[1],
  },
});

export default styles;
