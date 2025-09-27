import { ShoppingCartIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn, generateTenantSubdomain } from "@/lib/utils";
import { useCart } from "@/modules/checkout/hooks/useCart";

interface CheckoutButtonProps {
  tenantSlug: string;
  hideIfEmpty?: boolean;
  className?: string;
}

const CheckoutButton = ({
  tenantSlug,
  hideIfEmpty: hide = true,
  className,
}: CheckoutButtonProps) => {
  const { totalItems } = useCart(tenantSlug);

  if (hide && totalItems === 0) {
    return null;
  }

  return (
    <Button variant={"elevated"} asChild className="px-4 py-1 bg-white">
      <Link
        href={`${generateTenantSubdomain(tenantSlug)}/checkout`}
        className={cn(
          "flex items-center justify-center font-medium",
          className
        )}
      >
        <ShoppingCartIcon className="text-black" />
        {totalItems > 0 && totalItems}
      </Link>
    </Button>
  );
};

export default CheckoutButton;

export const CheckoutButtonSkeleton = () => {
  return (
    <Button disabled variant={"elevated"} asChild className="px-4 py-1">
      <div className={cn("flex items-center justify-center font-medium")}>
        <ShoppingCartIcon className="text-black" />
      </div>
    </Button>
  );
};
