import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { sessionStore } from '../../../store/sessionStore';
import { theme } from '../../../theme';
import { IMAGE_BASE_URL } from '../../../utils/constants';
import { RemoteImage } from '../../../components/ui/RemoteImage/RemoteImage';
import styles from './PlanScreen.Style';
import type { PlanModel } from '../../../data/models/PlanModel';
import { planService } from '../service';

export function PlanScreen() {
  const user = sessionStore(state => state.user);
  const planId = user?.planId ?? 0;
  const [plans, setPlans] = useState<PlanModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'current' | 'ott'>('all');
  const [sort, setSort] = useState<'priceAsc' | 'priceDesc'>('priceAsc');

  const loadPlans = async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);
    setErrorMessage('');

    const response = await planService.getAllPlans();
    if (response.status === 'Success' && Array.isArray(response.data)) {
      setPlans(response.data);
    } else {
      setErrorMessage(response.message || 'Unable to load plans right now.');
    }

    setIsLoading(false);
    setIsRefreshing(false);
  };

  useEffect(() => {
    void loadPlans();
  }, []);

  const visiblePlans = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const filtered = plans.filter(plan => {
      const matchesQuery =
        !query ||
        [
          plan.planType,
          plan.offertype,
          plan.speed,
          plan.subone,
          plan.subtwo,
        ].some(value => value?.toLowerCase().includes(query));
      const matchesFilter =
        filter === 'all' ||
        (filter === 'current' && plan.id === planId) ||
        (filter === 'ott' && plan.channelList.length > 0);
      return matchesQuery && matchesFilter;
    });

    return filtered.sort((first, second) => {
      if (first.id === planId) return -1;
      if (second.id === planId) return 1;
      const firstPrice = first.pricewithgst || first.planprice;
      const secondPrice = second.pricewithgst || second.planprice;
      return sort === 'priceAsc'
        ? firstPrice - secondPrice
        : secondPrice - firstPrice;
    });
  }, [filter, planId, plans, searchQuery, sort]);

  const formatPrice = (price: number) => `₹${Number(price || 0).toFixed(0)}`;
  const formatValidity = (plan: PlanModel) =>
    `${plan.validity} ${plan.validityType || 'days'}`;

  const renderPlan = (plan: PlanModel) => {
    const isCurrentPlan = plan.id === planId;
    const benefits = [plan.subone, plan.subtwo].filter(Boolean);

    return (
      <View
        key={plan.id}
        style={[styles.planCard, isCurrentPlan && styles.planCardCurrent]}
      >
        {isCurrentPlan && (
          <View style={styles.currentBadge}>
            <MaterialIcons
              name="check-circle"
              size={14}
              color={theme.colors.white}
            />
            <Text style={styles.currentBadgeText}>YOUR PLAN</Text>
          </View>
        )}

        <View style={styles.planTopRow}>
          <View style={styles.planIconWrap}>
            <MaterialIcons name="wifi" size={24} color={theme.colors.primary} />
          </View>
          <View style={styles.planHeading}>
            <Text style={styles.planType} numberOfLines={1}>
              {plan.planType || plan.offertype || 'WiFi Plan'}
            </Text>
            <Text style={styles.planOffer} numberOfLines={1}>
              {plan.offertype || 'Unlimited home internet'}
            </Text>
          </View>
          <View style={styles.priceBlock}>
            <Text style={styles.price}>
              {formatPrice(plan.pricewithgst || plan.planprice)}
            </Text>
            <Text style={styles.priceSuffix}>/ {formatValidity(plan)}</Text>
          </View>
        </View>

        <View style={styles.speedPanel}>
          <View>
            <Text style={styles.speedLabel}>SPEED</Text>
            <Text style={styles.speedValue}>{plan.speed || 'High speed'}</Text>
          </View>
          <View style={styles.speedDivider} />
          <View>
            <Text style={styles.speedLabel}>PLAN PRICE</Text>
            <Text style={styles.secondaryValue}>
              {formatPrice(plan.planprice)}
            </Text>
          </View>
          {plan.gst > 0 && (
            <View>
              <Text style={styles.speedLabel}>GST</Text>
              <Text style={styles.secondaryValue}>{plan.gst}%</Text>
            </View>
          )}
        </View>

        {benefits.length > 0 && (
          <View style={styles.benefitsList}>
            {benefits.map(benefit => (
              <View key={benefit} style={styles.benefitRow}>
                <MaterialIcons
                  name="check"
                  size={18}
                  color={theme.colors.success}
                />
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>
        )}

        {plan.channelList.length > 0 && (
          <View style={styles.channelSection}>
            <Text style={styles.channelTitle}>Entertainment included</Text>
            <View style={styles.channelGrid}>
              {plan.channelList.map(channel => {
                const imagePath = channel.image_path?.trim() ?? '';
                const imageUri = imagePath.startsWith('http')
                  ? imagePath
                  : imagePath
                  ? `${IMAGE_BASE_URL}${imagePath}`
                  : '';

                return (
                  <View key={channel.channel_id} style={styles.channelTile}>
                    <RemoteImage
                      uri={imageUri}
                      style={styles.channelImage}
                      resizeMode="contain"
                    />
                    <Text style={styles.channelName} numberOfLines={1}>
                      {channel.name}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => void loadPlans(true)}
            tintColor={theme.colors.primary}
          />
        }
      >
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <MaterialIcons name="wifi" size={24} color={theme.colors.white} />
          </View>
          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>UNITED INTERNET SERVICE</Text>
            <Text style={styles.title}>Choose your connection</Text>
          </View>
          <Text style={styles.subtitle}>
            Explore plans built for smooth streaming, work, and everyday
            browsing.
          </Text>
        </View>

        {!isLoading && !errorMessage && plans.length > 0 && (
          <View style={styles.controls}>
            <View style={styles.searchBox}>
              <MaterialIcons
                name="search"
                size={20}
                color={theme.colors.gray500}
              />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search plans or speed"
                placeholderTextColor={theme.colors.gray400}
                style={styles.searchInput}
                returnKeyType="search"
              />
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterRow}
            >
              {(
                [
                  ['all', 'All plans'],
                  ['current', 'My plan'],
                  ['ott', 'OTT included'],
                ] as const
              ).map(([key, label]) => (
                <Pressable
                  key={key}
                  onPress={() => setFilter(key)}
                  style={[
                    styles.filterChip,
                    filter === key && styles.filterChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      filter === key && styles.filterChipTextActive,
                    ]}
                  >
                    {label}
                  </Text>
                </Pressable>
              ))}
              <Pressable
                onPress={() =>
                  setSort(value =>
                    value === 'priceAsc' ? 'priceDesc' : 'priceAsc',
                  )
                }
                style={styles.sortButton}
              >
                <MaterialIcons
                  name={sort === 'priceAsc' ? 'arrow-upward' : 'arrow-downward'}
                  size={16}
                  color={theme.colors.secondary}
                />
                <Text style={styles.sortText}>
                  {sort === 'priceAsc' ? 'Price: low' : 'Price: high'}
                </Text>
              </Pressable>
            </ScrollView>
          </View>
        )}

        {isLoading ? (
          <View style={styles.stateCard}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.stateText}>
              Finding the best plans for you...
            </Text>
          </View>
        ) : errorMessage ? (
          <View style={styles.stateCard}>
            <MaterialIcons
              name="cloud-off"
              size={36}
              color={theme.colors.gray400}
            />
            <Text style={styles.stateTitle}>Plans are taking a moment</Text>
            <Text style={styles.stateText}>{errorMessage}</Text>
            <Pressable
              style={styles.retryButton}
              onPress={() => void loadPlans()}
            >
              <Text style={styles.retryText}>Try again</Text>
            </Pressable>
          </View>
        ) : visiblePlans.length === 0 ? (
          <View style={styles.stateCard}>
            <MaterialIcons
              name="search-off"
              size={36}
              color={theme.colors.gray400}
            />
            <Text style={styles.stateTitle}>
              {plans.length === 0 ? 'No plans available' : 'No matching plans'}
            </Text>
            <Text style={styles.stateText}>
              {plans.length === 0
                ? 'Please check back soon for available connections.'
                : 'Try another search or filter.'}
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.sectionHeading}>
              <Text style={styles.sectionTitle}>Available plans</Text>
              <Text style={styles.sectionCount}>
                {visiblePlans.length} options
              </Text>
            </View>
            {visiblePlans.map(renderPlan)}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
