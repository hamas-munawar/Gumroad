"use client";

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCart } from '@/modules/checkout/hooks/useCart';

interface CartButtonProps {
  productId: string;
  tenantSlug: string;
}

const CartButton = ({ tenantSlug, productId }: CartButtonProps) => {
  const cart = useCart(tenantSlug);

  return (
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
