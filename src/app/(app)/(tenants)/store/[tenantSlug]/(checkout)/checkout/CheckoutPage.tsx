"use client";

import { InboxIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

import { useCart } from "@/modules/checkout/hooks/useCart";
import { useCheckoutStates } from "@/modules/checkout/hooks/useCheckoutStates";
import { Product, Tenant } from "@/payload-types";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";

import CheckoutItemsList from "./CheckoutItemsList";
import CheckoutSidebar from "./CheckoutSidebar";

const CheckoutPage = ({ tenantSlug }: { tenantSlug: string }) => {
  const router = useRouter();
  const [states, setStates] = useCheckoutStates();
  const { productIds, clearCart } = useCart(tenantSlug);

  const trpc = useTRPC();
  const {
    data: products,
    isLoading,
    error,
  } = useQuery(
    trpc.checkout.getProducts.queryOptions<
      (Product & { image?: { url: string } } & {
        tenant: Tenant & { image?: { url: string } };
      })[]
    >({ productIds }, { enabled: productIds.length > 0 })
  );

  const purchase = useMutation(
    trpc.checkout.purchase.mutationOptions({
      onMutate: () => {
        setStates({ success: false, cancel: false });
      },
      onSuccess: (data) => {
        if (data.url) {
          window.location.href = data.url;
        } else {
          toast.error("Failed to initiate checkout. Please try again.");
        }
      },
      onError: (error) => {
        if (error.data?.code === "UNAUTHORIZED") {
          toast.error("You must be logged in to make a purchase.");
          router.push("/sign-in");
        }
        toast.error(
          error.message || "An error occurred. Please try again later."
        );
      },
    })
  );

  useEffect(() => {
    if (states.success) {
      setStates({ success: false, cancel: false });
      clearCart();
      // TODO: Invalidate Library
      router.push("/library");
    }
  }, [states.success, clearCart, router, setStates]);

  useEffect(() => {
    if (error?.data?.code === "NOT_FOUND") {
      clearCart();
      toast.warning(
        "Some products in your cart are no longer available. Cart cleared."
      );
    }
  }, [error, clearCart]);

  if (isLoading) {
    return (
      <div className="border border-black border-dashed w-full flex flex-col justify-center items-center gap-4 rounded-lg bg-white p-8">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="border border-black border-dashed w-full flex flex-col justify-center items-center gap-4 rounded-lg bg-white p-8">
        <InboxIcon />
        <p className="text-base font-medium">No products in Your Cart.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
      <div className="col-span-4">
        <CheckoutItemsList products={products} tenantSlug={tenantSlug} />
      </div>
      <div className="col-span-3 border rounded-md overflow-hidden bg-white self-start">
        <CheckoutSidebar
          products={products}
          onPurchase={() => purchase.mutate({ tenantSlug, productIds })}
          disabled={purchase.isPending}
          isCanceled={states.cancel}
        />
      </div>
    </div>
  );
};

export default CheckoutPage;
