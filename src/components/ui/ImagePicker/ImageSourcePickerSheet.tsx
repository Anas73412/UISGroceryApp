import React, { useCallback, useMemo } from 'react';
import { Alert, Modal, View, Text, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { PhotoQuality } from 'react-native-image-picker';
import { theme } from '../../../theme';
import { Button } from '../Button';
import { ImageSourcePickerSheetProps } from './ImagePicker.types';
import { pickFromCamera, pickGallary } from './pickImage';
import { styles } from './ImageSourcePickerSheet.styles';

const DEFAULT_SUBTITLE = 'Choose how you would like to add your photo.';

const textAndroidTight: object =
  Platform.OS === 'android' ? { includeFontPadding: false } : {};

export function ImageSourcePickerSheet({
  visible,
  onRequestClose,
  onPick,
  mode = 'single',
  maxFiles = 10,
  title = 'Profile photo',
  subtitle = DEFAULT_SUBTITLE,
  quality = 0.8,
  maxWidth = 2048,
  maxHeight = 2048,
  onError,
}: ImageSourcePickerSheetProps) {
  const insets = useSafeAreaInsets();
  const q = useMemo(() => quality as PhotoQuality, [quality]);
  const bottomPadding = useMemo(
    () => Math.max(insets.bottom, theme.spacing[3]),
    [insets.bottom],
  );

  const runAfterSheetClose = useCallback(
    (task: () => void) => {
      onRequestClose();
      setTimeout(task, 260);
    },
    [onRequestClose],
  );

  const runGallery = useCallback(async () => {
    const { assets, errorMessage } = await pickGallary(
      mode,
      maxFiles,
      q,
      maxWidth,
      maxHeight,
    );
    if (errorMessage) {
      Alert.alert('Gallery error', errorMessage);
      onError?.(errorMessage);
    }
    onPick(assets);
  }, [mode, maxFiles, q, maxWidth, maxHeight, onPick, onError]);

  const runCamera = useCallback(async () => {
    const { assets, errorMessage } = await pickFromCamera(
      q,
      maxWidth,
      maxHeight,
    );
    if (errorMessage) {
      Alert.alert('Camera error', errorMessage);
      onError?.(errorMessage);
    }
    onPick(assets);
  }, [q, maxWidth, maxHeight, onPick, onError]);
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onRequestClose}
    >
      <View style={styles.overlay}>
        <Pressable
          style={styles.pressableAutofill}
          onPress={onRequestClose}
          accessibilityRole="button"
          accessibilityLabel="Close"
        />
        <View style={[styles.safeArea, { paddingBottom: bottomPadding }]}>
          <Pressable
            style={styles.panel}
            onPress={e => e.stopPropagation()}
            accessibilityRole="menu"
            accessibilityViewIsModal
          >
            <View style={styles.dragHandle} accessibilityElementsHidden />
            <View style={styles.headerRow}>
              <View style={styles.headerIconWrap}>
                <MaterialIcons
                  name="add-a-photo"
                  size={28}
                  color={theme.colors.primary}
                />
              </View>
              <View style={styles.headerTextCol}>
                <Text style={[styles.title, textAndroidTight]}>{title}</Text>
                <Text
                  style={[styles.subtitle, textAndroidTight]}
                  numberOfLines={3}
                >
                  {subtitle}
                </Text>
              </View>
            </View>

            <View style={styles.optionsBlock}>
              <Pressable
                style={({ pressed }) => [
                  styles.optionPressable,
                  pressed && styles.optionPressed,
                ]}
                onPress={() => runAfterSheetClose(() => void runGallery())}
                accessibilityRole="button"
                accessibilityLabel="Choose from gallery"
              >
                <View style={styles.optionCard}>
                  <View style={styles.optionIconGallery}>
                    <MaterialIcons
                      name="photo-library"
                      size={26}
                      color={theme.colors.primary}
                    />
                  </View>
                  <View style={styles.optionTextCol}>
                    <Text style={[styles.optionTitle, textAndroidTight]}>
                      Gallery
                    </Text>
                    <Text
                      style={[styles.optionSub, textAndroidTight]}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      Browse photos you already have
                    </Text>
                  </View>
                  <Text style={styles.optionChevronText} accessible={false}>
                    ›
                  </Text>
                </View>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.optionPressable,
                  styles.optionLast,
                  pressed && styles.optionPressed,
                ]}
                onPress={() => runAfterSheetClose(() => void runCamera())}
                accessibilityRole="button"
                accessibilityLabel="Open camera"
              >
                <View style={styles.optionCard}>
                  <View style={styles.optionIconCamera}>
                    <MaterialIcons
                      name="photo-camera"
                      size={26}
                      color={theme.colors.secondary}
                    />
                  </View>
                  <View style={styles.optionTextCol}>
                    <Text style={[styles.optionTitle, textAndroidTight]}>
                      Camera
                    </Text>
                    <Text
                      style={[styles.optionSub, textAndroidTight]}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      Take a new picture now
                    </Text>
                  </View>
                  <Text style={styles.optionChevronText} accessible={false}>
                    ›
                  </Text>
                </View>
              </Pressable>
            </View>

            <View style={styles.cancelWrap}>
              <Button
                title="Cancel"
                variant="outline"
                onPress={onRequestClose}
                containerStyle={styles.cancelButton}
                accessibilityLabel="Cancel"
              />
            </View>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
