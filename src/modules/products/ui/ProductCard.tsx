import { StarIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import {
    Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import ProductPrice from '@/modules/components/ProductPrice';
import { Product, Tenant } from '@/payload-types';

interface Props {
  product: Product & { image?: { url: string } } & {
    tenant: Tenant & { image?: { url: string } };
  };
}

const ProductCard = ({ product }: Props) => {
  return (
    <Card className="w-full rounded-md p-0 overflow-hidden gap-0 max-w-xs hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ">
      <CardHeader className="p-0">
        <div className="relative aspect-square border-b w-full ">
          <Image
            src={product.image?.url || "/placeholder.png"}
            fill
            className="object-cover"
            alt={"Product Image"}
          />
        </div>
      </CardHeader>
      <CardContent className="border-b p-4 text-black flex flex-col gap-2">
        <Link href={`/store/${product.tenant.slug}/products/${product.id}`}>
          <CardTitle className="text-2xl font-medium">{product.name}</CardTitle>
        </Link>
        <CardDescription className="flex flex-col gap-2 text-black text-base">
          <div className="flex items-center gap-2">
            {product.tenant.image?.url && (
              <Image
                src={product.tenant.image?.url}
                alt="Author"
                width={16}
                height={16}
                className="rounded-full border shrink-0 size-[16px] object-cover"
              />
            )}
            <Link
              href={"/store/" + product.tenant.slug}
              className="underline text-lg"
            >
              {product.tenant.username}
            </Link>
          </div>
          <div className="flex gap-2">
            <StarIcon className="size-5 fill-black stroke-0" /> 3 (5)
          </div>
        </CardDescription>
      </CardContent>
      <CardFooter className="p-4 m-0">
        <ProductPrice amount={product.price} />
      </CardFooter>
    </Card>
  );
};

export default ProductCard;

export const ProductCardSkeleton = () => {
  return (
    <Card className="w-full rounded-md p-0 overflow-hidden gap-0 max-w-xs border-none ">
      <CardHeader className="p-0">
        <Skeleton className="relative aspect-square w-full" />
      </CardHeader>
      <CardContent className="p-4  flex flex-col gap-2">
        <Skeleton className="h-8 w-3/4 mb-2 rounded-md" />
        <CardDescription className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Skeleton className="rounded-full shrink-0 size-[16px]" />
            <Skeleton className="h-4 w-20 rounded-md" />
          </div>
          <Skeleton className="h-5 w-16 rounded-md" />
        </CardDescription>
      </CardContent>
      <CardFooter className="p-4 m-0">
        <Skeleton className="h-6 w-20 rounded-md" />
      </CardFooter>
    </Card>
  );
};
