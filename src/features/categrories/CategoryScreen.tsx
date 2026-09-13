import React, { useCallback, useEffect, useMemo, useState, memo } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  ActivityIndicator,
  type ListRenderItem,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CategoryCard } from '../home/components/CategoryCard';
import { categoryController } from './controller';
import { extractDataArray } from '../../utils/utils';
import { CategoryModel } from '../../data/models/CategoryModel';
import { IMAGE_BASE_URL } from '../../utils/constants';
import { useLoading } from '../../components/context/LoadingContext';
import { AppHeader, usePullToRefresh } from '../../components/ui';
import { theme } from '../../theme';
import styles from './CategoryScreen.Style';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/types';

type CategoryNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'CategoryScreen'
>;

type CategoryGridItemProps = {
  item: CategoryModel;
  onPress: (item: CategoryModel) => void;
};

const CategoryGridItem = memo(function CategoryGridItem({
  item,
  onPress,
}: CategoryGridItemProps) {
  const handlePress = useCallback(() => {
    onPress(item);
  }, [item, onPress]);

  return (
    <View style={styles.categoryColumn}>
      <CategoryCard
        label={item.categoryName}
        imagePath={IMAGE_BASE_URL + item.categoryImage}
        onPress={handlePress}
      />
    </View>
  );
});

export function CategoryScreen() {
  const navigation = useNavigation<CategoryNavigationProp>();
  const { show, hide } = useLoading();
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const loadCategories = useCallback(
    async (options?: { silent?: boolean }) => {
      if (!options?.silent) {
        show('Loading...');
      }
      try {
        const res = await categoryController.fetchCategories();
        const data = extractDataArray<CategoryModel>(res.data);
        setCategories(data);
      } finally {
        if (!options?.silent) {
          hide();
        }
      }
    },
    [hide, show],
  );

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  const handlePullRefresh = useCallback(async () => {
    await loadCategories({ silent: true });
  }, [loadCategories]);

  const { refreshControl } = usePullToRefresh(handlePullRefresh);

  const handleCategoryPress = useCallback(
    (item: CategoryModel) => {
      navigation.navigate('ProductScreen', {
        categoryId: item.categoryId,
        categoryName: item.categoryName,
      });
    },
    [navigation],
  );

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLowerCase().trim();
    return categories.filter(c => c.categoryName?.toLowerCase().includes(q));
  }, [categories, searchQuery]);

  const renderItem: ListRenderItem<CategoryModel> = useCallback(
    ({ item }) => (
      <CategoryGridItem item={item} onPress={handleCategoryPress} />
    ),
    [handleCategoryPress],
  );

  const keyExtractor = useCallback(
    (item: CategoryModel) => String(item.categoryId),
    [],
  );

  const listEmpty = useCallback(
    () => (
      <View style={styles.loadingContainer}>
        {categories.length === 0 ? (
          <ActivityIndicator size="small" color={theme.colors.primary} />
        ) : (
          <Text style={styles.emptyText}>No categories found</Text>
        )}
      </View>
    ),
    [categories.length],
  );

  return (
    <View style={styles.container}>
      <AppHeader title="Categories" />

      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search Category"
          placeholderTextColor="#9ca3af"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredCategories}
        keyExtractor={keyExtractor}
        numColumns={4}
        columnWrapperStyle={styles.categoryRow}
        contentContainerStyle={styles.listContent}
        renderItem={renderItem}
        ListEmptyComponent={listEmpty}
        refreshControl={refreshControl}
        initialNumToRender={12}
        maxToRenderPerBatch={12}
        updateCellsBatchingPeriod={50}
        windowSize={7}
        removeClippedSubviews
      />
    </View>
  );
}
