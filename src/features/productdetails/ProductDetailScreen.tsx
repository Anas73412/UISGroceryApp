import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  Pressable,
  FlatList,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../../theme';
import { IMAGE_BASE_URL, RUPEE_SIGN } from '../../utils/constants';
import { QuantitySelector } from '../../components/ui/QuantitySelector';
import { ProductCard } from '../home/components/ProductCard';
import Toast from 'react-native-toast-message';
import styles from './ProductDetailScreen.Style';
import { HomeStackParamList } from '../../navigation/types';
import { ProductModel } from '../../data/models/ProductModel';
import { CartResponseModel } from '../../data/models/CartModel';
import { sessionStore } from '../../store/sessionStore';
import { cartStore } from '../../store/cartStore';
import { homeController } from '../home/controller';
import { extractDataArray } from '../../utils/utils';
import { cartSyncService } from '../cart/cartSyncService';
import { useMessageDialog } from '../../components/context/MessageDialogContext';

type ProductDetailRouteProp = RouteProp<
  HomeStackParamList,
  'ProductDetailScreen'
>;

export function ProductDetailScreen() {
  const route = useRoute<ProductDetailRouteProp>();
  const navigation = useNavigation();
  const { product } = route.params;

  const [cartQuantity, setCartQuantity] = useState(product.cartQuantity ?? 0);
  const [isImageLoading, setIsImageLoading] = useState(!!product.productImage);
  const [relatedProducts, setRelatedProducts] = useState<ProductModel[]>([]);
  const [cartQuantities, setCartQuantities] = useState<Record<number, number>>(
    {},
  );
  const { showErrorDialog, showSuccessDialog } = useMessageDialog();
  const price = product.sellingPrice ?? product.price ?? 0;
  const discount = product.discount ?? 0;
  const originalPrice =
    product.originalPrice ??
    (discount > 0 && price > 0 ? price / (1 - discount / 100) : null);
  const imageUri = product.productImage
    ? `${IMAGE_BASE_URL}${product.productImage}`
    : '';
  const showQuantitySelector = cartQuantity > 0;
  const showGoToCart = cartQuantity > 0;

  const buildCartModel = useCallback(
    async (prod: ProductModel, qty: number): Promise<CartResponseModel> => {
      const userId = await sessionStore.getState().user?.uid;
      const pCartId =
        (await cartStore.getState().getCartId(prod.productId ?? 0)) ?? 0;
      return {
        id: 0,
        cartId: pCartId,
        productId: prod.productId ?? 0,
        quantity: qty,
        userId: userId ?? 0,
        status: 1,
        createdAt: String(Date.now()),
        modifiedAt: Date.now().toString(),
      };
    },
    [],
  );

  useEffect(() => {
    loadRelatedProducts();
  }, [product.categoryId]);

  useEffect(() => {
    const loadCartQty = async () => {
      await cartStore.getState().loadFromDB();
      const items = cartStore.getState().items;
      const item = items.find(c => c.productId === product.productId);
      setCartQuantity(item?.quantity ?? 0);
    };
    loadCartQty();
  }, [product.productId]);

  const loadRelatedProducts = async () => {
    if (!product.categoryId) return;
    try {
      const res = await homeController.fetchNewlyAddedProducts(
        product.categoryId,
        1,
        10,
      );
      const products = extractDataArray<ProductModel>(res.data?.products);
      const filtered = products
        .filter(p => p.productId !== product.productId)
        .slice(0, 6);
      setRelatedProducts(filtered);
    } catch {
      setRelatedProducts([]);
    }
  };

  const handleAddToCart = async () => {
    const cartModel = await buildCartModel(product, 1);
    const res = await cartSyncService.addOrUpdate(cartModel, 1);
    if (res.status) {
      Toast.show({ type: 'success', text1: res.message });
      await cartStore.getState().loadFromDB();
      setCartQuantity(1);
    } else {
      showErrorDialog('Add to Cart', res.message ?? 'Failed to add');
    }
  };

  const handleQuantityIncrement = async () => {
    const newQty = cartQuantity + 1;
    const cartModel = await buildCartModel(product, newQty);
    const res = await cartSyncService.addOrUpdate(cartModel, newQty);
    if (res.status) {
      await cartStore.getState().loadFromDB();
      setCartQuantity(newQty);
    }
  };

  const handleGoToCart = () => {
    navigation.getParent()?.navigate('CartTab');
  };

  const handleRelatedQuantityChange = useCallback(
    (p: ProductModel, qty: number) => {
      if (p.productId != null) {
        setCartQuantities(prev => ({ ...prev, [p.productId!]: qty }));
      }
    },
    [],
  );

  const hasDescription = !!product.description?.trim();
  const hasFeatures = !!product.features?.trim();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          hitSlop={12}
        >
          <MaterialIcons
            name="arrow-back"
            size={24}
            color={theme.colors.primary}
          />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {product.productName ?? 'Product'}
        </Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Product Image */}
        <View style={styles.imageContainer}>
          {imageUri ? (
            <>
              <Image
                source={{ uri: imageUri }}
                style={styles.image}
                resizeMode="contain"
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
            <View style={styles.imagePlaceholder} />
          )}
        </View>

        {/* Product Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.category}>
            {product.categoryName?.toUpperCase() ?? 'PRODUCT'}
          </Text>
          <Text style={styles.productName}>
            {product.productName ?? 'Product'}
          </Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>{RUPEE_SIGN + price.toFixed(2)}</Text>
            {originalPrice != null && discount > 0 && (
              <Text style={styles.mrp}>
                {RUPEE_SIGN + originalPrice.toFixed(2)}
              </Text>
            )}
          </View>

          {discount > 0 && (
            <Text style={styles.discount}>{Math.round(discount)}% OFF</Text>
          )}

          {hasDescription && (
            <>
              <Text style={styles.sectionLabel}>Product Description</Text>
              <Text style={styles.sectionContent}>{product.description}</Text>
            </>
          )}

          {hasFeatures && (
            <>
              <Text style={styles.sectionLabel}>Product Features</Text>
              <Text style={styles.sectionContent}>{product.features}</Text>
            </>
          )}

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <>
              <Text style={styles.relatedTitle}>Related Products</Text>
              <FlatList
                data={relatedProducts}
                scrollEnabled={false}
                numColumns={2}
                keyExtractor={item => String(item.productId)}
                columnWrapperStyle={styles.relatedRow}
                contentContainerStyle={styles.relatedList}
                renderItem={({ item }) => {
                  const productWithQty: ProductModel = {
                    ...item,
                    cartQuantity:
                      cartQuantities[item.productId ?? 0] ??
                      item.cartQuantity ??
                      0,
                  };
                  return (
                    <View style={styles.relatedItem}>
                      <ProductCard
                        product={productWithQty}
                        discountPercent={item.discount}
                        categoryLabel={item.categoryName}
                        // onPress={p =>
                        //   navigation.navigate('ProductDetailScreen', {
                        //     product: p as ProductModel,
                        //   })
                        // }
                        onQuantityChange={handleRelatedQuantityChange}
                      />
                    </View>
                  );
                }}
              />
            </>
          )}
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        {showQuantitySelector ? (
          <View style={styles.quantitySelectorWrapper}>
            <QuantitySelector
              quantity={cartQuantity}
              onIncrement={handleQuantityIncrement}
              onDecrement={async () => {
                const newQty = Math.max(0, cartQuantity - 1);
                if (newQty === 0) {
                  const cartId = await cartStore
                    .getState()
                    .getCartId(product.productId ?? 0);
                  await cartSyncService.removeCartProduct(
                    cartId,
                    product.productId ?? 0,
                  );
                  Toast.show({ type: 'success', text1: 'Removed from cart' });
                } else {
                  const cartModel = await buildCartModel(product, newQty);
                  await cartSyncService.addOrUpdate(cartModel, newQty);
                }
                await cartStore.getState().loadFromDB();
                setCartQuantity(newQty);
              }}
              min={0}
            />
          </View>
        ) : null}

        {showGoToCart ? (
          <Pressable style={styles.goToCartButton} onPress={handleGoToCart}>
            <Text style={styles.buttonText}>Go to Cart</Text>
          </Pressable>
        ) : (
          <Pressable
            style={[
              styles.addToCartButton,
              !showQuantitySelector && styles.addToCartButtonFull,
            ]}
            onPress={handleAddToCart}
          >
            <MaterialIcons
              name="shopping-cart"
              size={20}
              color={theme.colors.textOnPrimary}
            />
            <Text style={styles.buttonText}>Add to Cart</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
