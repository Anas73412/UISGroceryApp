import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { ProductCard } from '../components/ProductCard';
import { CategoryCard } from '../components/CategoryCard';
import { homeController } from '../controller';
import type { Product } from '../model';
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
import { useFocusEffect } from '@react-navigation/native';
import { CategoryModel } from '../../../data/models/CategoryModel';

type Category = {
  id: string;
  label: string;
  iconText?: string;
};

export function HomeScreen() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [sliders, setSliders] = useState<SliderModel[]>([]);
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [activeSilderIndex, setActiveSliderIndex] = useState(0);
  const silderRef = useRef<FlatList>(null);
  const autoSlideTimeRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { show, hide } = useLoading();
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<number>(
    categories[0]?.categoryId,
  );

  useFocusEffect(
    useCallback(() => {
      loadAllData();
    }, []),
  );

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
      setSliders(sliderData);
      setCategories(categories);
      hide();
    } catch (error) {
      hide();
    } finally {
      hide();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <FlatList
          data={products}
          keyExtractor={item => item.id}
          numColumns={2}
          columnWrapperStyle={styles.productRow}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <>
              <View style={styles.topRow}>
                <View>
                  <Text style={styles.deliveryLabel}>DELIVERY TO</Text>
                  <Pressable style={styles.locationRow}>
                    <Text style={styles.locationText}>
                      123 Market St, New York
                    </Text>
                    <Text style={styles.locationChevron}>⌄</Text>
                  </Pressable>
                </View>
                <Pressable style={styles.bellButton}>
                  <Text style={styles.bellText}>🔔</Text>
                </Pressable>
              </View>

              <View style={styles.searchContainer}>
                <TextInput
                  placeholder="Search for groceries, milk, or more."
                  placeholderTextColor="#9ca3af"
                  style={styles.searchInput}
                />
                <Pressable style={styles.filterButton}>
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
                <Pressable>
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
                    onPress={() => setSelectedCategoryId(item.categoryId)}
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
          renderItem={({ item }) => (
            <View style={styles.productColumn}>
              <ProductCard
                product={item}
                badgeLabel="ORGANIC"
                onAddToCart={() => {}}
              />
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
