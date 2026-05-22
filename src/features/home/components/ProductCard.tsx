import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ActivityIndicator,
} from 'react-native';
import { theme } from '../../../theme';
import { QuantitySelector } from '../../../components/ui/QuantitySelector';
import { IMAGE_BASE_URL, RUPEE_SIGN } from '../../../utils/constants';
import { cartStore } from '../../../store/cartStore';
import { cartController } from '../../cart/controller';
import { CartModel, CartResponseModel } from '../../../data/models/CartModel';
import { sessionStore } from '../../../store/sessionStore';
import { cartSyncService } from '../../cart/cartSyncService';
import { useMessageDialog } from '../../../components/context/MessageDialogContext';
import Toast from 'react-native-toast-message';

export interface CartProductModel {
  productId?: number;
  id?: string;
  name?: string;
  cartId?: number;
  productName?: string;
  price?: number;
  sellingPrice?: number;
  imageUrl?: string;
  productImage?: string;
  description?: string;
  category?: string;
  categoryName?: string;
  unit?: string;
  weight?: string;
  discount?: number;
  originalPrice?: number;
  quantity?: number;
  cartQuantity?: number;
}

type ProductCardProps = {
  product: CartProductModel;
  onPress?: (product: CartProductModel) => void;
  onAddToCart?: (product: CartProductModel) => void;
  onQuantityChange?: (product: CartProductModel, quantity: number) => void;
  badgeLabel?: string;
  discountPercent?: number;
  categoryLabel?: string;
};

