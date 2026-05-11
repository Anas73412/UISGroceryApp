import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { SettingsStackParamList } from '../../../navigation/types';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../../../theme';
import styles from './SettingScreen.style';
import { useConfirmationDialog } from '../../../components/context/ConfirmationDialogContext';
import { useMessageDialog } from '../../../components/context/MessageDialogContext';
import { SettingController } from '../SettingController';
import { sessionStore } from '../../../store/sessionStore';
import { UserModel } from '../../../data/models/UserModel';
import { IMAGE_BASE_URL } from '../../../utils/constants';
type SettingOption = {
  id: string;
  icon: string;
  iconBg: string;
  label: string;
  isDestructive?: boolean;
};

const SETTING_OPTIONS: SettingOption[] = [
  {
    id: 'delivery',
    icon: 'home',
    iconBg: '#E8B86D',
    label: 'Add Delivery Address',
  },
  {
    id: 'about',
    icon: 'group',
    iconBg: '#5B9BD5',
    label: 'About Us',
  },
  {
    id: 'contact',
    icon: 'message',
    iconBg: '#F4C430',
    label: 'Contact Us',
  },
  {
    id: 'requests',
    icon: 'history',
    iconBg: '#9E7CC1',
    label: 'My Product Requests',
  },
  {
    id: 'logout',
    icon: 'logout',
    iconBg: '#E57373',
    label: 'Logout',
    isDestructive: true,
  },
];

type SettingsNav = NativeStackNavigationProp<
  SettingsStackParamList,
  'SettingsMain'
>;

export function SettingsScreen() {
  const navigation = useNavigation<SettingsNav>();
  const [user, setUser] = useState<UserModel | null>();
  const { showConfirm } = useConfirmationDialog();
  const { showErrorDialog } = useMessageDialog();
  const [imageUri, setImageUri] = useState('');
  const [isImageLoading, setIsImageLoading] = useState(true);
  useEffect(() => {
    const userDetails = sessionStore.getState().user;
    setUser(userDetails);
    const rawImage = userDetails?.profile ?? '';
    const uri = rawImage.startsWith('http')
      ? rawImage
      : rawImage
      ? `${IMAGE_BASE_URL}${rawImage}`
      : '';
    setImageUri(uri);
  });

  const handleOptionPress = (option: SettingOption) => {
    switch (option.id) {
      case 'about':
        navigation.navigate('AboutUs');
        break;
      case 'contact':
        navigation.navigate('ContactUs');
        break;
      case 'delivery':
        navigation.navigate('DeliveryAddress');
        break;
      case 'requests':
        showErrorDialog(
          'Coming soon',
          'My product requests will be available soon.',
        );
        break;
      case 'logout':
        showConfirm({
          title: 'Logout',
          message: 'Are you sure you want to logout?',
          confirmLabel: 'Logout',
          cancelLabel: 'Cancel',
          variant: 'info',
          icon: 'exclamation-triangle',
          onConfirm: () => {
            logout();
          },
          onCancel: () => {
            /* optional */
          },
        });
        break;
      default:
        break;
    }
  };

  const logout = async () => {
    const isCleared = await SettingController.logout();
    if (isCleared) {
      navigation
        .getParent()
        ?.getParent()
        ?.reset({
          index: 0,
          routes: [{ name: 'Auth' }],
        });
    } else {
      showErrorDialog('Logout Error', 'Failed to logout. Please try again');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header: back arrow + title only */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.getParent()?.navigate('HomeTab' as never)}
          style={styles.backButton}
          hitSlop={12}
        >
          <MaterialIcons
            name="arrow-back"
            size={24}
            color={theme.colors.primary}
          />
        </Pressable>
        <Text style={styles.headerTitle}>Setting</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile card */}
        <View style={styles.profileCard}>
          <View style={styles.activeBadge}>
            <Text style={styles.activeBadgeText}>Active</Text>
          </View>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarPlaceholder}>
              {imageUri ? (
                <>
                  <Image
                    source={{ uri: imageUri }}
                    style={styles.image}
                    resizeMode="contain"
                    onLoadStart={() => setIsImageLoading(true)}
                    onLoadEnd={() => setIsImageLoading(false)}
                  />
                  {isImageLoading && (
                    <View style={styles.loaderOverlay}>
                      <ActivityIndicator
                        size="small"
                        color={theme.colors.primary}
                      />
                    </View>
                  )}
                </>
              ) : (
                <View style={styles.placeholderImage} />
              )}
            </View>
          </View>
          <Text style={styles.profileName}>{user?.name ?? 'User'}</Text>
          <Text style={styles.profileContact}>{user?.mobile ?? ''}</Text>
        </View>

        {/* Settings options card */}
        <View style={styles.optionsCard}>
          {SETTING_OPTIONS.map((option, index) => (
            <View
              key={option.id}
              style={[
                styles.optionRowWrapper,
                index === SETTING_OPTIONS.length - 1 && styles.optionRowLast,
              ]}
            >
              {/* <Pressable
                style={({ pressed }) => [
                  styles.optionRow,
                  pressed && styles.optionRowPressed,
                ]}
              > */}
              <TouchableOpacity
                style={styles.optionRow}
                onPress={() => handleOptionPress(option)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.optionIconBox,
                    { backgroundColor: option.iconBg },
                  ]}
                >
                  <MaterialIcons
                    name={option.icon as never}
                    size={18}
                    color={theme.colors.white}
                  />
                </View>
                <Text
                  style={[
                    styles.optionLabel,
                    option.isDestructive && styles.optionLabelDestructive,
                  ]}
                >
                  {option.label}
                </Text>
                <MaterialIcons
                  name="chevron-right"
                  size={24}
                  color={theme.colors.gray400}
                />
                {/* </Pressable> */}
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <Text style={styles.version}>v1.1.11 (11)</Text>
      </ScrollView>
    </View>
  );
}
