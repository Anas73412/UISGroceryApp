import React, { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { RemoteImage } from '../../../components/ui/RemoteImage/RemoteImage';
import type { OttChannel } from '../types';
import { ottImageUri } from '../utils';
import { styles } from './OttChannelCard.styles';

type OttChannelCardProps = {
  item: OttChannel;
  compact?: boolean;
  onPress?: () => void;
};

function OttChannelCardComponent({
  item,
  compact = false,
  onPress,
}: OttChannelCardProps) {
  const uri = ottImageUri(item.imagePath);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        compact && styles.cardCompact,
        pressed && styles.cardPressed,
      ]}
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={item.name}
    >
      <View style={[styles.imageWrap, compact && styles.imageWrapCompact]}>
        <RemoteImage
          uri={uri}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <Text
        style={[styles.name, compact && styles.nameCompact]}
        numberOfLines={2}
      >
        {item.name}
      </Text>
    </Pressable>
  );
}

export const OttChannelCard = memo(
  OttChannelCardComponent,
  (prev, next) =>
    prev.item.id === next.item.id &&
    prev.item.name === next.item.name &&
    prev.item.imagePath === next.item.imagePath &&
    prev.compact === next.compact &&
    prev.onPress === next.onPress,
);
