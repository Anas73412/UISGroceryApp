import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  Text,
  View,
  type ListRenderItem,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppHeader } from '../../components/ui';
import { useConfirmationDialog } from '../../components/context/ConfirmationDialogContext';
import { useLoading } from '../../components/context/LoadingContext';
import { useMessageDialog } from '../../components/context/MessageDialogContext';
import { theme } from '../../theme';
import type { HomeStackParamList } from '../../navigation/types';
import { SUCCESS } from '../../utils/constants';
import { mapBillListToItems } from './billMapper';
import { BillCard } from './components/BillCard';
import { billController } from './controller';
import type { BillItem } from './types';
import styles from './BillsScreen.style';

type BillsNav = NativeStackNavigationProp<HomeStackParamList, 'MyBills'>;

export function BillsScreen() {
  const navigation = useNavigation<BillsNav>();
  const insets = useSafeAreaInsets();
  const { show, hide } = useLoading();
  const { showConfirm } = useConfirmationDialog();
  const { showErrorDialog } = useMessageDialog();
  const [bills, setBills] = useState<BillItem[]>([]);
  const [listLoading, setListLoading] = useState(true);

  const loadBills = useCallback(async () => {
    setListLoading(true);
    show('Loading bills...');
    try {
      const res = await billController.fetchBillList();
      if (res.status === SUCCESS) {
        setBills(mapBillListToItems(res.data ?? []));
      } else {
        setBills([]);
        showErrorDialog(
          'Unable to load bills',
          res.message || 'Could not fetch your bills.',
        );
      }
    } catch {
      setBills([]);
      showErrorDialog(
        'Unable to load bills',
        'Could not fetch your bills. Please try again.',
      );
    } finally {
      hide();
      setListLoading(false);
    }
  }, [hide, show, showErrorDialog]);

  useFocusEffect(
    useCallback(() => {
      void loadBills();
    }, [loadBills]),
  );

  const handlePdfPress = useCallback(
    (bill: BillItem) => {
      void billController.handleBillPdfPress(bill, {
        showConfirm,
        showLoading: show,
        hideLoading: hide,
        showError: showErrorDialog,
      });
    },
    [hide, show, showConfirm, showErrorDialog],
  );

  const handleGenerateBill = useCallback(() => {
    // Wire generate bill flow when API is available.
  }, []);

  const renderItem: ListRenderItem<BillItem> = useCallback(
    ({ item }) => <BillCard bill={item} onPdfPress={handlePdfPress} />,
    [handlePdfPress],
  );

  const renderEmpty = useCallback(() => {
    if (listLoading) return null;

    return (
      <View style={styles.emptyState}>
        <MaterialIcons
          name="receipt-long"
          size={48}
          color={theme.colors.gray400}
        />
        <Text style={styles.emptyTitle}>No bills found</Text>
        <Text style={styles.emptyMessage}>
          Your downloaded bills will appear here once available.
        </Text>
      </View>
    );
  }, [listLoading]);

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        title="My Bills"
        titleColor={theme.colors.primary}
        showCartIcon={false}
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.listWrap}>
        <FlatList
          data={bills}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmpty}
        />
      </View>

      <View
        style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}
      >
        <Pressable style={styles.generateButton} onPress={handleGenerateBill}>
          <MaterialIcons
            name="receipt-long"
            size={18}
            color={theme.colors.textOnPrimary}
          />
          <Text style={styles.generateButtonText}>Generate Bill</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
