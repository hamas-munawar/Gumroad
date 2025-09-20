import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";

import { useCartStore } from "../store/useCartStore";

export const useCart = (tenantSlug: string) => {
  const addProduct = useCartStore((state) => state.addProduct);
  const removeProduct = useCartStore((state) => state.removeProduct);
  const clearCart = useCartStore((state) => state.clearCart);
  const clearAllCarts = useCartStore((state) => state.clearAllCarts);

  const productIds = useCartStore(
    useShallow((state) => state.tenantCarts[tenantSlug]?.productIds || [])
  );

  const hasProduct = useCallback(
    (productId: string) => productIds.includes(productId),
    [productIds]
  );

  const toggleProduct = useCallback(
    (productId: string) => {
      if (hasProduct(productId)) removeProduct(tenantSlug, productId);
      else addProduct(tenantSlug, productId);
    },
    [addProduct, removeProduct, tenantSlug, hasProduct]
  );

  const clearTenantCart = useCallback(
    () => clearCart(tenantSlug),
    [clearCart, tenantSlug]
  );

  const handleAddProduct = useCallback(
    (productId: string) => addProduct(tenantSlug, productId),
    [addProduct, tenantSlug]
  );

  const handleRemoveProduct = useCallback(
    (productId: string) => removeProduct(tenantSlug, productId),
    [removeProduct, tenantSlug]
  );

  return {
    productIds,
    totalItems: productIds.length,
    toggleProduct,
    addProduct: handleAddProduct,
    removeProduct: handleRemoveProduct,
    hasProduct,
    clearCart: clearTenantCart,
    clearAllCarts,
  };
};
