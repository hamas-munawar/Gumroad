import { useCartStore } from '../store/useCartStore';

export const useCart = (tenantSlug: string) => {
  const {
    getCartByTenant,
    addProduct,
    removeProduct,
    clearCart,
    clearAllCarts,
  } = useCartStore();

  const productIds = getCartByTenant(tenantSlug);

  const toggleProduct = (productId: string) => {
    if (hasProduct(productId)) {
      removeProduct(tenantSlug, productId);
    } else {
      addProduct(tenantSlug, productId);
    }
  };

  const hasProduct = (productId: string) => {
    return productIds.includes(productId);
  };

  return {
    productIds,
    totalItems: productIds.length,
    toggleProduct,
    addProduct: (productId: string) => addProduct(tenantSlug, productId),
    removeProduct: (productId: string) => removeProduct(tenantSlug, productId),
    hasProduct,
    clearCart: () => clearCart(tenantSlug),
    clearAllCarts,
  };
};
