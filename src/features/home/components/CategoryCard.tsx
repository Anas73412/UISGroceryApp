import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../../../theme';
import { RemoteImage } from '../../../components/ui/RemoteImage/RemoteImage';

type CategoryCardProps = {
  label: string;
  imagePath?: string;
  iconText?: string;
  isSelected?: boolean;
  onPress?: () => void;
};

function CategoryCardComponent({
  label,
  imagePath,
  isSelected = false,
  onPress,
}: CategoryCardProps) {
  const hasImage = !!imagePath;

  return (
    <Pressable
      style={[styles.container, isSelected && styles.containerSelected]}
      onPress={onPress}
    >
      <View
        style={[styles.iconWrapper, isSelected && styles.iconWrapperSelected]}
      >
        {hasImage ? (
          <RemoteImage
            uri={imagePath}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <RemoteImage style={styles.image} resizeMode="cover" />
        )}
      </View>
      <Text
        style={[styles.label, isSelected && styles.labelSelected]}
        numberOfLines={2}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export const CategoryCard = memo(
  CategoryCardComponent,
  (prev, next) =>
    prev.label === next.label &&
    prev.imagePath === next.imagePath &&
    prev.isSelected === next.isSelected &&
    prev.onPress === next.onPress,
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 80,
    marginRight: theme.spacing[4],
  },
  containerSelected: {},
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing[2],
    overflow: 'hidden',
  },
  iconWrapperSelected: {
    backgroundColor: theme.colors.primary,
  },
  image: {
    width: '80%',
    height: '80%',
  },
  iconText: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.gray800,
  },
  iconTextSelected: {
    color: theme.colors.textOnPrimary,
  },
  label: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.gray500,
    textAlign: 'center',
  },
  labelSelected: {
    color: theme.colors.gray800,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});
