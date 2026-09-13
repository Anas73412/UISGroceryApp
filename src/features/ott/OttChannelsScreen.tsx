import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AppHeader, usePullToRefresh } from '../../components/ui';
import { OttChannelCard } from './components/OttChannelCard';
import { ottStore } from './store';
import type { OttChannel } from './types';
import { styles } from './OttChannelsScreen.styles';

const NUM_COLUMNS = 2;

export function OttChannelsScreen() {
  const items = ottStore(state => state.items);
  const loading = ottStore(state => state.loading);
  const error = ottStore(state => state.error);
  const load = ottStore(state => state.load);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const keyExtractor = useCallback((item: OttChannel) => String(item.id), []);

  const renderItem = useCallback(
    ({ item }: { item: OttChannel }) => (
      <View style={styles.gridItem}>
        <OttChannelCard item={item} />
      </View>
    ),
    [],
  );

  const handlePullRefresh = useCallback(async () => {
    await load();
  }, [load]);

  const { refreshControl } = usePullToRefresh(handlePullRefresh);

  if (loading && items.length === 0) {
    return (
      <View style={styles.container}>
        <AppHeader title="OTT Channels" />
        <View style={styles.loading}>
          <ActivityIndicator color="#39afbc" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader title="OTT Channels" />
      {error ? (
        <View style={styles.stateWrap}>
          <Text style={styles.error}>{error}</Text>
          <Pressable onPress={() => void load()}>
            <Text style={styles.retry}>Try again</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          numColumns={NUM_COLUMNS}
          style={styles.list}
          contentContainerStyle={styles.content}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          refreshControl={refreshControl}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          windowSize={7}
          removeClippedSubviews
          ListHeaderComponent={
            items.length > 0 ? (
              <View style={styles.hero}>
                <Text style={styles.heroTitle}>Stream more</Text>
                <Text style={styles.heroSubtitle}>
                  {items.length} channel{items.length === 1 ? '' : 's'} available
                  with United plans
                </Text>
              </View>
            ) : null
          }
          ListEmptyComponent={
            <Text style={styles.empty}>No OTT channels available right now.</Text>
          }
        />
      )}
    </View>
  );
}
