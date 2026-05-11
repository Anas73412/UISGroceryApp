import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ProductCard } from '../components/ProductCard';
import { CategoryCard } from '../components/CategoryCard';
import { homeController } from '../controller';
import styles from './HomeScreen.style';
import { SliderModel } from '../../../data/models/SliderModel';
import {
  AUTO_SLIDE_INTERVAL,
  IMAGE_BASE_URL,
  SLIDER_ITEM_WIDTH,
} from '../../../utils/constants';
import { extractDataArray } from '../../../utils/utils';
import { SliderBanner } from '../../../components/ui/Slider/SliderBanner';
import { useLoading } from '../../../components/context/LoadingContext';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { CategoryModel } from '../../../data/models/CategoryModel';
import { ProductModel } from '../../../data/models/ProductModel';
import { CartModel } from '../../../data/models/CartModel';
import { cartStore } from '../../../store/cartStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../../navigation/types';
import { addressController } from '../../address/controller';
import { appPrefs } from '../../../data/repositories/AppPrefRepository';
import { AddressResponseModel } from '../../../data/models/AddressModel';
import { theme } from '../../../theme';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'HomeScreen'
>;

export function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [products, setProducts] = React.useState<ProductModel[]>([]);
  const [sliders, setSliders] = useState<SliderModel[]>([]);
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [addressList, setAddressList] = useState<AddressResponseModel[]>([]);
  const [activeSilderIndex, setActiveSliderIndex] = useState(0);
  const silderRef = useRef<FlatList>(null);
  const autoSlideTimeRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { show, hide } = useLoading();
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<number>(
    categories[0]?.categoryId,
  );
  const [cartQuantities, setCartQuantities] = useState<Record<number, number>>(
    {},
  );
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState<string>(
    'Select Delivery Address',
  );

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
  useEffect(() => {
    loadAllData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      updateAddressUI();
    }, [addressList]),
  );

  const updateAddressUI = async () => {
    const selectedAddressId = await appPrefs.get('selectedAddressId');
    console.log('Selected Address ID from prefs:', selectedAddressId);
    if (selectedAddressId >= 0) {
      const selectedAddressItem = addressList?.find(
        add => add.addressId === selectedAddressId,
      );

      if (selectedAddressItem) {
        setSelectedAddress(selectedAddressItem.mapAddress);
        return;
      }
    }

    setSelectedAddress('Select Delivery Address');
  };
  useEffect(() => {
    if (sliders.length <= 1) return;

    autoSlideTimeRef.current = setInterval(() => {
      setActiveSliderIndex(prev => {
        const next = (prev + 1) % sliders.length;

        silderRef.current?.scrollToOffset({
          offset: next * SLIDER_ITEM_WIDTH,
          animated: true,
        });

        return next;
      });
    }, AUTO_SLIDE_INTERVAL);

    return () => {
      if (autoSlideTimeRef.current) clearInterval(autoSlideTimeRef.current);
    };
  }, [sliders.length]);

  const loadAllData = async () => {
    try {
      show('Loading...');
      const res = await homeController.fetchSliders();
      const sliderData = extractDataArray<SliderModel>(res.data);
      const catRes = await homeController.fetchCategories();
      const categories = extractDataArray<CategoryModel>(catRes.data);
      await homeController.fetchUserCarts();
      const addressList = await addressController.fetchAddressList();
      setAddressList(addressList?.data ?? []);
      await loadProducts(1, false);
      setSliders(sliderData);
      setCategories(categories);
      await cartStore.getState().loadFromDB();

      hide();
    } catch (error) {
      hide();
    } finally {
      hide();
    }
  };

  const loadProducts = async (pageNumber: number, append: boolean = false) => {
    if (pageNumber == 1) show('Loading...');
    else setIsLoadingMore(true);

    try {
      const res = await homeController.fetchNewlyAddedProducts(
        0,
        pageNumber,
        10,
      );

      const pagingData = res?.data;
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

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore && pageNumber < totalPages) {
      const nextPage = pageNumber + 1;
      setPageNumber(nextPage);
      loadProducts(nextPage, true);
    }
  };

  const navigateToCategories = () => {
    navigation.navigate('CategoryScreen');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <FlatList
          data={products}
          keyExtractor={item => String(item.productId)}
          numColumns={2}
          columnWrapperStyle={styles.productRow}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <>
              <View style={styles.topRow}>
                <Pressable
                  style={styles.addressSection}
                  onPress={() => navigation.navigate('HomeDeliveryAddress')}
                >
                  <Text style={styles.deliveryLabel}>DELIVERY TO</Text>
                  <View style={styles.locationRow}>
                    <MaterialIcons
                      name="location-on"
                      size={18}
                      color={theme.colors.primary}
                      style={styles.locationIcon}
                    />
                    <Text
                      style={styles.locationText}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {selectedAddress}
                    </Text>
                    <MaterialIcons
                      name="keyboard-arrow-down"
                      size={18}
                      color={theme.colors.gray400}
                      style={styles.locationChevron}
                    />
                  </View>
                </Pressable>
                <Pressable style={styles.bellButton}>
                  <MaterialIcons
                    name="notifications-none"
                    size={22}
                    color={theme.colors.gray800}
                  />
                </Pressable>
              </View>

              <View style={styles.searchContainer}>
                <TextInput
                  placeholder="Search for groceries, milk, or more."
                  placeholderTextColor="#9ca3af"
                  style={styles.searchInput}
                />
                <Pressable
                  style={styles.filterButton}
                  onPress={() => {
                    navigation.navigate('SearchScreen');
                  }}
                >
                  <Text style={styles.filterIcon}>☰</Text>
                </Pressable>
              </View>

              {/** Slider HOrizontal caraousal  */}
              {sliders.length > 0 && (
                <View style={styles.sliderContainer}>
                  <FlatList
                    ref={silderRef}
                    data={sliders}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={item => String(item.id)}
                    contentContainerStyle={styles.sliderList}
                    snapToInterval={SLIDER_ITEM_WIDTH}
                    snapToAlignment="start"
                    decelerationRate="fast"
                    onMomentumScrollEnd={e => {
                      const index = Math.round(
                        e.nativeEvent.contentOffset.x / SLIDER_ITEM_WIDTH,
                      );
                      setActiveSliderIndex(Math.min(index, sliders.length - 1));
                    }}
                    renderItem={({ item }) => <SliderBanner slider={item} />}
                  />
                  <View style={styles.sliderIndicatorContainer}>
                    {sliders.map((_, index) => (
                      <View
                        key={index}
                        style={[
                          styles.sliderDot,
                          index === activeSilderIndex && styles.sliderDotActive,
                        ]}
                      ></View>
                    ))}
                  </View>
                </View>
              )}

              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Shop by Category</Text>
                <Pressable onPress={navigateToCategories}>
                  <Text style={styles.viewAllText}>View All</Text>
                </Pressable>
              </View>

              <FlatList
                horizontal
                data={categories}
                keyExtractor={item => String(item.categoryId)}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesList}
                renderItem={({ item }) => (
                  <CategoryCard
                    label={item.categoryName}
                    imagePath={IMAGE_BASE_URL + item.categoryImage}
                    isSelected={item.categoryId === selectedCategoryId}
                    onPress={() =>
                      navigation.navigate('ProductScreen', {
                        categoryId: item.categoryId,
                        categoryName: item.categoryName,
                      })
                    }
                  />
                )}
              />

              <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionTitleRow}>
                  <Text style={styles.sectionTitle}>Newly Added Products</Text>
                  <View style={styles.hotPill}>
                    <Text style={styles.hotPillText}>HOT</Text>
                  </View>
                </View>
              </View>
            </>
          }
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
          onEndReached={handleLoadMore}
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
    </SafeAreaView>
  );
}
