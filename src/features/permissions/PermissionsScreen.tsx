import {
  AppState,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { theme } from '../../theme';
import { styles } from './PermissionsScreen.Style';
import type { RootStackParamList } from '../../navigation/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  ensureLocationPermission,
  type LocationPermissionStatus,
} from '../../utils/locationPermission';
import {
  ensureContactsPermission,
  type ContactsPermissionStatus,
} from '../../utils/contactsPermission';
import {
  ensureFilesPermission,
  type FilesPermissionStatus,
} from '../../utils/filesPermission';
import { appPrefs } from '../../data/repositories/AppPrefRepository';
import AuthRepository from '../../data/repositories/AuthRepository';
import { sessionStore } from '../../store/sessionStore';
import { clearAllSessionData } from '../../services/sessionLifecycle';

type PermissionsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Permissions'>;
};

type AnyStatus =
  | LocationPermissionStatus
  | ContactsPermissionStatus
  | FilesPermissionStatus;

type CardConfig = {
  key: 'location' | 'files' | 'contacts';
  title: string;
  body: string;
  icon: string;
};

const CARDS: CardConfig[] = [
  {
    key: 'location',
    title: 'Location',
    body: 'Detect your address automatically and find nearby stores for faster delivery.',
    icon: 'location-on',
  },
  {
    key: 'files',
    title: 'Files & Media',
    body: 'Pick photos from your gallery to set a profile picture or attach to orders.',
    icon: 'folder',
  },
  {
    key: 'contacts',
    title: 'Contacts',
    body: 'Share your favourite items and orders with friends from your contact list.',
    icon: 'contacts',
  },
];

export function PermissionsScreen({ navigation }: PermissionsScreenProps) {
  const insets = useSafeAreaInsets();

  const [locationStatus, setLocationStatus] =
    useState<LocationPermissionStatus>('denied');
  const [filesStatus, setFilesStatus] =
    useState<FilesPermissionStatus>('denied');
  const [contactsStatus, setContactsStatus] =
    useState<ContactsPermissionStatus>('denied');

  const [busyKey, setBusyKey] = useState<CardConfig['key'] | null>(null);
  const [routing, setRouting] = useState(false);

  const requestByKey = useCallback(async (key: CardConfig['key']) => {
    setBusyKey(key);
    try {
      if (key === 'location') {
        const s = await ensureLocationPermission();
        setLocationStatus(s);
      } else if (key === 'files') {
        const s = await ensureFilesPermission();
        setFilesStatus(s);
      } else if (key === 'contacts') {
        const s = await ensureContactsPermission();
        setContactsStatus(s);
      }
    } finally {
      setBusyKey(null);
    }
  }, []);

  const refreshAllStatuses = useCallback(async () => {
    // Triggered on AppState 'active' so blocked permissions can be re-checked
    // after the user grants them via Settings.
    if (locationStatus === 'blocked') {
      const s = await ensureLocationPermission();
      setLocationStatus(s);
    }
    if (filesStatus === 'blocked') {
      const s = await ensureFilesPermission();
      setFilesStatus(s);
    }
    if (contactsStatus === 'blocked') {
      const s = await ensureContactsPermission();
      setContactsStatus(s);
    }
  }, [locationStatus, filesStatus, contactsStatus]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', state => {
      if (state === 'active') refreshAllStatuses();
    });
    return () => sub.remove();
  }, [refreshAllStatuses]);

  const proceed = useCallback(async () => {
    setRouting(true);
    try {
      await appPrefs.set('permissionsRequested', true);

      const isLoggedIn = await AuthRepository.isLoggedIn();
      if (isLoggedIn) {
        const restored = await sessionStore.getState().loadSession();
        if (restored) {
          navigation.replace('Main');
          return;
        }
        await clearAllSessionData();
      }

      navigation.replace('Auth');
    } catch (err) {
      console.log('Permissions routing error', err);
      navigation.replace('Auth');
    } finally {
      setRouting(false);
    }
  }, [navigation]);

  const getStatus = (key: CardConfig['key']): AnyStatus => {
    if (key === 'location') return locationStatus;
    if (key === 'files') return filesStatus;
    return contactsStatus;
  };

  const renderCard = (card: CardConfig) => {
    const status = getStatus(card.key);
    const isGranted = status === 'granted';
    const isBlocked = status === 'blocked';
    const isUnavailable = status === 'unavailable';
    const isBusy = busyKey === card.key;

    return (
      <View key={card.key} style={styles.card}>
        <View
          style={[
            styles.iconWrap,
            isGranted && styles.iconWrapGranted,
          ]}
        >
          <MaterialIcons
            name={isGranted ? 'check' : card.icon}
            size={22}
            color={isGranted ? theme.colors.white : theme.colors.primary}
          />
        </View>

        <View style={styles.cardContent}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>{card.title}</Text>
            {isGranted && (
              <Text style={styles.statusGranted}>Allowed</Text>
            )}
            {isBlocked && (
              <Text style={styles.statusBlocked}>Blocked</Text>
            )}
            {isUnavailable && (
              <Text style={styles.statusInfo}>Later</Text>
            )}
          </View>

          <Text style={styles.cardBody}>{card.body}</Text>

          {!isGranted && !isUnavailable && (
            <View style={styles.cardActions}>
              {isBlocked ? (
                <Pressable
                  style={styles.allowBtn}
                  onPress={() => Linking.openSettings()}
                >
                  <Text style={styles.allowBtnLabel}>Open Settings</Text>
                </Pressable>
              ) : (
                <Pressable
                  style={[
                    styles.allowBtn,
                    isBusy && styles.allowBtnDisabled,
                  ]}
                  disabled={isBusy}
                  onPress={() => requestByKey(card.key)}
                >
                  <Text style={styles.allowBtnLabel}>
                    {isBusy ? 'Requesting…' : 'Allow'}
                  </Text>
                </Pressable>
              )}
            </View>
          )}

          {isUnavailable && (
            <Text style={styles.unavailableNote}>
              Will be requested when you use this feature.
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View
      style={[
        styles.screen,
        { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 },
      ]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <MaterialIcons
              name="verified-user"
              size={36}
              color={theme.colors.primary}
            />
          </View>
          <Text style={styles.headerTitle}>App Permissions</Text>
          <Text style={styles.headerSubtitle}>
            Grant a few permissions to get the best experience. You can change
            them later in Settings.
          </Text>
        </View>

        <View style={styles.cardList}>{CARDS.map(renderCard)}</View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[styles.continueBtn, routing && styles.continueBtnDisabled]}
          disabled={routing}
          onPress={proceed}
        >
          <Text style={styles.continueLabel}>
            {routing ? 'Please wait…' : 'Continue'}
          </Text>
        </Pressable>
        <Pressable style={styles.skipBtn} onPress={proceed} disabled={routing}>
          <Text style={styles.skipLabel}>Skip for now</Text>
        </Pressable>
      </View>
    </View>
  );
}
