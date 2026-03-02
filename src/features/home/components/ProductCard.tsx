import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import type { Product } from '../model';

type ProductCardProps = {
  product: Product;
  onPress?: (product: Product) => void;
};

export function ProductCard({ product, onPress }: ProductCardProps) {
  return (
    <Pressable
      style={styles.card}
      onPress={() => onPress?.(product)}
    >
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>${product.price.toFixed(2)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 12,
  },
  name: { fontSize: 16, fontWeight: '600' },
  price: { fontSize: 14, color: '#666', marginTop: 4 },
});
