import React, { memo, useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppHeader, usePullToRefresh } from '../../components/ui';
import { IMAGE_BASE_URL } from '../../utils/constants';
import type { SettingsStackParamList } from '../../navigation/types';
import { newsStore } from './store';
import type { NewsItem } from './types';
import { styles } from './NewsScreen.styles';

function imageUri(path: string): string | undefined {
  const value = path.trim();
  if (!value) return undefined;
  return value.startsWith('http')
    ? value
    : `${IMAGE_BASE_URL}${value.replace(/^\//, '')}`;
}

function displayDate(value: string | null): string {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString();
}

type NewsRowProps = {
  item: NewsItem;
  onPress: (id: number) => void;
};

const NewsRow = memo(function NewsRow({ item, onPress }: NewsRowProps) {
  const uri = imageUri(item.newsPic);

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.9 }]}
      onPress={() => onPress(item.id)}
    >
      {uri ? <Image source={{ uri }} style={styles.image} /> : null}
      <View style={styles.cardBody}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{item.title}</Text>
          {!item.isRead ? <View style={styles.unreadDot} /> : null}
        </View>
        {item.message ? (
          <Text style={styles.preview} numberOfLines={3}>
            {item.message}
          </Text>
        ) : null}
        <Text style={styles.date}>{displayDate(item.createdAt)}</Text>
      </View>
    </Pressable>
  );
});

export function NewsScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<SettingsStackParamList>>();
  const items = newsStore(state => state.items);
  const loading = newsStore(state => state.loading);
  const error = newsStore(state => state.error);
  const load = newsStore(state => state.load);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const onPressItem = useCallback(
    (id: number) => {
      navigation.navigate('NewsDetails', { newsId: id });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: NewsItem }) => (
      <NewsRow item={item} onPress={onPressItem} />
    ),
    [onPressItem],
  );

  const keyExtractor = useCallback((item: NewsItem) => String(item.id), []);

  const handlePullRefresh = useCallback(async () => {
    await load();
  }, [load]);

  const { refreshControl } = usePullToRefresh(handlePullRefresh);

  if (loading && items.length === 0) {
    return (
      <View style={styles.container}>
        <AppHeader title="News" />
        <View style={styles.loading}>
          <ActivityIndicator color="#39afbc" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader title="News" />
      {error ? (
        <View>
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
          style={styles.list}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={refreshControl}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          windowSize={7}
          removeClippedSubviews
          ListEmptyComponent={
            <Text style={styles.empty}>No news available right now.</Text>
          }
        />
      )}
    </View>
  );
}
