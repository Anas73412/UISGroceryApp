import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  FlatList,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { CategoryCard } from '../home/components/CategoryCard';
import { categoryController } from './controller';
import { extractDataArray } from '../../utils/utils';
import { CategoryModel } from '../../data/models/CategoryModel';
import { IMAGE_BASE_URL } from '../../utils/constants';
import { useLoading } from '../../components/context/LoadingContext';
import { theme } from '../../theme';
import styles from './CategoryScreen.Style';

export function CategoryScreen() {
  const navigation = useNavigation();
  const { show, hide } = useLoading();
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    show('Loading...');
    try {
      const res = await categoryController.fetchCategories();
      const data = extractDataArray<CategoryModel>(res.data);
      setCategories(data);
    } finally {
      hide();
    }
  };

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLowerCase().trim();
    return categories.filter(c => c.categoryName?.toLowerCase().includes(q));
  }, [categories, searchQuery]);

  return (
    <View style={styles.container}>
      {/* Top app bar */}
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
        <Text style={styles.headerTitle}>Categories</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Search Category */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search Category"
          placeholderTextColor="#9ca3af"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Category list */}
      <FlatList
        data={filteredCategories}
        keyExtractor={item => String(item.categoryId)}
        numColumns={2}
        columnWrapperStyle={styles.categoryRow}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.categoryColumn}>
            <CategoryCard
              label={item.categoryName}
              imagePath={IMAGE_BASE_URL + item.categoryImage}
              onPress={() => {}}
            />
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.loadingContainer}>
            {categories.length === 0 ? (
              <ActivityIndicator size="small" color={theme.colors.primary} />
            ) : (
              <Text style={styles.emptyText}>No categories found</Text>
            )}
          </View>
        )}
      />
    </View>
  );
}
