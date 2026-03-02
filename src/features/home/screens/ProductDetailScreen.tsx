import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import type { Product } from '../model';

type ProductDetailScreenProps = {
  route: { params: { productId: string } };
  navigation: unknown;
};

export function ProductDetailScreen({ route }: ProductDetailScreenProps) {
  const { productId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Product Detail</Text>
      <Text style={styles.id}>ID: {productId}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 16 },
  id: { fontSize: 16 },
});
