import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  FlatList,
  ActivityIndicator,
  ListRenderItem,
} from 'react-native';
import {
  useNavigation,
  useFocusEffect,
  type CompositeNavigationProp,
} from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from './CartScreen.Style';
import { theme } from '../../theme';
import { IMAGE_BASE_URL, RUPEE_SIGN, SUCCESS } from '../../utils/constants';
import { QuantitySelector } from '../../components/ui/QuantitySelector';
import { AppHeader, usePullToRefresh } from '../../components/ui';
import { cartStore } from '../../store/cartStore';
import { CartResponseModel } from '../../data/models/CartModel';
import { ProductModel } from '../../data/models/ProductModel';
import { sessionStore } from '../../store/sessionStore';
import { cartSyncService } from './cartSyncService';
import { useMessageDialog } from '../../components/context/MessageDialogContext';
import Toast from 'react-native-toast-message';
import type {
  CartStackParamList,
  MainTabParamList,
} from '../../navigation/types';
import { cartController } from './controller';
import { CartProductModel } from '../home/components/ProductCard';
import { AddressResponseModel } from '../../data/models/AddressModel';
import { appPrefs } from '../../data/repositories/AppPrefRepository';
import { toSafeNumber } from '../../utils/utils';
import { DeliveryChargesModel } from '../../data/models/DeliveryChargesModel';
import { useLoading } from '../../components/context/LoadingContext';
import { paymentService } from './paymentService';
import { paymentErrorHandler } from '../payment/paymentErrorHandler';
import { RemoteImage } from '../../components/ui/RemoteImage/RemoteImage';

type Line = CartResponseModel & { product?: ProductModel };

/** API may return an array or a wrapper object with a list field. */
function normalizeCartProductRows(data: unknown): CartProductModel[] {
  if (data == null) return [];
  if (Array.isArray(data)) return data as CartProductModel[];
  if (typeof data === 'object') {
    const d = data as Record<string, unknown>;
    const listKeys = [
      'cartList',
      'cartDetailList',
      'cartProducts',
      'products',
      'items',
      'list',
    ];
    for (const k of listKeys) {
      const v = d[k];
      if (Array.isArray(v)) return v as CartProductModel[];
    }
    if (d.productId != null) {
      return [data as CartProductModel];
    }
  }
  return [];
}

function cartRowToProductModel(row: CartProductModel): ProductModel {
  return {
    productId: row.productId,
    productName: row.productName ?? row.name,
    sellingPrice: row.sellingPrice ?? row.price,
    price: row.price ?? row.sellingPrice,
    productImage: row.productImage ?? row.imageUrl,
    unit: row.unit ?? row.weight,
    description: row.description,
    categoryName: row.categoryName ?? row.category,
    discount: row.discount,
    originalPrice: row.originalPrice,
    cartId: row.cartId,
    cartQuantity: row.cartQuantity ?? row.quantity,
  };
}

function apiRowToLine(row: CartProductModel): Line {
  const uid = sessionStore.getState().user?.uid ?? 0;
  const product = cartRowToProductModel(row);
  return {
    id: 0,
    cartId: row.cartId ?? 0,
    productId: row.productId ?? 0,
    quantity: row.cartQuantity ?? row.quantity ?? 1,
    userId: uid,
    status: 1,
    createdAt: '',
    modifiedAt: '',
    product,
  };
}

async function fetchCartLinesFromApi(): Promise<Line[]> {
  const res = await cartController.fetchUserCart();
  if (!res || res.status !== SUCCESS || res.data == null) {
    return [];
  }
  const rows = normalizeCartProductRows(res.data);
  return rows.filter(r => (r.productId ?? 0) > 0).map(apiRowToLine);
}

type CartScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<CartStackParamList, 'CartMain'>,
  BottomTabNavigationProp<MainTabParamList>
>;

