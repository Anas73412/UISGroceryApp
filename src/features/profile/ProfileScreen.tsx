import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../../theme';
import { sessionStore } from '../../store/sessionStore';
import { cartStore } from '../../store/cartStore';
import { profileController } from './controller';
import { Button, Input } from '../../components/ui';
import styles from './ProfileScreen.Style';
import { IMAGE_BASE_URL } from '../../utils/constants';
import { ImageSourcePickerSheet } from '../../components/ui/ImagePicker';
import Toast from 'react-native-toast-message';

export function ProfileScreen() {
  const navigation = useNavigation();
  const user = sessionStore(s => s.user);
  const cartCount = cartStore(s => s.items.length);

  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [localUri, setLocalUri] = useState<string | null>(null);
  const [billingAddress, setBillingAddress] = useState(user?.address ?? '');
  const [correspondenceAddress, setCorrespondenceAddress] = useState('');

  useEffect(() => {
    const u = sessionStore.getState().user;
    if (u) {
      setName(u.name ?? '');
      setBillingAddress(u.address ?? '');
    }
  }, [user?.uid]);

  const handleUpdate = async () => {
    await profileController.updateProfile({
      name,
      address: billingAddress,
    });
  };

  const handleCartPress = () => {
    setPickerOpen(true);
    // navigation.navigate('CartTab' as never);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable
            onPress={() => navigation.navigate('HomeTab' as never)}
            style={styles.backButton}
            hitSlop={12}
          >
            <MaterialIcons
              name="arrow-back"
              size={24}
              color={theme.colors.primary}
            />
          </Pressable>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        <View style={styles.headerRight}>
          <Pressable style={styles.newsBadge}>
            <Text style={styles.newsBadgeText}>NEWS</Text>
          </Pressable>
          <Pressable style={styles.cartButton} onPress={handleCartPress}>
            <MaterialIcons
              name="shopping-cart"
              size={24}
              color={theme.colors.primary}
            />
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>
                  {cartCount > 99 ? '99+' : cartCount}
                </Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Info Card */}
        <ImageSourcePickerSheet
          visible={pickerOpen}
          onRequestClose={() => setPickerOpen(false)}
          mode="single"
          onPick={assets => {
            if (assets[0]) setLocalUri(assets[0].uri);
            console.log('Picked image:', assets[0].uri);
          }}
          onError={msg => Toast.show({ type: 'error', text1: msg })}
        />
        <View style={[styles.card, styles.userCard]}>
          <View style={styles.avatarContainer}>
            {user?.profile ? (
              <Image
                source={{ uri: IMAGE_BASE_URL + user.profile }}
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
            <Pressable style={styles.avatarCameraButton}>
              <MaterialIcons
                name="camera-alt"
                size={14}
                color={theme.colors.primary}
              />
            </Pressable>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name ?? 'Anas Mansoori'}</Text>
            <Text style={styles.userPhone}>{user?.mobile ?? '7619983037'}</Text>
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
          <View style={styles.documentsEmpty}>
            <Text style={styles.documentsEmptyText}>
              No documents uploaded yet.
            </Text>
          </View>
        </View>

        {/* Version */}
        <Text style={styles.versionText}>v1.1.11 (11)</Text>
      </ScrollView>
    </View>
  );
}
