import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, View } from 'react-native';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { AppHeader } from '../../components/ui';
import { IMAGE_BASE_URL } from '../../utils/constants';
import type { SettingsStackParamList } from '../../navigation/types';
import { newsService } from './service';
import { newsStore } from './store';
import type { NewsItem } from './types';
import { styles } from './NewsDetailsScreen.styles';

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
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleString();
}

export function NewsDetailsScreen() {
  const route = useRoute<RouteProp<SettingsStackParamList, 'NewsDetails'>>();
  const [item, setItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const markRead = newsStore(state => state.markRead);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      setError(null);

      void newsService
        .getById(route.params.newsId)
        .then(async news => {
          if (!active) return;
          setItem(news);
          try {
            await markRead(news.id);
            if (active)
              setItem(current =>
                current ? { ...current, isRead: true } : current,
              );
          } catch (readError) {
            console.warn('Unable to mark news as read', readError);
          }
        })
        .catch(loadError => {
          if (active) {
            setError(
              loadError instanceof Error
                ? loadError.message
                : 'Unable to load news',
            );
          }
        })
        .finally(() => {
          if (active) setLoading(false);
        });

      return () => {
        active = false;
      };
    }, [markRead, route.params.newsId]),
  );

  return (
    <View style={styles.container}>
      <AppHeader title="News Details" />
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator color="#39afbc" />
        </View>
      ) : error || !item ? (
        <Text style={styles.error}>{error ?? 'News not found.'}</Text>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {imageUri(item.newsPic) ? (
            <Image
              source={{ uri: imageUri(item.newsPic) }}
              style={styles.image}
            />
          ) : null}
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.audience}>{item.targetAudience}</Text>
          <Text style={styles.date}>{displayDate(item.createdAt)}</Text>
          <Text style={styles.message}>{item.message}</Text>
        </ScrollView>
      )}
    </View>
  );
}
