import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { cartStore } from '../../../store/cartStore';

export function CartScreen() {
  const items = cartStore((s) => s.items);
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cart</Text>
      <Text style={styles.count}>{items.length} item(s)</Text>
      <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, marginBottom: 16 },
  count: { fontSize: 16, marginBottom: 8 },
  total: { fontSize: 18, fontWeight: '600' },
});