export function ProductCard({
  product,
  onPress,
  onAddToCart,
  onQuantityChange,
  badgeLabel,
  discountPercent,
  categoryLabel,
}: ProductCardProps) {
  const [isImageLoading, setIsImageLoading] = useState(
    !!(product.imageUrl || product.productImage),
  );
  const [quantity, setQuantity] = useState(product.cartQuantity ?? 0);
  const { showErrorDialog, showSuccessDialog } = useMessageDialog();
  useEffect(() => {
    const qty = product.cartQuantity ?? 0;
    setQuantity(qty);
  }, [product.cartQuantity]);

  const name = product.productName ?? product.name ?? '';
  const price = product.sellingPrice ?? product.price ?? 0;
  const rawImage = product.productImage ?? product.imageUrl ?? '';
  const imageUri = rawImage.startsWith('http')
    ? rawImage
    : rawImage
    ? `${IMAGE_BASE_URL}${rawImage}`
    : '';
  const unit = product.unit ?? product.weight ?? '';
  const discount = discountPercent ?? product.discount ?? 0;
  const originalPrice = product.originalPrice;
  const category =
    categoryLabel ?? product.categoryName ?? product.category ?? '';

  const displayPrice = price;
  const showOriginalPrice =
    discount > 0 &&
    (originalPrice != null || (originalPrice == null && price > 0));
  const computedOriginalPrice =
    originalPrice ??
    (discount > 0 && price > 0 ? price / (1 - discount / 100) : null);

  const handleIncrement = async () => {
    const newQty = quantity + 1;
    const cartModel = await convertProductToCartModel(product, newQty ?? 1);
    const itemRes = await cartSyncService.addOrUpdate(cartModel, newQty);
    if (itemRes.status) {
      Toast.show({
        type: 'success',
        text1: itemRes.message,
      });
      await cartStore.getState().loadFromDB();
      setQuantity(newQty);
      onQuantityChange?.({ ...product, cartQuantity: newQty }, newQty);
    } else {
      showErrorDialog('Add Product in Cart', itemRes.message);
    }
  };

  const handleDecrement = async () => {
    const newQty = Math.max(0, quantity - 1);
    const cartModel = await convertProductToCartModel(product, newQty);

    if (newQty === 0) {
      const res = await cartSyncService.removeCartProduct(
        cartModel.cartId ?? 0,
        cartModel.productId ?? 0,
      );
      if (res.status) {
        await cartStore.getState().loadFromDB();
        setQuantity(0);
        onQuantityChange?.({ ...product, cartQuantity: 0 }, 0);
        Toast.show({
          type: 'success',
          text1: res.message,
        });
      } else {
        showErrorDialog('Remove Product', res.message);
      }
      return;
    }

    const itemRes = await cartSyncService.addOrUpdate(cartModel, newQty);
    if (itemRes.status) {
      await cartStore.getState().loadFromDB();
      setQuantity(newQty);
      onQuantityChange?.({ ...product, cartQuantity: newQty }, newQty);
      Toast.show({
        type: 'success',
        text1: itemRes.message,
      });
    } else {
      showErrorDialog('Update Product Quantity', itemRes.message);
    }
  };
  const convertProductToCartModel = async (
    product: CartProductModel,
    newQuantity: number,
  ): Promise<CartResponseModel> => {
    const userId = await sessionStore.getState().user?.uid;
    const pCartId =
      (await cartStore.getState().getCartId(product.productId ?? 0)) ?? 0;
    const cartModel: CartResponseModel = {
      id: 0,
      cartId: pCartId ?? 0,
      productId: product.productId ?? 0,
      quantity: newQuantity ?? 1,
      userId: userId ?? 0,
      status: 1,
      createdAt: String(Date.now()),
      modifiedAt: Date.now().toString(),
    };

    return cartModel;
  };
  const handleAddPress = async () => {
    const cartModel = await convertProductToCartModel(product, 1);
    const itemRes = await cartSyncService.addOrUpdate(cartModel, 1);
    if (itemRes.status) {
      Toast.show({
        type: 'success',
        text1: itemRes.message,
      });
      if (itemRes.cartId != 0) {
        product.cartId = itemRes.cartId;
        console.log('CartId Updated..', itemRes.cartId);
      }

      await cartStore.getState().loadFromDB();
      setQuantity(1);
      onQuantityChange?.({ ...product, cartQuantity: 1 }, 1);
      onAddToCart?.(product);
    } else {
      showErrorDialog('Update Product Quantity', itemRes.message);
    }
  };

  const showQuantitySelector = quantity > 0;

  return (
    <Pressable style={styles.card} onPress={() => onPress?.(product)}>
      <View style={styles.imageWrapper}>
        {(badgeLabel || discount > 0) && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {badgeLabel ?? `${Math.round(discount)}% OFF`}
            </Text>
          </View>
        )}
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
                <ActivityIndicator size="small" color={theme.colors.primary} />
              </View>
            )}
          </>
        ) : (
          <View style={styles.placeholderImage} />
        )}
      </View>

      <View style={styles.details}>
        <View style={styles.infoBlock}>
          {category ? (
            <Text style={styles.category} numberOfLines={1}>
              {category.toUpperCase()}
            </Text>
          ) : null}
          <Text style={styles.name} numberOfLines={2}>
            {name}
          </Text>
          {unit ? (
            <Text style={styles.unit} numberOfLines={1}>
              {unit}
            </Text>
          ) : null}
          <View style={styles.priceRow}>
            <Text style={styles.price}>
              {RUPEE_SIGN + displayPrice.toFixed(2)}
            </Text>
            {showOriginalPrice && computedOriginalPrice != null && (
              <Text style={styles.originalPrice}>
                {RUPEE_SIGN + computedOriginalPrice.toFixed(2)}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.actionRow}>
          {showQuantitySelector ? (
            <QuantitySelector
              quantity={quantity}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
              min={0}
            />
          ) : onAddToCart || onQuantityChange ? (
            <Pressable style={styles.addButton} onPress={handleAddPress}>
              <Text style={styles.addButtonText}>+</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.base,
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
    padding: theme.spacing[2],
    minHeight: 120,
  },
  image: {
    width: '100%',
    height: 120,
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderImage: {
    width: '100%',
    height: 120,
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
  details: {
    flex: 1,
    justifyContent: 'space-between',
  },
  infoBlock: {
    flex: 1,
  },
  category: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.primary,
    letterSpacing: 0.5,
    marginBottom: theme.spacing[1],
  },
  name: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.gray800,
  },
  unit: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.gray500,
    marginTop: theme.spacing[1],
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: theme.spacing[2],
    marginTop: theme.spacing[2],
  },
  price: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.gray800,
  },
  originalPrice: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.gray500,
    textDecorationLine: 'line-through',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginTop: theme.spacing[3],
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing[1],
    shadowColor: theme.colors.black,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  addButtonText: {
    color: theme.colors.textOnPrimary,
    fontSize: theme.typography.fontSize['2xl'],
    lineHeight: 26,
    fontWeight: theme.typography.fontWeight.bold,
  },
});