export function CartScreen() {
  const navigation = useNavigation<CartScreenNavigationProp>();
  const { showErrorDialog } = useMessageDialog();
  const [cartLines, setCartLines] = useState<Line[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [cartError, setCartError] = useState<string | null>(null);
  const [isAddressResolving, setIsAddressResolving] = useState(false);
  const [addressList, setAddressList] = useState<AddressResponseModel[]>([]);
  const [deliveryRate, setDeliveryRate] = useState<DeliveryChargesModel | null>(
    null,
  );
  const { show, hide } = useLoading();
  const [smallCartMinCharge, setSmallCartMinCharge] = useState(0);
  const [smallCartAmount, setSmallCartAmount] = useState(0);
  const [selectedAddressId, setSelectedAddressId] = useState(0);
  const [selectedAddress, setSelectedAddress] =
    useState<string>('No address set yet');
  const refetchCartFromApi = useCallback(async () => {
    const next = await fetchCartLinesFromApi();
    setCartLines(next);
  }, []);

  useEffect(() => {
    if (!listLoading && !isAddressResolving) {
      return;
    }

    show('Loading cart...');
    return () => {
      hide();
    };
  }, [hide, isAddressResolving, listLoading, show]);

  useFocusEffect(
    React.useCallback(() => {
      updateAddressUI();
    }, [addressList]),
  );

  const handleCheckout = async () => {
    if (selectedAddressId <= 0) {
      showErrorDialog('Delivery Address', 'Please select delivery address');
      return;
    }

    const deliveryChargeAmount = deliveryRate?.amount ?? 0;
    const totalAmount =
      subtotal +
      deliveryChargeAmount +
      (subtotal < smallCartMinCharge ? smallCartAmount : 0);

    if (totalAmount < 1) {
      showErrorDialog(
        'Invalid Amount',
        'Order total must be at least ₹1 to proceed with payment.',
      );
      return;
    }

    const gatewayError = await paymentService.ensureGatewayConfigured();
    if (gatewayError) {
      showErrorDialog('Payment Unavailable', gatewayError);
      return;
    }

    show('Saving order...');
    const saveOrderResult = await cartController.saveOrderBeforePayment({
      cartLines: cartLines,
      subtotal,
      smartCartCharge: subtotal < smallCartMinCharge ? smallCartAmount : 0,
      deliveryCharge: deliveryChargeAmount,
      grandTotal: totalAmount,
      deliveryAddressId: selectedAddressId,
    });
    hide();

    if (saveOrderResult.status !== SUCCESS || !saveOrderResult.data) {
      const message =
        saveOrderResult.message ||
        'We could not create your order. Please try again in a moment.';

      navigation.navigate('PaymentFailure', {
        title: 'Order Not Saved',
        message,
        errorCode: 'ORDER_SAVE_FAILED',
        orderId: saveOrderResult.data?.orderId,
        orderKey: saveOrderResult.data?.orderKey,
        amount: totalAmount,
      });
      return;
    }
    const savedOrder = saveOrderResult.data;

    let paymentAttempts = 0;
    const maxRetries = 2;

    const executePayment = async () => {
      try {
        show('Initiating payment...');

        const userDetails = await paymentService.getUserDetailsForPayment();

        // When your API creates a Razorpay order, pass orderId from the response.
        // Do not send a client-made order_id — Razorpay shows "Something went wrong".
        const paymentResponse = await paymentService.initiatePayment({
          amount: totalAmount,
          email: userDetails.email,
          phone: userDetails.phone,
          userName: userDetails.userName,
          description: `Order for ${totalQty} items`,
        });

        hide();
        cartController.clearCart();

        navigation.navigate('PaymentSuccess', {
          paymentId: paymentResponse.razorpay_payment_id,
          orderId: savedOrder.orderId,
          orderKey: savedOrder.orderKey,
          amount: totalAmount,
        });
      } catch (error: any) {
        hide();
        // console.error('Payment error:', error);

        // Map error using error handler
        const mappedError = paymentErrorHandler.mapError(error);
        paymentErrorHandler.logError(mappedError);

        // Check if error is retryable and we haven't exceeded max retries
        if (
          paymentErrorHandler.isRetryable(mappedError.code) &&
          paymentAttempts < maxRetries
        ) {
          paymentAttempts++;
          // Show retry dialog
          showErrorDialog(
            'Payment Error',
            mappedError.message + '\n\nWould you like to retry?',
          );

          // Auto-retry after user acknowledges
          setTimeout(executePayment, 1500);
        } else {
          const errorTitle = paymentErrorHandler.getErrorTitle(
            mappedError.code,
          );
          navigation.navigate('PaymentFailure', {
            title: errorTitle,
            message: mappedError.message,
            errorCode: mappedError.code,
            orderId: savedOrder.orderId,
            orderKey: savedOrder.orderKey,
            amount: totalAmount,
            paymentId: error?.razorpay_payment_id,
          });
        }
      }
    };

    executePayment();
  };

  const updateAddressUI = useCallback(async () => {
    setIsAddressResolving(true);
    try {
      const prefAddressId = await appPrefs.get('selectedAddressId');
      setSelectedAddressId(prefAddressId);
      if (selectedAddressId >= 0) {
        const selectedAddressItem = addressList?.find(
          add => add.addressId === selectedAddressId,
        );

        if (selectedAddressItem) {
          const deliveryRateId = await cartController.findDeliveryRateId(
            toSafeNumber(selectedAddressItem.latitude ?? 0),
            toSafeNumber(selectedAddressItem.longtitude ?? 0),
          );

          if (deliveryRateId != null) {
            const deliveryRate = await cartController.fetchDeliveryCharge(
              deliveryRateId,
            );
            setDeliveryRate(deliveryRate);
          } else {
            setDeliveryRate(null);
          }

          setSelectedAddress(selectedAddressItem.mapAddress);
          return;
        }
      }

      setDeliveryRate(null);
      setSelectedAddress('No address set yet');
    } finally {
      setIsAddressResolving(false);
    }
  }, [addressList]);
  const totalQty = useMemo(
    () => cartLines.reduce((s, i) => s + (i.quantity ?? 0), 0),
    [cartLines],
  );

  const subtotal = useMemo(() => {
    let sum = 0;
    for (const line of cartLines) {
      const p = line.product;
      const unit = p?.sellingPrice ?? p?.price ?? 0;
      sum += unit * (line.quantity ?? 0);
    }
    return sum;
  }, [cartLines]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        setListLoading(true);
        setCartError(null);
        try {
          await cartController.loadAppConfig();
          const next = await fetchCartLinesFromApi();
          if (!cancelled) {
            if (!next || next.length === 0) {
              // Check if this is an error or just an empty cart
              const res = await cartController.fetchUserCart();
              if (res.status !== SUCCESS) {
                setCartError(
                  res.message || 'Failed to load cart. Please try again.',
                );
                console.error('[CartScreen] Cart API error:', res);
              } else {
                setCartLines(next);
                await cartStore.getState().loadFromDB();
              }
            } else {
              setCartLines(next);
              await cartStore.getState().loadFromDB();
            }
          }
          const addressListFromDB = await cartController.getAddressListFromDB();
          setAddressList(addressListFromDB);
          const smallCartChargeFromDB =
            await cartController.getSmallCartMinCharge();
          setSmallCartMinCharge(smallCartChargeFromDB);
          const smallCartAmountFromDB =
            await cartController.getSmallCartAmount();
          setSmallCartAmount(smallCartAmountFromDB);
        } catch (error) {
          if (!cancelled) {
            const errorMessage =
              error instanceof Error
                ? error.message
                : 'Failed to load cart. Please check your connection.';
            setCartError(errorMessage);
            console.error('[CartScreen] Error loading cart:', error);
          }
        } finally {
          if (!cancelled) setListLoading(false);
        }
      })();
      return () => {
        cancelled = true;
      };
    }, []),
  );

  const buildCartModel = useCallback(
    async (
      productId: number,
      qty: number,
      fallbackCartId: number,
    ): Promise<CartResponseModel> => {
      const userId = sessionStore.getState().user?.uid ?? 0;
      const pCartId =
        (await cartStore.getState().getCartId(productId)) ?? fallbackCartId;
      return {
        id: 0,
        cartId: pCartId,
        productId,
        quantity: qty,
        userId,
        status: 1,
        createdAt: String(Date.now()),
        modifiedAt: Date.now().toString(),
      };
    },
    [],
  );

  const onIncrement = async (line: Line) => {
    show('Updating cart...');
    try {
      const next = (line.quantity ?? 0) + 1;
      const cm = await buildCartModel(
        line.productId ?? 0,
        next,
        line.cartId ?? 0,
      );
      const res = await cartSyncService.addOrUpdate(cm, next);
      if (res.status) {
        Toast.show({ type: 'success', text1: res.message });
        await cartStore.getState().loadFromDB();
        await refetchCartFromApi();
      } else {
        showErrorDialog('Cart', res.message ?? 'Could not update quantity');
      }
    } finally {
      hide();
    }
  };

  const onDecrement = async (line: Line) => {
    show('Updating cart...');
    try {
      const next = Math.max(0, (line.quantity ?? 0) - 1);
      const pid = line.productId ?? 0;
      const cm = await buildCartModel(pid, next || 1, line.cartId ?? 0);

      if (next === 0) {
        const cartIdForRemove =
          cm.cartId && cm.cartId > 0 ? cm.cartId : line.cartId ?? 0;
        const res = await cartSyncService.removeCartProduct(
          cartIdForRemove,
          pid,
        );
        if (res.status) {
          Toast.show({ type: 'success', text1: res.message });
        } else {
          showErrorDialog('Cart', res.message ?? 'Could not remove item');
          return;
        }
      } else {
        const updateModel = await buildCartModel(pid, next, line.cartId ?? 0);
        const res = await cartSyncService.addOrUpdate(updateModel, next);
        if (res.status) {
          Toast.show({ type: 'success', text1: res.message });
        } else {
          showErrorDialog('Cart', res.message ?? 'Could not update quantity');
          return;
        }
      }

      await cartStore.getState().loadFromDB();
      await refetchCartFromApi();
    } finally {
      hide();
    }
  };

  const renderItem: ListRenderItem<Line> = ({ item }) => {
    const p = item.product;
    const name =
      p?.productName ??
      (item.productId ? `Product #${item.productId}` : 'Product');
    const meta = [p?.unit, p?.description].filter(Boolean).join(' · ') || '';
    const displayMeta = meta || ' ';
    const unitPrice = p?.sellingPrice ?? p?.price ?? 0;

    const rawImg = p?.productImage ?? '';
    const uri = rawImg.startsWith('http')
      ? rawImg
      : rawImg
      ? `${IMAGE_BASE_URL}${rawImg}`
      : '';

    return (
      <View style={styles.row}>
        <RemoteImage uri={uri} style={styles.thumb} resizeMode="contain" />
        <View style={styles.rowBody}>
          <Text style={styles.productName} numberOfLines={2}>
            {name}
          </Text>
          <Text style={styles.productMeta} numberOfLines={1}>
            {displayMeta}
          </Text>
          <Text style={styles.productPrice}>
            {RUPEE_SIGN}
            {unitPrice.toFixed(2)}
          </Text>
        </View>
        <View style={styles.qtyWrap}>
          <QuantitySelector
            quantity={item.quantity ?? 0}
            onIncrement={() => onIncrement(item)}
            onDecrement={() => onDecrement(item)}
            min={0}
          />
        </View>
      </View>
    );
  };

  const handlePullRefresh = useCallback(async () => {
    await refetchCartFromApi();
  }, [refetchCartFromApi]);

  const { refreshControl } = usePullToRefresh(handlePullRefresh);

  const handleRetryCart = useCallback(async () => {
    setListLoading(true);
    setCartError(null);
    try {
      await cartController.loadAppConfig();
      const next = await fetchCartLinesFromApi();
      setCartLines(next);
      await cartStore.getState().loadFromDB();

      const addressListFromDB = await cartController.getAddressListFromDB();
      setAddressList(addressListFromDB);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to load cart';
      setCartError(errorMessage);
      console.error('[CartScreen] Error retrying cart:', error);
    } finally {
      setListLoading(false);
    }
  }, []);

  const AddressHeader = (
    <View style={styles.addressCard}>
      <View style={styles.addressIconCircle}>
        <MaterialIcons
          name="location-on"
          size={26}
          color={theme.colors.primary}
        />
      </View>
      <View style={styles.addressTexts}>
        <Text style={styles.addressTitle}>Delivery Address</Text>
        <Text style={styles.addressSub}>{selectedAddress}</Text>
      </View>
      <Pressable
        hitSlop={8}
        onPress={() =>
          navigation.navigate('HomeTab', {
            screen: 'HomeDeliveryAddress',
          })
        }
      >
        <Text style={styles.addAddress}>Select Address</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <AppHeader
        title="Your Shopping Cart"
        onBackPress={() => navigation.navigate('HomeTab')}
      />

      <FlatList
        data={cartLines}
        keyExtractor={item => `${item.cartId ?? 0}-${item.productId ?? 0}`}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={refreshControl}
        ListHeaderComponent={<>{AddressHeader}</>}
        ListEmptyComponent={
          cartError ? (
            <View style={styles.errorContainer}>
              <MaterialIcons
                name="error-outline"
                size={48}
                color={theme.colors.error || '#d32f2f'}
              />
              <Text style={styles.errorText}>{cartError}</Text>
              <Pressable style={styles.retryBtn} onPress={handleRetryCart}>
                <MaterialIcons
                  name="refresh"
                  size={18}
                  color="white"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.retryText}>Retry</Text>
              </Pressable>
            </View>
          ) : listLoading ? (
            <View style={styles.hydratingFooter}>
              <ActivityIndicator color={theme.colors.primary} />
            </View>
          ) : (
            <Text style={styles.emptyText}>Your cart is empty</Text>
          )
        }
      />

      {!listLoading && !cartError && cartLines.length > 0 ? (
        <View style={styles.footer}>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Subtotal ({totalQty} {totalQty === 1 ? 'item' : 'items'})
            </Text>
            <Text style={styles.summaryValue}>
              {RUPEE_SIGN}
              {subtotal.toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              {deliveryRate?.amount ?? 0 > 0 ? 'Delivery Fee' : 'Free Delivery'}
            </Text>
            <Text style={[styles.summaryValue, styles.freeText]}>
              {deliveryRate?.amount ?? 0 > 0
                ? `${RUPEE_SIGN}${toSafeNumber(deliveryRate?.amount).toFixed(
                    2,
                  )}`
                : 'Free'}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Smart Cart Charges</Text>
            <Text style={styles.summaryValue}>
              {RUPEE_SIGN}
              {subtotal < smallCartMinCharge
                ? smallCartAmount.toFixed(2)
                : '0.00'}
            </Text>
          </View>
          <Text style={styles.errorLabel}>
            No small cart charge on orders above {RUPEE_SIGN}
            {smallCartMinCharge.toFixed(2)}
          </Text>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Price</Text>
            <Text style={styles.totalValue}>
              {RUPEE_SIGN}
              {(
                subtotal +
                (deliveryRate?.amount ?? 0) +
                (subtotal < smallCartMinCharge ? smallCartAmount : 0)
              ).toFixed(2)}
            </Text>
          </View>
          <Pressable style={styles.checkoutBtn} onPress={handleCheckout}>
            <Text style={styles.checkoutLabel}>Proceed to Checkout</Text>
            <MaterialIcons
              name="arrow-forward"
              size={22}
              color={theme.colors.textOnPrimary}
              style={{ marginLeft: theme.spacing[2] }}
            />
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}
