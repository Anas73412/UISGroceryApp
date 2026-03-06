import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ActivityIndicator,
} from 'react-native';
import type { Product } from '../model';
import { theme } from '../../../theme';

type ProductCardProps = {
  product: Product;
  onPress?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  badgeLabel?: string;
};

export function ProductCard({
  product,
  onPress,
  onAddToCart,
  badgeLabel,
}: ProductCardProps) {
  const [isImageLoading, setIsImageLoading] = useState(!!product.imageUrl);

  return (
    <Pressable
      style={styles.card}
      onPress={() => onPress?.(product)}
    >
      <View style={styles.imageWrapper}>
        {badgeLabel ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badgeLabel}</Text>
          </View>
        ) : null}
        {product.imageUrl ? (
          <>
            <Image
              source={{ uri: product.imageUrl }}
              style={styles.image}
              resizeMode="cover"
              onLoadStart={() => setIsImageLoading(true)}
              onLoadEnd={() => setIsImageLoading(false)}
            />
            {isImageLoading && (
              <View style={styles.loaderOverlay}>
                <ActivityIndicator
                  size="small"
                  color={theme.colors.primary}
                />
              </View>
            )}
          </>
        ) : (
          <View style={styles.placeholderImage} />
        )}
      </View>

      <View style={styles.infoRow}>
        <View style={styles.textBlock}>
          <Text
            style={styles.name}
            numberOfLines={2}
          >
            {product.name}
          </Text>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        </View>
        {onAddToCart && (
          <Pressable
            style={styles.addButton}
            onPress={() => onAddToCart(product)}
          >
            <Text style={styles.addButtonText}>+</Text>
          </Pressable>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[3],
    marginBottom: theme.spacing[4],
    shadowColor: theme.colors.black,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  imageWrapper: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: theme.spacing[3],
    backgroundColor: theme.colors.surfaceSecondary,
  },
  image: {
    width: '100%',
    height: 110,
  },
  loaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 110,
    backgroundColor: theme.colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderImage: {
    width: '100%',
    height: 110,
    backgroundColor: theme.colors.gray200,
  },
  badge: {
    position: 'absolute',
    top: theme.spacing[2],
    left: theme.spacing[2],
    zIndex: 1,
    backgroundColor: theme.colors.error,
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borderRadius.base,
  },
  badgeText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textOnPrimary,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textBlock: {
    flex: 1,
    marginRight: theme.spacing[2],
  },
  name: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.gray800,
  },
  price: {
    marginTop: theme.spacing[1],
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.gray800,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: theme.colors.textOnPrimary,
    fontSize: theme.typography.fontSize.lg,
    lineHeight: 20,
    fontWeight: theme.typography.fontWeight.bold,
  },
});
