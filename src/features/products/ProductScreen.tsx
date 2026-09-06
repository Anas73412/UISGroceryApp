import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  View,
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
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ProductModel } from '../../data/models/ProductModel';
import { productController } from './controller';
import { ProductCard } from '../home/components/ProductCard';
import { useLoading } from '../../components/context/LoadingContext';
import { AppHeader } from '../../components/ui';
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

  useEffect(() => {
    loadSliders();
    loadProducts(1, false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void syncCartQuantitiesFromStore();
    }, [syncCartQuantitiesFromStore]),
  );

  const loadSliders = async () => {
    try {
      const res = await homeController.fetchSliders();
      setSliders(extractDataArray<SliderModel>(res.data));
    } catch {
      setSliders([]);
    }
  };

  const loadProducts = async (page: number, append: boolean = false) => {
    if (page === 1) {
      show('Loading...');
    } else {
      setIsLoadingMore(true);
    }

    try {
      const res = await productController.fetchProducts(categoryId, page, 10);
      const pagingData = res?.data;
      if (pagingData) {
        const newProducts = pagingData.products ?? [];
        setProducts(prev => (append ? [...prev, ...newProducts] : newProducts));
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
    } catch (error: unknown) {
    } finally {
      hide();
      setIsLoadingMore(false);
    }
  };

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

  const handleMore = () => {
    if (!isLoadingMore && hasMore && pageNumber < totalPages) {
      const nextPage = pageNumber + 1;
      loadProducts(nextPage, true);
    }
  };

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

  return (
    <View style={styles.container}>
      <AppHeader title={categoryName} />
      <FlatList
        data={filteredProducts}
        keyExtractor={item => String(item.productId)}
        numColumns={2}
        columnWrapperStyle={styles.productRow}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={listHeader}
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
                discountPercent={item.discount}
                categoryLabel={item.categoryName}
                onPress={p =>
                  navigation.navigate('ProductDetailScreen', {
                    product: {
                      ...(p as ProductModel),
                      cartQuantity:
                        cartQuantities[(p as ProductModel).productId ?? 0] ??
                        (p as ProductModel).cartQuantity ??
                        0,
                    },
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
