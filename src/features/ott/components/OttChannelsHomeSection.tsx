import React, { memo, useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { OttChannel } from '../types';
import { OttChannelCard } from './OttChannelCard';
import { styles } from './OttChannelsHomeSection.styles';

const HOME_PREVIEW_COUNT = 4;

type OttChannelsHomeSectionProps = {
  items: OttChannel[];
  onViewAll: () => void;
};

function OttChannelsHomeSectionComponent({
  items,
  onViewAll,
}: OttChannelsHomeSectionProps) {
  const previewItems = useMemo(
    () => items.slice(0, HOME_PREVIEW_COUNT),
    [items],
  );

  if (previewItems.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>OTT Channels</Text>
          <Text style={styles.subtitle}>Entertainment with your plan</Text>
        </View>
        <Pressable
          onPress={onViewAll}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="View all OTT channels"
        >
          <Text style={styles.viewAll}>View All</Text>
        </Pressable>
      </View>

      <View style={styles.grid}>
        {previewItems.map(item => (
          <View key={item.id} style={styles.gridItem}>
            <OttChannelCard item={item} compact onPress={onViewAll} />
          </View>
        ))}
      </View>
    </View>
  );
}

export const OttChannelsHomeSection = memo(OttChannelsHomeSectionComponent);
