import { SearchParams } from "nuqs/server";
import { Suspense } from "react";

import { DEFAULT_PRODUCTS_LIMIT } from "@/constants";
import ProductsList, {
  ProductsListSkeleton,
} from "@/modules/products/ui/ProductsList";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const TenantPage = async ({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{ tenantSlug: string }>;
  searchParams: Promise<SearchParams>;
}>) => {
  const { tenantSlug } = await params;

  const productFilters = await searchParams;

  const queryClient = getQueryClient();
  await queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({
      tenantSlug,
      ...productFilters,
      limit: DEFAULT_PRODUCTS_LIMIT,
    })
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ProductsListSkeleton />}>
        <ProductsList />
      </Suspense>
    </HydrationBoundary>
  );
};

export default TenantPage;
