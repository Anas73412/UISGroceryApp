import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Pressable,
  Text,
  View,
  type GestureResponderEvent,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AddressRepository from '../../data/repositories/AddressRepository';
import {
  AddressModel,
  AddressResponseModel,
} from '../../data/models/AddressModel';
import { useConfirmationDialog } from '../../components/context/ConfirmationDialogContext';
import { useLoading } from '../../components/context/LoadingContext';
import { useMessageDialog } from '../../components/context/MessageDialogContext';
import { appPrefs } from '../../data/repositories/AppPrefRepository';
import { sessionStore } from '../../store/sessionStore';
import { theme } from '../../theme';
import { SUCCESS } from '../../utils/constants';
import type {
  HomeStackParamList,
  SettingsStackParamList,
} from '../../navigation/types';
import { addressController } from './controller';
import styles from './AddressScreen.Style';

type AddressNavigationProp = NativeStackNavigationProp<
  HomeStackParamList & SettingsStackParamList,
  'HomeDeliveryAddress' | 'DeliveryAddress' | 'AddAddress'
>;

export function AddressScreen() {
  const navigation = useNavigation<AddressNavigationProp>();
  const { show, hide } = useLoading();
  const { showConfirm } = useConfirmationDialog();
  const { showErrorDialog, showSuccessDialog } = useMessageDialog();
  const [addressList, setAddressList] = useState<AddressResponseModel[]>([]);
  const [defaultAddressId, setDefaultAddressId] = useState<number>(0);

  const toResponseModel = useCallback(
    (model: AddressModel): AddressResponseModel => {
      return {
        uId: model.uId,
        addressId: model.addressId,
        userId: model.userId,
        houseNo: model.houseNo,
        buildingName: model.buildingName,
        landmark: model.landmark,
        addressType: model.addressType,
        otherAddressType: model.otherAddressType,
        receiverName: model.receiverName,
        receiverMobile: model.receiverMobile,
        status: model.status,
        pincode: model.pincode,
        latitude: model.latitude,
        longtitude: model.longtitude,
        mapAddress: model.mapAddress,
        distance: model.distance,
      };
    },
    [],
  );

  const loadAddressList = useCallback(async () => {
    show('Loading...');
    try {
      const selectedAddressId = await appPrefs.get('selectedAddressId');
      setDefaultAddressId(Number(selectedAddressId ?? 0));

      const apiRes = await addressController.fetchAddressList();
      if (Array.isArray(apiRes.data) && apiRes.data.length > 0) {
        setAddressList(apiRes.data);
        return;
      }

      const userId = sessionStore.getState().user?.uid ?? 0;
      const localAddressList = await AddressRepository.getAllUserAddressDetails(
        userId,
      );
      setAddressList(localAddressList.map(toResponseModel));
    } finally {
      hide();
    }
  }, [hide, show, toResponseModel]);

  useFocusEffect(
    useCallback(() => {
      loadAddressList();
    }, [loadAddressList]),
  );

  const buildAddressTypeLabel = (address: AddressResponseModel) => {
    if (address.otherAddressType?.trim()) return address.otherAddressType;
    if (address.addressType === 1) return 'Home';
    if (address.addressType === 2) return 'Work';
    return 'Other';
  };

  const buildAddressText = (address: AddressResponseModel) => {
    return [
      address.houseNo,
      address.buildingName,
      address.landmark,
      address.mapAddress,
      address.pincode,
    ]
      .filter(Boolean)
      .join(', ');
  };

  const handleAddressPress = (address: AddressResponseModel) => {
    showConfirm({
      title: 'Set default address',
      message:
        'Do you want to set this address as your default delivery address?',
      confirmLabel: 'Set Default',
      cancelLabel: 'Cancel',
      variant: 'primary',
      icon: 'question-circle',
      onConfirm: async () => {
        await appPrefs.set('selectedAddressId', address.addressId);
        setDefaultAddressId(address.addressId);
      },
    });
  };

  const handleEditPress = (
    event: GestureResponderEvent,
    address: AddressResponseModel,
  ) => {
    event.stopPropagation();

    const latitude = Number(address.latitude);
    const longitude = Number(address.longtitude);

    navigation.navigate('AddAddress', {
      addressId: address.addressId,
      address,
      ...(Number.isFinite(latitude) ? { latitude } : {}),
      ...(Number.isFinite(longitude) ? { longitude } : {}),
      ...(address.mapAddress ? { mapAddress: address.mapAddress } : {}),
    });
  };

  const handleDeletePress = (
    event: GestureResponderEvent,
    address: AddressResponseModel,
  ) => {
    event.stopPropagation();

    showConfirm({
      title: 'Delete address',
      message: 'Are you sure you want to delete this delivery address?',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      variant: 'danger',
      icon: 'trash-alt',
      onConfirm: async () => {
        show('Deleting address...');
        try {
          const res = await addressController.deleteAddressOnServer(
            address.addressId,
          );

          if (res.status !== SUCCESS) {
            showErrorDialog(
              'Delete failed',
              res.message || 'Failed to delete address',
            );
            return;
          }

          setAddressList(prev =>
            prev.filter(item => item.addressId !== address.addressId),
          );

          if (defaultAddressId === address.addressId) {
            setDefaultAddressId(0);
            await appPrefs.setMany({
              selectedAddressId: 0,
              lattitude: null,
              longitude: null,
            });
          }

          showSuccessDialog('Success', 'Address deleted successfully');
        } finally {
          hide();
        }
      },
    });
  };

  return (
    <View style={styles.container}>
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
        <Text style={styles.headerTitle}>Delivery Address</Text>
        <View style={styles.headerRight} />
      </View>
      <View style={styles.addAddressContainer}>
        <Pressable
          style={styles.addAddressBtn}
          onPress={() => {
            navigation.navigate(
              'AddAddress',
              {},
              //    {
              //   latitude: 26.810153,
              //   longitude: 79.510737,
              //   mapAddress: 'Optional label from your map picker',
              // }
            );
          }}
        >
          <MaterialIcons
            name="add"
            size={22}
            color={theme.colors.textOnPrimary}
            style={{ marginLeft: theme.spacing[2] }}
          />
          <Text style={styles.addAddressLabel}>Add New Address</Text>
        </Pressable>
      </View>

      <FlatList
        data={addressList}
        keyExtractor={item => String(item.addressId)}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const isSelected = item.addressId === defaultAddressId;
          return (
            <Pressable
              style={[styles.addressCard, isSelected && styles.selectedCard]}
              onPress={() => handleAddressPress(item)}
            >
              <View style={styles.cardTopRow}>
                <View style={styles.chip}>
                  <Text style={styles.chipText}>
                    {buildAddressTypeLabel(item)}
                  </Text>
                </View>

                <View style={styles.cardRightRow}>
                  {isSelected ? (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultBadgeText}>DEFAULT</Text>
                    </View>
                  ) : null}

                  <View style={styles.cardActions}>
                    <Pressable
                      style={styles.cardIconButton}
                      hitSlop={8}
                      onPress={event => handleEditPress(event, item)}
                    >
                      <MaterialIcons
                        name="edit"
                        size={18}
                        color={theme.colors.primary}
                      />
                    </Pressable>
                    <Pressable
                      style={[styles.cardIconButton, styles.deleteIconButton]}
                      hitSlop={8}
                      onPress={event => handleDeletePress(event, item)}
                    >
                      <MaterialIcons
                        name="delete-outline"
                        size={18}
                        color={theme.colors.error}
                      />
                    </Pressable>
                  </View>
                </View>
              </View>

              {item.addressType === 3 && (
                <>
                  <Text style={styles.receiverName}>{item.receiverName}</Text>
                  <Text style={styles.receiverMobile}>
                    {item.receiverMobile}
                  </Text>
                </>
              )}

              <Text style={styles.fullAddress}>{buildAddressText(item)}</Text>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No delivery address available.</Text>
        }
      />
    </View>
  );
}
