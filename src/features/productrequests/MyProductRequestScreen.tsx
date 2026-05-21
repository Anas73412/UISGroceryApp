import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  type ListRenderItem,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { SettingsStackParamList } from '../../navigation/types';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { AppHeader } from '../../components/ui';
import { theme } from '../../theme';
import type { ProductRequestModel } from '../../data/models/ProductRequestModel';
import { useLoading } from '../../components/context/LoadingContext';
import { useMessageDialog } from '../../components/context/MessageDialogContext';
import { SUCCESS } from '../../utils/constants';
import { productRequestController } from './controller';
import { RequestCard } from './components/RequestCard';
import styles from './MyProductRequestScreen.Style';

type Nav = NativeStackNavigationProp<
  SettingsStackParamList,
  'MyProductRequest'
>;

export function MyProductRequestScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { show, hide } = useLoading();
  const { showErrorDialog } = useMessageDialog();
  const [requests, setRequests] = useState<ProductRequestModel[]>([]);

  const loadRequests = useCallback(async () => {
    show('Loading...');
    try {
      const res = await productRequestController.fetchUserRequests();
      if (!Array.isArray(res)) {
        setRequests([]);
        if (res.message) showErrorDialog('Requests', res.message);
        return;
      }
      const sorted = [...res].sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
      setRequests(sorted);
    } catch {
      setRequests([]);
      showErrorDialog('Requests', 'Could not load product requests.');
    } finally {
      hide();
    }
  }, [hide, show, showErrorDialog]);

  useFocusEffect(
    useCallback(() => {
      loadRequests();
    }, [loadRequests]),
  );

  const renderItem: ListRenderItem<ProductRequestModel> = ({ item }) => (
    <RequestCard request={item} />
  );

  const fabBottom = Math.max(insets.bottom, 16) + theme.spacing[4];

  return (
    <View style={styles.container}>
      <AppHeader
        title="My Requests"
        titleColor={theme.colors.primary}
        showNewsButton
        onNewsPress={() =>
          showErrorDialog('News', 'News will be available soon.')
        }
      />

      <View style={styles.body}>
        <FlatList
          data={requests}
          keyExtractor={r => String(r.id)}
          renderItem={renderItem}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No product requests yet.</Text>
          }
        />

        <View
          style={[styles.fabOverlay, { paddingBottom: fabBottom }]}
          pointerEvents="box-none"
        >
          <TouchableOpacity
            style={styles.fab}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('NewProductRequest')}
            accessibilityRole="button"
            accessibilityLabel="Add product request"
          >
            <View style={styles.fabInner}>
              <MaterialIcons name="add" size={32} color={theme.colors.white} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
