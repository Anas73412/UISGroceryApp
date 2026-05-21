import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';
import { AppHeader } from '../../components/ui';
import { ImageSourcePickerSheet } from '../../components/ui/ImagePicker';
import { theme } from '../../theme';
import type { SettingsStackParamList } from '../../navigation/types';
import { useLoading } from '../../components/context/LoadingContext';
import { useMessageDialog } from '../../components/context/MessageDialogContext';
import { SUCCESS } from '../../utils/constants';
import { productRequestController } from './controller';
import styles from './NewProductRequestScreen.Style';
import { sessionStore } from '../../store/sessionStore';
import { PickImageAsset } from '../profile/service';

type Nav = NativeStackNavigationProp<
  SettingsStackParamList,
  'NewProductRequest'
>;

export function NewProductRequestScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { show, hide } = useLoading();
  const { showErrorDialog } = useMessageDialog();
  const [imageInfo, setImageInfo] = useState<PickImageAsset | null>(null);
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [errors, setErrors] = useState<{
    productName?: string;
    quantity?: string;
  }>({});

  const validate = (): boolean => {
    const next: typeof errors = {};
    if (!productName.trim()) {
      next.productName = 'Product name is required';
    }
    if (!quantity.trim()) {
      next.quantity = 'Quantity is required';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSendRequest = async () => {
    if (!validate()) return;

    show('Sending request...');
    try {
      const userId = (await sessionStore?.getState()?.user?.uid) ?? 0;
      const res = await productRequestController.submitProductRequest(
        {
          userId,
          productName: productName.trim(),
          quantity: quantity.trim(),
          description: description.trim() || undefined,
        },
        imageInfo ?? undefined,
      );

      if (res.status === SUCCESS) {
        Toast.show({
          type: 'success',
          text1: res.message || 'Request sent successfully',
        });
        navigation.goBack();
        return;
      }
      showErrorDialog(
        'Request failed',
        res.message || 'Could not send your product request.',
      );
    } catch {
      showErrorDialog(
        'Request failed',
        'Could not send your product request. Please try again.',
      );
    } finally {
      hide();
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader
        title="Request a Product"
        titleColor={theme.colors.primary}
        showNewsButton
        onNewsPress={() =>
          showErrorDialog('News', 'News will be available soon.')
        }
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Pressable
            onPress={() => setPickerOpen(true)}
            style={[
              styles.photoUpload,
              photoUri ? styles.photoUploadFilled : null,
            ]}
          >
            {photoUri ? (
              <Image
                source={{ uri: photoUri }}
                style={styles.photoPreview}
                resizeMode="cover"
              />
            ) : (
              <>
                <View style={styles.cameraIconWrap}>
                  <MaterialIcons
                    name="photo-camera"
                    size={28}
                    color={theme.colors.primary}
                  />
                </View>
                <Text style={styles.addPhotoText}>Add Photo</Text>
                <Text style={styles.addPhotoHint}>
                  Upload a clear photo of the product you're looking for
                </Text>
              </>
            )}
          </Pressable>

          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>Product Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter product name e.g., Green Apple"
              placeholderTextColor={theme.colors.gray400}
              value={productName}
              onChangeText={text => {
                setProductName(text);
                if (errors.productName) {
                  setErrors(prev => ({ ...prev, productName: undefined }));
                }
              }}
            />
            {errors.productName ? (
              <Text style={styles.fieldError}>{errors.productName}</Text>
            ) : null}
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>Quantity</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter quantity e.g., 2 kg, 1 packet"
              placeholderTextColor={theme.colors.gray400}
              value={quantity}
              onChangeText={text => {
                setQuantity(text);
                if (errors.quantity) {
                  setErrors(prev => ({ ...prev, quantity: undefined }));
                }
              }}
            />
            {errors.quantity ? (
              <Text style={styles.fieldError}>{errors.quantity}</Text>
            ) : null}
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>Add Description</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Add details like brand, size, packaging..."
              placeholderTextColor={theme.colors.gray400}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.infoBox}>
            <View style={styles.infoIconWrap}>
              <MaterialIcons
                name="info"
                size={18}
                color={theme.colors.textOnPrimary}
              />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Need help?</Text>
              <Text style={styles.infoText}>
                We'll notify you as soon as our team finds this product in our
                inventory or from verified partners.
              </Text>
            </View>
          </View>
        </ScrollView>

        <View
          style={[
            styles.footer,
            { paddingBottom: Math.max(insets.bottom, 16) },
          ]}
        >
          <TouchableOpacity
            style={styles.sendButton}
            activeOpacity={0.85}
            onPress={handleSendRequest}
            accessibilityRole="button"
            accessibilityLabel="Send request"
          >
            <View style={styles.sendButtonInner}>
              <Text style={styles.sendButtonText}>Send Request</Text>
              <MaterialIcons name="send" size={20} color={theme.colors.white} />
            </View>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <ImageSourcePickerSheet
        visible={pickerOpen}
        onRequestClose={() => setPickerOpen(false)}
        mode="single"
        title="Product photo"
        subtitle="Pick a photo from your gallery or take a new one."
        onPick={assets => {
          const first = assets[0];
          if (first) {
            setPhotoUri(first.uri);
            setImageInfo({
              uri: first.uri,
              fileName: first.fileName,
              type: first.type,
            });
          }
        }}
        onError={msg => Toast.show({ type: 'error', text1: msg })}
      />
    </View>
  );
}
