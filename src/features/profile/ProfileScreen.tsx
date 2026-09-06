import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Image,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../../theme';
import { sessionStore } from '../../store/sessionStore';
import { AppHeader } from '../../components/ui';
import { profileController } from './controller';
import { Button, Input } from '../../components/ui';
import styles from './ProfileScreen.Style';
import { IMAGE_BASE_URL, SUCCESS } from '../../utils/constants';
import { ImageSourcePickerSheet } from '../../components/ui/ImagePicker';
import Toast from 'react-native-toast-message';
import { UserResponseModel } from '../../data/models/UserModel';
import { useLoading } from '../../components/context/LoadingContext';

export function ProfileScreen() {
  const navigation = useNavigation();
  const [user, setUser] = useState<UserResponseModel | null>(null);
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [localUri, setLocalUri] = useState<string | null>(null);
  const [billingAddress, setBillingAddress] = useState(user?.Address ?? '');
  const [correspondenceAddress, setCorrespondenceAddress] = useState(
    user?.billing_address ?? '',
  );
  const { show, hide } = useLoading();
  const [adhaarFront, setAdhaarFront] = useState<string | null>(null);
  const [adhaarBack, setAdhaarBack] = useState<string | null>(null);

  const [isUploading, setIsUploading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      getProfileDetails();
    }, []),
  );

  const handleUpdate = async () => {
    show('Updating...');
    const res = await profileController.updateProfile({
      name: name,
      Address: billingAddress,
      billing_address: correspondenceAddress,
      email: email,
      mobile: user?.mobile ?? undefined,
    });

    hide();
    if (res.status === SUCCESS) {
      Toast.show({
        type: 'success',
        text1: res.message || 'Profile updated successfully',
      });
    } else {
      Toast.show({
        type: 'error',
        text1: res.message || 'Failed to update profile',
      });
    }
  };

  const getProfileDetails = async () => {
    show('Fetching...');
    const res = await profileController.fetchUserProfile();
    if (res != null && res.status === SUCCESS && res.data) {
      setUser(res.data);
      setName(res.data.name ?? '');
      setEmail(res.data.email ?? '');
      setBillingAddress(res.data.Address ?? '');
      setCorrespondenceAddress(res.data.billing_address ?? '');
      setAdhaarFront(
        res.data.adhaar_front ? IMAGE_BASE_URL + res.data.adhaar_front : null,
      );
      setAdhaarBack(
        res.data.adhaar_back ? IMAGE_BASE_URL + res.data.adhaar_back : null,
      );
    }
    hide();
  };

  const handleImageUpload = async (asset: {
    uri: string;
    type?: string;
    fileName?: string;
  }) => {
    try {
      setIsUploading(true);
      setLocalUri(asset.uri);
      const res = await profileController.uploadProfilePic(asset);
      if (res.status === SUCCESS) {
        Toast.show({
          type: 'success',
          text1: res.message || 'Profile picture updated successfully',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: res.message || 'Failed to update profile picture',
        });
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1:
          error?.message ||
          'An error occurred while uploading the profile picture',
      });
    } finally {
      setIsUploading(false);
    }
  };
  return (
    <View style={styles.container}>
      <AppHeader
        title="Profile"
        onBackPress={() => navigation.navigate('HomeTab' as never)}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Info Card */}
        <View style={[styles.card, styles.userCard]}>
          <View style={styles.avatarContainer}>
            {localUri != null || user?.profile ? (
              <Image
                source={{
                  uri:
                    localUri ??
                    (user?.profile ? IMAGE_BASE_URL + user.profile : ''),
                }}
                style={styles.avatar}
              />
            ) : (
              <View
                style={[
                  styles.avatar,
                  { alignItems: 'center', justifyContent: 'center' },
                ]}
              >
                <MaterialIcons
                  name="person"
                  size={40}
                  color={theme.colors.gray400}
                />
              </View>
            )}
            <Pressable
              style={styles.avatarCameraButton}
              onPress={() => {
                setPickerOpen(true);
              }}
              hitSlop={8}
            >
              <MaterialIcons
                name="camera-alt"
                size={14}
                color={theme.colors.primary}
              />
            </Pressable>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name ?? ''}</Text>
            <Text style={styles.userPhone}>{user?.mobile ?? ''}</Text>
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>Active</Text>
            </View>
          </View>
        </View>

        {/* Personal Details Card */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <MaterialIcons
                name="person-outline"
                size={22}
                color={theme.colors.secondary}
              />
            </View>
            <Text style={styles.sectionTitle}>Personal Details</Text>
          </View>

          <Input
            label="Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            containerStyle={{ marginBottom: 16 }}
          />
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="anas@gmail.com"
            keyboardType="email-address"
            containerStyle={{ marginBottom: 16 }}
          />
          <Input
            label="Billing Address"
            value={billingAddress}
            onChangeText={setBillingAddress}
            placeholder="Enter billing address"
            multiline
            numberOfLines={3}
            containerStyle={{ marginBottom: 16 }}
          />
          <Input
            label="Correspondence Address"
            value={correspondenceAddress}
            onChangeText={setCorrespondenceAddress}
            placeholder="Enter correspondence address"
            multiline
            numberOfLines={3}
            containerStyle={{ marginBottom: 0 }}
          />
          <Button
            title="Update"
            onPress={handleUpdate}
            containerStyle={styles.updateButton}
          />
        </View>

        {/* Documents Card */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <MaterialIcons
                name="description"
                size={22}
                color={theme.colors.secondary}
              />
            </View>
            <Text style={styles.sectionTitle}>Documents</Text>
          </View>
          <View style={styles.documentsRow}>
            <View style={styles.documentCard}>
              <View style={styles.documentImageWrap}>
                {adhaarFront ? (
                  <Image
                    source={{ uri: adhaarFront }}
                    style={styles.documentImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.documentPlaceholder}>
                    <MaterialIcons
                      name="badge"
                      size={36}
                      color={theme.colors.gray400}
                    />
                  </View>
                )}
              </View>
              <Text style={styles.documentTitle}>Aadhaar (Front)</Text>
            </View>
            <View style={styles.documentCard}>
              <View style={styles.documentImageWrap}>
                {adhaarBack ? (
                  <Image
                    source={{ uri: adhaarBack }}
                    style={styles.documentImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.documentPlaceholder}>
                    <MaterialIcons
                      name="badge"
                      size={36}
                      color={theme.colors.gray400}
                    />
                  </View>
                )}
              </View>
              <Text style={styles.documentTitle}>Aadhaar (Back)</Text>
            </View>
          </View>
        </View>

        {/* Version */}
        <Text style={styles.versionText}>v1.1.11 (11)</Text>
      </ScrollView>

      <ImageSourcePickerSheet
        visible={pickerOpen}
        onRequestClose={() => setPickerOpen(false)}
        mode="single"
        title="Update profile picture"
        subtitle="Pick a photo you already have, or take a new one with the camera."
        onPick={assets => {
          const first = assets[0];
          if (first) {
            handleImageUpload(first);
          }
        }}
        onError={msg => Toast.show({ type: 'error', text1: msg })}
      />
    </View>
  );
}
