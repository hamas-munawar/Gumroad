"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/modules/checkout/hooks/useCart";

interface CartButtonProps {
  productId: string;
  tenantSlug: string;
  isPurchased?: boolean;
}

const CartButton = ({
  tenantSlug,
  productId,
  isPurchased,
}: CartButtonProps) => {
  const cart = useCart(tenantSlug);

  return (
    <>
      {isPurchased ? (
        <Button asChild variant="elevated" className={cn("flex-1 bg-white")}>
          <Link href="/library">View In Library</Link>
        </Button>
      ) : (
        <Button
          variant={"elevated"}
          className={cn(
            "flex-1 bg-pink-400",
            cart.hasProduct(productId) && "bg-white"
          )}
          onClick={() => cart.toggleProduct(productId)}
        >
          {cart.hasProduct(productId) ? "Remove from Cart" : "Add to Cart"}
        </Button>
      )}
    </>
  );
};

export default CartButton;

export const CartButtonSkeleton = () => {
  return (
    <Button disabled variant={"elevated"} className={cn("flex-1 bg-gray-100")}>
      Add to Cart
    </Button>
  );
};
