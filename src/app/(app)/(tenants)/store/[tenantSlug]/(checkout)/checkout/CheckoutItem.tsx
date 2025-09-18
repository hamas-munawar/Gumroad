import Image from 'next/image';
import Link from 'next/link';

import { cn, formatCurrency } from '@/lib/utils';
import { useCart } from '@/modules/checkout/hooks/useCart';
import { Product, Tenant } from '@/payload-types';

interface CheckoutItemProps {
  product: Product & { image: { url: string } } & {
    tenant: Tenant & { image: { url: string } };
  };
  isLast?: boolean;
  tenantSlug: string;
}

const CheckoutItem = ({ product, isLast, tenantSlug }: CheckoutItemProps) => {
  const cart = useCart(tenantSlug);

  return (
    <div
      className={cn(
        `grid grid-cols-[8.5rem_1fr_auto] gap-4 pr-4`,
        isLast ? "border-none" : "border-b"
      )}
    >
      <div className={"relative aspect-square h-full border-r"}>
        <Image
          src={product.image?.url || "/placeholder.png"}
          alt="image"
          fill
          className="object-cover"
        />
      </div>
      <div className="py-4 flex flex-col items-start gap-2">
        <Link
          href={`/store/${tenantSlug}/products/${product.id}`}
          className="text-lg font-medium underline"
        >
          {product.name}
        </Link>
        <Link href={`/store/${tenantSlug}`} className="underline text-base">
          <div className="flex items-center gap-2">
            <Image
              src={product.tenant.image.url || "/placeholder.png"}
              alt="Author"
              width={16}
              height={16}
              className="rounded-full border shrink-0 size-[16px] object-cover"
            />
            {product.tenant.username}
          </div>
        </Link>
      </div>
      <div className="py-4 flex flex-col justify-between items-end">
        <p className="text-base font-medium">
          {formatCurrency(product.price, "USD")}
        </p>
        <button
          className="text-base font-medium underline cursor-pointer"
          onClick={() => cart.removeProduct(product.id)}
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CheckoutItem;
