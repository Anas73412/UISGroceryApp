import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { ProductCard } from '../components/ProductCard';
import { homeController } from '../controller';
import type { Product } from '../model';

export function HomeScreen() {
  const [products, setProducts] = React.useState<Product[]>([]);

  React.useEffect(() => {
    homeController.getProducts().then(setProducts);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductCard product={item} />}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, marginBottom: 16 },
  list: { paddingBottom: 24 },
});
