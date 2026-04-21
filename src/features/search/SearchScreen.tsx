import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/types';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useLoading } from '../../components/context/LoadingContext';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ProductModel } from '../../data/models/ProductModel';
import { searchContoller } from './controller';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import styles from './SearchScreen.Style';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../../theme';
import { ProductCard } from '../home/components/ProductCard';

type SearchNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'SearchScreen'
>;

export function SearchScreen() {
  const route = useRoute<RouteProp<HomeStackParamList, 'SearchScreen'>>();

  const navigation = useNavigation<SearchNavigationProp>();
  const { show, hide } = useLoading();
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [cartQuantities, setCartQuantities] = useState<Record<number, number>>(
    {},
  );
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadProducts(1, false);
  }, []);

  const loadProducts = async (pageNumber: number, append: boolean = false) => {
    if (pageNumber == 1) show('Loading...');
    else setIsLoadingMore(true);

    try {
      const res = await searchContoller.fetchProducts(pageNumber, 10);

      const pagingData = res?.data;
      console.log('SearchData', res?.data);
      if (pagingData) {
        const newProducts = pagingData.products ?? [];
        setProducts(prev => (append ? [...prev, ...newProducts] : newProducts));
        setTotalPages(pagingData.totalPages ?? 1);
        setHasMore(pageNumber < (pagingData.totalPages ?? 1));
      }
    } catch (error: any) {
      console.log('Error in paging products', error.messsage);
      hide();
      setIsLoadingMore(false);
    } finally {
      hide();
      setIsLoadingMore(false);
    }
  };

  const handleQuantityChange = useCallback(
    (product: ProductModel, quantity: number) => {
      const id = product.productId;
      if (id != null) {
        setCartQuantities(prev =>
          quantity === 0 ? { ...prev, [id]: 0 } : { ...prev, [id]: quantity },
        );
      }
    },
    [],
  );
  const handleMore = () => {
    if (!isLoadingMore && hasMore && pageNumber < totalPages) {
      const nexPage = pageNumber + 1;
      setPageNumber(nexPage);
      loadProducts(nexPage, true);
    }
  };

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    const q = searchQuery.toLowerCase().trim();
    return products.filter(p => p.productName?.toLowerCase().includes(q));
  }, [products, searchQuery]);

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
        <Text style={styles.headerTitle}>Search Product</Text>
        <View style={styles.headerRight}></View>
      </View>
      {/** Search Product */}

      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search Product"
          placeholderTextColor="#9ca3af"
          style={styles.searchInput}
          onChangeText={setSearchQuery}
        />
      </View>
      {/** Prdocut List */}
      <FlatList
        data={filteredProducts}
        keyExtractor={item => String(item.productId)}
        numColumns={2}
        columnWrapperStyle={styles.productRow}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const productWithQty: ProductModel = {
            ...item,
            cartQuantity:
              cartQuantities[item.productId ?? 0] ?? item.cartQuantity ?? 0,
          };
          return (
            <View style={styles.productColumn}>
              <ProductCard
                product={productWithQty}
                badgeLabel={item.discount ? undefined : ''}
                discountPercent={item.discount}
                categoryLabel={item.categoryName}
                onPress={p =>
                  navigation.navigate('ProductDetailScreen', {
                    product: p as ProductModel,
                  })
                }
                onAddToCart={() => {}}
                onQuantityChange={handleQuantityChange}
              />
            </View>
          );
        }}
        onEndReached={handleMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={
          isLoadingMore ? (
            <View style={styles.loadingFooter}>
              <ActivityIndicator size="small" />
            </View>
          ) : null
        }
      />
    </View>
  );
}
