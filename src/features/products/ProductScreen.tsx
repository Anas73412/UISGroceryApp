import {
  ActivityIndicator,
  FlatList,
  TextInput,
  View,
  type ListRenderItem,
} from 'react-native';
import styles from './ProductScreen.Style';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/types';
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useState, memo } from 'react';
import { ProductModel } from '../../data/models/ProductModel';
import { productController } from './controller';
import { ProductCard } from '../home/components/ProductCard';
import { useLoading } from '../../components/context/LoadingContext';
import { AppHeader, usePullToRefresh } from '../../components/ui';
import { BannerSlider } from '../../components/ui/BannerSlider/BannerSlider';
import { homeController } from '../home/controller';
import { SliderModel } from '../../data/models/SliderModel';
import { extractDataArray } from '../../utils/utils';
import { cartStore } from '../../store/cartStore';
import React from 'react';

type ProductNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'ProductScreen'
>;

type ProductGridItemProps = {
  product: ProductModel;
  cartQuantity: number;
  onPressProduct: (product: ProductModel) => void;
  onQuantityChange: (product: ProductModel, quantity: number) => void;
};

const noopAddToCart = () => {};

const ProductGridItem = memo(function ProductGridItem({
  product,
  cartQuantity,
  onPressProduct,
  onQuantityChange,
}: ProductGridItemProps) {
  const productWithQty = useMemo(
    () => ({ ...product, cartQuantity }),
    [product, cartQuantity],
  );

  return (
    <View style={styles.productColumn}>
      <ProductCard
        product={productWithQty}
        discountPercent={product.discount}
        categoryLabel={product.categoryName}
        onPress={onPressProduct}
        onAddToCart={noopAddToCart}
        onQuantityChange={onQuantityChange}
      />
    </View>
  );
});

export function ProductScreen() {
  const route = useRoute<RouteProp<HomeStackParamList, 'ProductScreen'>>();
  const { categoryId, categoryName } = route.params;
  const navigation = useNavigation<ProductNavigationProp>();
  const { show, hide } = useLoading();
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [sliders, setSliders] = useState<SliderModel[]>([]);
  const [cartQuantities, setCartQuantities] = useState<Record<number, number>>(
    {},
  );
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const syncCartQuantitiesFromStore = useCallback(async () => {
    await cartStore.getState().loadFromDB();
    const qtyByProductId = new Map(
      cartStore
        .getState()
        .items.map(item => [item.productId ?? 0, item.quantity ?? 0]),
    );

    setProducts(prev => {
      const nextCartQuantities: Record<number, number> = {};
      const nextProducts = prev.map(p => {
        const id = p.productId ?? 0;
        const qty = qtyByProductId.get(id) ?? 0;
        nextCartQuantities[id] = qty;
        return { ...p, cartQuantity: qty };
      });
      setCartQuantities(nextCartQuantities);
      return nextProducts;
    });
  }, []);

  const loadSliders = useCallback(async () => {
    try {
      const res = await homeController.fetchSliders();
      setSliders(extractDataArray<SliderModel>(res.data));
    } catch {
      setSliders([]);
    }
  }, []);

  const loadProducts = useCallback(
    async (
      page: number,
      append: boolean = false,
      options?: { silent?: boolean },
    ) => {
      if (page === 1 && !options?.silent) {
        show('Loading...');
      } else if (page !== 1) {
        setIsLoadingMore(true);
      }

      try {
        const res = await productController.fetchProducts(categoryId, page, 10);
        const pagingData = res?.data;
        if (pagingData) {
          const newProducts = pagingData.products ?? [];
          setProducts(prev =>
            append ? [...prev, ...newProducts] : newProducts,
          );
          setCartQuantities(prev => {
            const next = append ? { ...prev } : {};
            for (const p of newProducts) {
              const id = p.productId ?? 0;
              if (id > 0) {
                next[id] = p.cartQuantity ?? 0;
              }
            }
            return next;
          });
          setTotalPages(pagingData.totalPages ?? 1);
          setHasMore(page < (pagingData.totalPages ?? 1));
          setPageNumber(page);
        }
      } catch {
        // Keep existing list on failure
      } finally {
        if (!(options?.silent && page === 1)) {
          hide();
        }
        setIsLoadingMore(false);
      }
    },
    [categoryId, hide, show],
  );

  useEffect(() => {
    void loadSliders();
    void loadProducts(1, false);
  }, [loadProducts, loadSliders]);

  useFocusEffect(
    useCallback(() => {
      void syncCartQuantitiesFromStore();
    }, [syncCartQuantitiesFromStore]),
  );

  const handlePullRefresh = useCallback(async () => {
    await Promise.all([
      loadSliders(),
      loadProducts(1, false, { silent: true }),
    ]);
    await syncCartQuantitiesFromStore();
  }, [loadProducts, loadSliders, syncCartQuantitiesFromStore]);

  const { refreshControl } = usePullToRefresh(handlePullRefresh);

  const handleQuantityChange = useCallback(
    (_product: ProductModel, quantity: number) => {
      const id = _product.productId;
      if (id == null) {
        return;
      }
      setCartQuantities(prev =>
        quantity === 0 ? { ...prev, [id]: 0 } : { ...prev, [id]: quantity },
      );
      setProducts(prev =>
        prev.map(p =>
          p.productId === id ? { ...p, cartQuantity: quantity } : p,
        ),
      );
    },
    [],
  );

  const handlePressProduct = useCallback(
    (p: ProductModel) => {
      navigation.navigate('ProductDetailScreen', {
        product: {
          ...p,
          cartQuantity:
            cartQuantities[p.productId ?? 0] ?? p.cartQuantity ?? 0,
        },
      });
    },
    [cartQuantities, navigation],
  );

  const handleMore = useCallback(() => {
    if (!isLoadingMore && hasMore && pageNumber < totalPages) {
      void loadProducts(pageNumber + 1, true);
    }
  }, [hasMore, isLoadingMore, loadProducts, pageNumber, totalPages]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery) {
      return products;
    }
    const q = searchQuery.toLowerCase().trim();
    return products.filter(p => p.productName?.toLowerCase().includes(q));
  }, [products, searchQuery]);

  const listHeader = useMemo(
    () => (
      <View>
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search Product"
            placeholderTextColor="#9ca3af"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <BannerSlider sliders={sliders} />
      </View>
    ),
    [searchQuery, sliders],
  );

  const renderItem: ListRenderItem<ProductModel> = useCallback(
    ({ item }) => (
      <ProductGridItem
        product={item}
        cartQuantity={
          cartQuantities[item.productId ?? 0] ?? item.cartQuantity ?? 0
        }
        onPressProduct={handlePressProduct}
        onQuantityChange={handleQuantityChange}
      />
    ),
    [cartQuantities, handlePressProduct, handleQuantityChange],
  );

  const keyExtractor = useCallback(
    (item: ProductModel) => String(item.productId),
    [],
  );

  const listFooter = useMemo(
    () =>
      isLoadingMore ? (
        <View style={styles.loadingFooter}>
          <ActivityIndicator size="small" />
        </View>
      ) : null,
    [isLoadingMore],
  );

  return (
    <View style={styles.container}>
      <AppHeader title={categoryName} />
      <FlatList
        data={filteredProducts}
        keyExtractor={keyExtractor}
        numColumns={2}
        columnWrapperStyle={styles.productRow}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={listHeader}
        renderItem={renderItem}
        onEndReached={handleMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={listFooter}
        refreshControl={refreshControl}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        updateCellsBatchingPeriod={50}
        windowSize={7}
        removeClippedSubviews
      />
    </View>
  );
}
