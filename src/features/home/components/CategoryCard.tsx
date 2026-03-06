import React, { useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import { theme } from '../../../theme';

type CategoryCardProps = {
  label: string;
  imagePath?: string;
  iconText?: string;
  isSelected?: boolean;
  onPress?: () => void;
};

export function CategoryCard({
  label,
  imagePath,
  iconText,
  isSelected = false,
  onPress,
}: CategoryCardProps) {
  const [isLoading, setIsLoading] = useState(!!imagePath);
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
          <>
            <Image
              source={{ uri: imagePath }}
              style={styles.image}
              resizeMode="cover"
              onLoadStart={() => setIsLoading(true)}
              onLoadEnd={() => setIsLoading(false)}
            />
            {isLoading && (
              <View style={styles.loaderOverlay}>
                <ActivityIndicator
                  size="small"
                  color={theme.colors.primary}
                />
              </View>
            )}
          </>
        ) : (
          <Text
            style={[
              styles.iconText,
              isSelected && styles.iconTextSelected,
            ]}
          >
            {iconText ?? '📦'}
          </Text>
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
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
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
