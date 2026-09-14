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
  SUCCESS,
} from '../../../utils/constants';
import { extractDataArray } from '../../../utils/utils';
import { SliderBanner } from '../../../components/ui/Slider/SliderBanner';
import { useLoading } from '../../../components/context/LoadingContext';
import { usePullToRefresh } from '../../../components/ui';
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
import { sessionStore } from '../../../store/sessionStore';
import { isWiFiUserEnabled } from '../../../utils/userAccess';
import { WiFiDashboardSections } from '../components/WiFiDashboardSections';
import {
  buildWiFiDashboardData,
  pickActiveService,
  pickCurrentPlan,
} from '../components/wifiDashboardData';
import { newsStore } from '../../news/store';
import { ottStore } from '../../ott/store';
import { OttChannelsHomeSection } from '../../ott/components/OttChannelsHomeSection';
import type { PlanModel } from '../../../data/models/PlanModel';
import type { UserServiceModel } from '../model';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'HomeScreen'
>;

const HOME_PRODUCT_PAGE_SIZE = 10;
const HOME_PRODUCT_MAX_PAGES = 2;

export function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const user = sessionStore(state => state.user);
  const unreadNewsCount = newsStore(state => state.unreadCount);
  const refreshUnreadCount = newsStore(state => state.refreshUnreadCount);
  const ottChannels = ottStore(state => state.items);
  const loadOttChannels = ottStore(state => state.load);
  const showWifiDashboard = isWiFiUserEnabled(user);
  const [currentPlan, setCurrentPlan] = useState<PlanModel | null>(null);
  const [activeService, setActiveService] = useState<UserServiceModel | null>(
    null,
  );
  const wifiDashboardData = useMemo(
    () =>
      buildWiFiDashboardData({
        plan: currentPlan,
        service: activeService,
      }),
    [activeService, currentPlan],
  );
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
        setProducts(prev =>
          prev.map(p =>
            p.productId === id ? { ...p, cartQuantity: quantity } : p,
          ),
        );
      }
    },
    [],
  );

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
    loadAllData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      updateAddressUI();
      void syncCartQuantitiesFromStore();
      void refreshUnreadCount();
      void loadOttChannels();
    }, [
      addressList,
      syncCartQuantitiesFromStore,
      refreshUnreadCount,
      loadOttChannels,
    ]),
  );

  const updateAddressUI = async () => {
    const selectedAddressId = await appPrefs.get('selectedAddressId');
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

  const loadAllData = async (options?: { silent?: boolean }) => {
    try {
      if (!options?.silent) {
        show('Loading...');
      }
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
      await syncCartQuantitiesFromStore();
      const [planRes, serviceRes] = await Promise.all([
        homeController.fetchUserCurrentPlan(),
        homeController.fetchUserService(),
      ]);

      if (planRes.status === SUCCESS) {
        setCurrentPlan(pickCurrentPlan(planRes.data));
      } else {
        setCurrentPlan(null);
      }

      if (serviceRes.status === SUCCESS) {
        setActiveService(pickActiveService(serviceRes.data));
      } else {
        setActiveService(null);
      }

      if (!options?.silent) {
        hide();
      }
    } catch (error) {
      if (!options?.silent) {
        hide();
      }
    } finally {
      if (!options?.silent) {
        hide();
      }
    }
  };

  const loadProducts = async (
    pageNumber: number,
    append: boolean = false,
    options?: { silent?: boolean },
  ) => {
    if (pageNumber > HOME_PRODUCT_MAX_PAGES) {
      setHasMore(false);
      return;
    }

    if (pageNumber == 1 && !options?.silent) show('Loading...');
    else if (pageNumber != 1) setIsLoadingMore(true);

    try {
      const res = await homeController.fetchNewlyAddedProducts(
        0,
        pageNumber,
        HOME_PRODUCT_PAGE_SIZE,
      );

      const pagingData = res?.data;
      if (pagingData) {
        const newProducts = pagingData.products ?? [];
        setProducts(prev => (append ? [...prev, ...newProducts] : newProducts));
        setPageNumber(pageNumber);
        const apiTotalPages = pagingData.totalPages ?? 1;
        const cappedTotalPages = Math.min(
          apiTotalPages,
          HOME_PRODUCT_MAX_PAGES,
        );
        setTotalPages(cappedTotalPages);
        setHasMore(pageNumber < cappedTotalPages);
      }
    } catch (error: any) {
      if (!options?.silent) hide();
      setIsLoadingMore(false);
    } finally {
      if (!options?.silent) hide();
      setIsLoadingMore(false);
    }
  };

  const handlePullRefresh = async () => {
    await Promise.all([loadAllData({ silent: true }), loadOttChannels()]);
  };

  const { refreshControl } = usePullToRefresh(handlePullRefresh);

  const handleLoadMore = () => {
    if (
      !isLoadingMore &&
      hasMore &&
      pageNumber < totalPages &&
      pageNumber < HOME_PRODUCT_MAX_PAGES
    ) {
      const nextPage = pageNumber + 1;
      setPageNumber(nextPage);
      loadProducts(nextPage, true);
    }
  };

  const navigateToCategories = () => {
    navigation.navigate('CategoryScreen');
  };

  const navigateToPlanTab = useCallback(() => {
    navigation.getParent()?.navigate('PlanTab' as never);
  }, [navigation]);

  const navigateToBills = useCallback(() => {
    navigation.navigate('MyBills');
  }, [navigation]);

  const navigateToNews = useCallback(() => {
    navigation.navigate('News');
  }, [navigation]);

  const navigateToOttChannels = useCallback(() => {
    navigation.navigate('OttChannels');
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <FlatList
          data={products}
          keyExtractor={item => String(item.productId)}
          numColumns={2}
          columnWrapperStyle={styles.productRow}
          contentContainerStyle={styles.listContent}
          refreshControl={refreshControl}
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
                <Pressable
                  style={styles.bellButton}
                  onPress={navigateToNews}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel="News"
                >
                  <MaterialIcons
                    name="notifications-none"
                    size={22}
                    color={theme.colors.gray800}
                  />
                  {unreadNewsCount > 0 ? (
                    <View style={styles.newsBadge}>
                      <Text style={styles.newsBadgeText}>
                        {unreadNewsCount > 99 ? '99+' : unreadNewsCount}
                      </Text>
                    </View>
                  ) : null}
                </Pressable>
              </View>
              <Pressable
                onPress={() => {
                  navigation.navigate('SearchScreen');
                }}
              >
                <View style={styles.searchContainer}>
                  <TextInput
                    placeholder="Search for groceries, milk, or more."
                    placeholderTextColor="#9ca3af"
                    readOnly={true}
                    style={styles.searchInput}
                  />
                  <View style={styles.filterButton}>
                    <Text style={styles.filterIcon}>☰</Text>
                  </View>
                </View>
              </Pressable>

              {showWifiDashboard && (
                <WiFiDashboardSections
                  data={wifiDashboardData}
                  onServiceDetailsPress={navigateToPlanTab}
                  onPlanDetailsPress={navigateToPlanTab}
                  onUpdatePress={navigateToPlanTab}
                  onViewBillsPress={navigateToBills}
                />
              )}

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
              <OttChannelsHomeSection
                items={ottChannels}
                onViewAll={navigateToOttChannels}
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
