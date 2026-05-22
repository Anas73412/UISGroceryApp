type ProductWithCart = {
  productId?: number;
  cartQuantity?: number;
  cartId?: number;
};

type CartRow = {
  productId: number;
  quantity: number;
  cartId: number;
};

/** Applies local cart quantities onto product list items. */
export function mergeCartQuantitiesIntoProducts<T extends ProductWithCart>(
  products: T[],
  cartArr: CartRow[],
): void {
  const cartMap = new Map(
    cartArr.map(c => [
      c.productId,
      { quantity: c.quantity, cartId: c.cartId },
    ]),
  );

  for (const item of products) {
    const cartInfo = cartMap.get(item.productId ?? 0);
    item.cartQuantity = cartInfo?.quantity ?? 0;
    item.cartId = cartInfo?.cartId ?? 0;
  }
}
