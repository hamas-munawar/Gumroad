import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface TenantCart {
  productIds: string[];
}
interface CartState {
  tenantCarts: Record<string, TenantCart>;
  addProduct: (tenantSlug: string, productId: string) => void;
  removeProduct: (tenantSlug: string, productId: string) => void;
  clearCart: (tenantSlug: string) => void;
  clearAllCarts: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
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
        set((state) => ({
          tenantCarts: {
            ...state.tenantCarts,
            [tenantSlug]: {
              productIds:
                state.tenantCarts[tenantSlug]?.productIds.filter(
                  (id) => id !== productId
                ) || [],
            },
          },
        }));
      },
      clearCart: (tenantSlug) => {
        set((state) => ({
          tenantCarts: {
            ...state.tenantCarts,
            [tenantSlug]: { productIds: [] },
          },
        }));
      },
      clearAllCarts: () => {
        set({ tenantCarts: {} });
      },
    }),
    {
      name: "cart-storage",
      version: 1,
      storage: createJSONStorage(() => {
        try {
          return localStorage;
        } catch {
          return undefined as unknown as Storage; // fallback to in-memory (no persist)
        }
      }),
    }
  )
);
