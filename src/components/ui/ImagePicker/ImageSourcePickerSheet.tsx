import { useCallback } from 'react';
import { ImageSourcePickerSheetProps } from './ImagePicker.types';
import { pickFromCamera, pickGallary } from './pickImage';
import { PhotoQuality } from 'react-native-image-picker';
import { theme } from '../../../theme';
import { Modal, Pressable, StyleSheet, Text } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
export function ImageSourcePickerSheet({
  visible,
  onRequestClose,
  onPick,
  mode = 'single',
  maxFiles = 10,
  title = 'Choose Photo',
  quality = 0.8 as PhotoQuality,
  maxWidth = 2048,
  maxHeight = 2048,
  onError,
}: ImageSourcePickerSheetProps) {
  const runGallery = useCallback(async () => {
    onRequestClose();
    const { assets, errorMessage } = await pickGallary(
      mode,
      maxFiles,
      0.8,
      maxWidth,
      maxHeight,
    );
    if (errorMessage) onError?.(errorMessage);
    onPick(assets);
  }, [
    mode,
    maxFiles,
    quality,
    maxWidth,
    maxHeight,
    onPick,
    onRequestClose,
    onError,
  ]);
  const runCamera = useCallback(async () => {
    onRequestClose();
    const { assets, errorMessage } = await pickFromCamera(
      0.8,
      maxWidth,
      maxHeight,
    );
    if (errorMessage) onError?.(errorMessage);
    onPick(assets);
  }, [quality, maxWidth, maxHeight, onPick, onRequestClose, onError]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onRequestClose}
    >
      <Pressable style={styles.overlay} onPress={onRequestClose}>
        <Pressable
          style={styles.card}
          onPress={e => e.stopPropagation()}
          accessibilityRole="menu"
        >
          <Text style={styles.title}>{title}</Text>
          <Pressable style={styles.row} onPress={runGallery}>
            <MaterialIcons
              name="photo-library"
              size={24}
              color={theme.colors.primary}
            />
            <Text style={styles.rowLabel}>Gallery</Text>
            <MaterialIcons
              name="chevron-right"
              size={22}
              color={theme.colors.gray400}
            />
          </Pressable>
          <Pressable style={styles.row} onPress={runCamera}>
            <MaterialIcons
              name="photo-camera"
              size={24}
              color={theme.colors.primary}
            />
            <Text style={styles.rowLabel}>Camera</Text>
            <MaterialIcons
              name="chevron-right"
              size={22}
              color={theme.colors.gray400}
            />
          </Pressable>
          <Pressable style={styles.cancelBtn} onPress={onRequestClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    padding: theme.spacing[4],
    paddingBottom: theme.spacing[6],
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing[2],
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.gray500,
    textAlign: 'center',
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing[4],
    paddingHorizontal: theme.spacing[4],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.gray200,
  },
  rowLabel: {
    flex: 1,
    marginLeft: theme.spacing[3],
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.gray800,
    fontWeight: '500',
  },
  cancelBtn: {
    marginTop: theme.spacing[2],
    paddingVertical: theme.spacing[4],
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.gray200,
  },
  cancelText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.primary,
    fontWeight: '600',
  },
});
