import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface TenantCart {
  productIds: string[];
}
interface CartState {
  tenantCarts: Record<string, TenantCart>;
  addProduct: (tenantSlug: string, productId: string) => void;
  removeProduct: (tenantSlug: string, productId: string) => void;
  clearCart: (tenantSlug: string) => void;
  clearAllCarts: () => void;
  getCartByTenant: (tenantSlug: string) => string[];
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      tenantCarts: {},
      addProduct: (tenantSlug, productId) =>
        set((state) => ({
          ...state,
          tenantCarts: {
            ...state.tenantCarts,
            [tenantSlug]: {
              productIds: [
                ...(state.tenantCarts[tenantSlug]?.productIds || []),
                productId,
              ],
            },
          },
        })),
      removeProduct: (tenantSlug, productId) => {
        set((state) => {
          const currentCart = state.tenantCarts[tenantSlug];
          if (!currentCart) return state;

          const updatedProductIds = currentCart.productIds.filter(
            (id) => id !== productId
          );

          return {
            ...state,
            tenantCarts: {
              ...state.tenantCarts,
              [tenantSlug]: { productIds: updatedProductIds },
            },
          };
        });
      },
      clearCart: (tenantSlug) => {
        set((state) => ({
          ...state,
          tenantCarts: {
            ...state.tenantCarts,
            [tenantSlug]: { productIds: [] },
          },
        }));
      },
      clearAllCarts: () => {
        set({ tenantCarts: {} });
      },
      getCartByTenant: (tenantSlug) => {
        const cart = get().tenantCarts[tenantSlug];
        return cart ? cart.productIds : [];
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
