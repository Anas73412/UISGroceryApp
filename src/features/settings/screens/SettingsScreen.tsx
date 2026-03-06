import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../../../theme';
import styles from './SettingScreen.style';
import { useConfirmationDialog } from '../../../components/context/ConfirmationDialogContext';
import { useMessageDialog } from '../../../components/context/MessageDialogContext';
import { SettingController } from '../SettingController';
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

export function SettingsScreen() {
  const navigation = useNavigation();
  const { showConfirm } = useConfirmationDialog();
  const { showErrorDialog } = useMessageDialog();

  const handleOptionPress = (option: SettingOption) => {
    switch (option.id) {
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
    }
  };

  const logout = async () => {
    console.log('onLogotu');
    const isCleared = await SettingController.logout();
    if (isCleared) {
      navigation.getParent()?.reset({
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
          onPress={() => navigation.goBack()}
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
              <Text style={styles.avatarInitial}>A</Text>
            </View>
          </View>
          <Text style={styles.profileName}>Anas Mansoori</Text>
          <Text style={styles.profileContact}>7619983037</Text>
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
