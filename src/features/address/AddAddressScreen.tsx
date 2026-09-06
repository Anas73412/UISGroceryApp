import {
  Alert,
  AppState,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { styles } from './AddAddressScreen.Style';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLoading } from '../../components/context/LoadingContext';
import { useMessageDialog } from '../../components/context/MessageDialogContext';
import type {
  HomeStackParamList,
  SettingsStackParamList,
} from '../../navigation/types';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../../theme';
import { AppHeader, Input } from '../../components/ui';
import { useCallback, useEffect, useRef, useState } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import {
  ensureLocationPermission,
  type LocationPermissionStatus,
} from '../../utils/locationPermission';
import {
  getCurrentLocation,
  getLocationFromCoordinates,
  type LocationResult,
} from '../../utils/getCurrentLocation';
import { AddressResponseModel } from '../../data/models/AddressModel';
import { sessionStore } from '../../store/sessionStore';
import { addressController } from './controller';
import { SUCCESS } from '../../utils/constants';

type AddressType = 'Home' | 'Work' | 'Other';
const ADDRESS_TYPES: { key: AddressType; label: string; icon: string }[] = [
  { key: 'Home', label: 'Home', icon: 'home' },
  { key: 'Work', label: 'Work', icon: 'work' },
  { key: 'Other', label: 'Other', icon: 'location-on' },
];
export function AddAddressScreen() {
  const route =
    useRoute<
      RouteProp<HomeStackParamList & SettingsStackParamList, 'AddAddress'>
    >();
  const addressId = route.params?.addressId;
  const editableAddress = route.params?.address;
  const paramLat = route.params?.latitude;
  const paramLng = route.params?.longitude;
  const paramMapAddress = route.params?.mapAddress;
  const isEditing = addressId != null && editableAddress != null;
  const hasParamCoords =
    typeof paramLat === 'number' &&
    typeof paramLng === 'number' &&
    Number.isFinite(paramLat) &&
    Number.isFinite(paramLng);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [flatNo, setFlatNo] = useState('');
  const [buildingName, setBuildingName] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pincode, setPincode] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [receiverMobile, setReceiverMobile] = useState('');
  const [selectedAddressType, setSelectedAddressType] =
    useState<AddressType>('Home');
  const { show, hide } = useLoading();
  const [rateId, setRateId] = useState<number | null>(null);

  //Location vaiables
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [locationAddress, setLocationAddress] = useState('');
  const [locationPinCode, setLocationPinCode] = useState('');
  const { showErrorDialog, showSuccessDialog } = useMessageDialog();
  const [permStatus, setPermStatus] =
    useState<LocationPermissionStatus>('denied');
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const cancelledRef = useRef(false);

  useEffect(() => {
    if (!fetchingLocation) {
      return;
    }
    show('Getting your location…');
    return () => {
      hide();
    };
  }, [fetchingLocation, show, hide]);

  useEffect(() => {
    if (!editableAddress) {
      return;
    }

    setFlatNo(editableAddress.houseNo ?? '');
    setBuildingName(editableAddress.buildingName ?? '');
    setLandmark(editableAddress.landmark ?? '');
    setPincode(editableAddress.pincode ?? '');
    setReceiverName(editableAddress.receiverName ?? '');
    setReceiverMobile(editableAddress.receiverMobile ?? '');
    setLocationAddress(editableAddress.mapAddress ?? '');
    setLocationPinCode(editableAddress.pincode ?? '');
    setSelectedAddressType(
      editableAddress.addressType === 1
        ? 'Home'
        : editableAddress.addressType === 2
        ? 'Work'
        : 'Other',
    );

    const parsedLat = Number(editableAddress.latitude);
    const parsedLng = Number(editableAddress.longtitude);

    if (Number.isFinite(parsedLat)) {
      setLat(parsedLat);
    }

    if (Number.isFinite(parsedLng)) {
      setLng(parsedLng);
    }

    setPermStatus('granted');
  }, [editableAddress]);

  const applyResolvedLocation = useCallback(async (result: LocationResult) => {
    setLat(result.lat);
    setLng(result.lng);
    setLocationAddress(result.address);
    setLocationPinCode(result.postalCode);
    if (result.postalCode) {
      setPincode(result.postalCode);
    }
    const distanceIndex = await addressController.findDistanceRangeInKM(
      result.lat,
      result.lng,
    );
    const locRateId = await addressController.findRateIdForDistanceRange(
      distanceIndex ?? -1,
    );
    setRateId(locRateId);
  }, []);

  const tryFetchLocation = useCallback(async () => {
    if (addressId != null) return;

    setFetchingLocation(true);
    const status = await ensureLocationPermission();
    setPermStatus(status);

    if (status !== 'granted') {
      setFetchingLocation(false);
      if (status === 'denied') {
        Alert.alert(
          'Location needed',
          'We use your current location to autofill your delivery address. Without it you will need to type everything manually.',
          [
            { text: 'Not now', style: 'cancel' },
            { text: 'Try again', onPress: () => tryFetchLocation() },
          ],
        );
      }
      return;
    }

    const result = await getCurrentLocation();
    if (cancelledRef.current) {
      setFetchingLocation(false);
      return;
    }

    if (result) {
      await applyResolvedLocation(result);
    }
    setFetchingLocation(false);
  }, [addressId, applyResolvedLocation]);

  const openAppSettings = useCallback(() => {
    Linking.openSettings().catch(() => {
      Alert.alert('Unable to open Settings', 'Please open Settings manually.');
    });
  }, []);

  const dismissBanner = useCallback(() => {
    setPermStatus('granted');
  }, []);

  useEffect(() => {
    cancelledRef.current = false;

    const bootstrapFromParams = async () => {
      if (addressId != null || !hasParamCoords) {
        return;
      }
      setPermStatus('granted');
      setFetchingLocation(true);
      try {
        const resolved = await getLocationFromCoordinates(paramLat!, paramLng!);
        if (cancelledRef.current) {
          return;
        }
        const trimmed = paramMapAddress?.trim();
        await applyResolvedLocation({
          ...resolved,
          address: trimmed && trimmed.length > 0 ? trimmed : resolved.address,
        });
      } finally {
        if (!cancelledRef.current) {
          setFetchingLocation(false);
        }
      }
    };

    const run = async () => {
      if (addressId != null) {
        return;
      }
      if (hasParamCoords) {
        await bootstrapFromParams();
      } else {
        await tryFetchLocation();
      }
    };

    void run();

    return () => {
      cancelledRef.current = true;
    };
  }, [
    addressId,
    hasParamCoords,
    paramLat,
    paramLng,
    paramMapAddress,
    tryFetchLocation,
    applyResolvedLocation,
  ]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', state => {
      if (state === 'active' && permStatus === 'blocked') {
        tryFetchLocation();
      }
    });
    return () => sub.remove();
  }, [permStatus, tryFetchLocation]);

  const handleSubmit = () => {
    if (flatNo.trim() === '') {
      showErrorDialog('Validation Error', 'Please enter house/ flat/ floor no');
      return;
    }

    if (pincode.trim() === '') {
      showErrorDialog('Validation Error', 'Please enter pincode');
      return;
    }

    if (selectedAddressType === 'Other') {
      if (receiverName.trim() === '') {
        showErrorDialog('Validation Error', 'Please enter receiver name');
        return;
      }
      if (receiverMobile.trim() === '') {
        showErrorDialog(
          'Validation Error',
          'Please enter receiver mobile number',
        );
        return;
      }
    }
    const addressData: AddressResponseModel = {
      uId: 0,
      addressId: editableAddress?.addressId ?? 0,
      userId: sessionStore.getState().user?.uid ?? 0,
      buildingName: buildingName,
      pincode: pincode,
      addressType:
        selectedAddressType === 'Home'
          ? 1
          : selectedAddressType === 'Work'
          ? 2
          : 3,
      receiverName: receiverName,
      receiverMobile: receiverMobile,
      houseNo: flatNo,
      otherAddressType: selectedAddressType === 'Other' ? 'Other' : '',
      landmark: landmark,
      status: 1,
      latitude: lat.toString(),
      longtitude: lng.toString(),
      mapAddress: locationAddress,
      distance: rateId ?? -1,
    };
    show();
    saveAddressToServer(addressData).finally(() => {
      hide();
    });
  };

  const saveAddressToServer = async (addressData: AddressResponseModel) => {
    const addressResponse = isEditing
      ? await addressController.updateAddressOnServer(addressData)
      : await addressController.addAddressToServer(addressData);
    if (addressResponse.status === SUCCESS) {
      showSuccessDialog(
        'Success',
        isEditing
          ? 'Address updated successfully'
          : 'Address added successfully',
      );
    } else {
      showErrorDialog(
        'Error',
        addressResponse.message ||
          (isEditing ? 'Failed to update address' : 'Failed to add address'),
      );
    }
  };
  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top - 20, paddingBottom: insets.bottom + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AppHeader
          title={isEditing ? 'Edit Address' : 'Add New Address'}
          showCartIcon={false}
        />

        <View style={styles.container}>
          <Text style={styles.welcomeTitle}>DELIVARY DETAILS</Text>
          <Text style={styles.welcomeSubtitle}>
            {isEditing
              ? 'Update your delivery address'
              : 'Where should we deliver?'}
          </Text>
          <View style={{ height: 24 }} />

          {permStatus !== 'granted' && (
            <View style={styles.permBanner}>
              <MaterialIcons
                name={permStatus === 'blocked' ? 'location-off' : 'location-on'}
                size={24}
                color={theme.colors.primary}
                style={styles.permIcon}
              />
              <View style={styles.permContent}>
                <Text style={styles.permTitle}>
                  {permStatus === 'blocked'
                    ? 'Location access blocked'
                    : 'Use my current location'}
                </Text>
                <Text style={styles.permBody}>
                  {permStatus === 'blocked'
                    ? 'Enable location for GroceryApp in your phone Settings to autofill the address.'
                    : 'Allow location access so we can autofill your delivery address.'}
                </Text>
                <View style={styles.permActions}>
                  {permStatus === 'blocked' ? (
                    <Pressable
                      style={styles.permPrimaryBtn}
                      onPress={openAppSettings}
                    >
                      <Text style={styles.permPrimaryLabel}>Open Settings</Text>
                    </Pressable>
                  ) : (
                    <Pressable
                      style={[
                        styles.permPrimaryBtn,
                        fetchingLocation && styles.permPrimaryBtnDisabled,
                      ]}
                      disabled={fetchingLocation}
                      onPress={tryFetchLocation}
                    >
                      <Text style={styles.permPrimaryLabel}>
                        {fetchingLocation ? 'Requesting…' : 'Allow location'}
                      </Text>
                    </Pressable>
                  )}
                  <Pressable
                    style={styles.permSecondaryBtn}
                    onPress={dismissBanner}
                  >
                    <Text style={styles.permSecondaryLabel}>
                      Enter manually
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}

          <Input
            label="House/ Flat/ Floor No"
            placeholder="Enter house/ flat/ floor no"
            value={flatNo}
            onChangeText={setFlatNo}
            autoCapitalize="none"
          />
          <Input
            label="Pincode"
            placeholder="Enter pincode"
            value={pincode}
            onChangeText={setPincode}
            autoCapitalize="none"
          />
          <Input
            label="Building/ Block No (Optional)"
            placeholder="Enter building/ block no"
            value={buildingName}
            onChangeText={setBuildingName}
            autoCapitalize="none"
          />
          <Input
            label="Landmark/ Area Name (Optional)"
            placeholder="Enter landmark/ area name"
            value={landmark}
            onChangeText={setLandmark}
            autoCapitalize="none"
          />

          <Text style={styles.sectionLabel}>Save Address as</Text>
          <View style={styles.typeRow}>
            {ADDRESS_TYPES.map(type => (
              <Pressable
                key={type.key}
                style={[
                  styles.typeChip,
                  selectedAddressType === type.key && styles.typeChipSelected,
                ]}
                onPress={() => setSelectedAddressType(type.key)}
              >
                <MaterialIcons
                  name={type.icon}
                  size={18}
                  color={
                    selectedAddressType === type.key
                      ? theme.colors.white
                      : theme.colors.primary
                  }
                />
                <Text
                  style={[
                    styles.typeChipText,
                    selectedAddressType === type.key &&
                      styles.typeChipTextSelected,
                  ]}
                >
                  {type.label}
                </Text>
              </Pressable>
            ))}
          </View>
          {selectedAddressType === 'Other' && (
            <View style={styles.receiverSection}>
              <Input
                label="Receiver's Name"
                placeholder="Enter receiver name"
                value={receiverName}
                onChangeText={setReceiverName}
                autoCapitalize="none"
              />
              <Input
                label="Receiver's Mobile"
                placeholder="Enter receiver mobile"
                value={receiverMobile}
                onChangeText={setReceiverMobile}
                autoCapitalize="none"
                keyboardType="phone-pad"
              />
            </View>
          )}
          <View style={styles.addAddressContainer}>
            <View style={styles.buttonRow}>
              <Pressable
                style={[styles.actionBtn, styles.submitBtn]}
                onPress={handleSubmit}
              >
                <Text style={[styles.actionLabel, styles.submitLabel]}>
                  {isEditing ? 'Update' : 'Submit'}
                </Text>
              </Pressable>
              <Pressable
                style={[styles.actionBtn, styles.cancelBtn]}
                onPress={() => navigation.goBack()}
              >
                <Text style={[styles.actionLabel, styles.cancelLabel]}>
                  Cancel
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
