import { SearchParams } from "nuqs/server";
import { Suspense } from "react";

import { DEFAULT_PRODUCTS_LIMIT } from "@/constants";
import ProductFilters from "@/modules/productFilters/ui/ProductFilters";
import SortFilter from "@/modules/productFilters/ui/SortFilter";
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
    <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-10 px-4 lg:px-20 py-6 gap-8 place-content-start">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between col-span-full">
        <div className="text-2xl font-medium">Curated for you</div>
        <div>
          <SortFilter />
        </div>
      </div>
      <div className="md:col-span-2 lg:col-span-2 border border-black rounded-md self-start">
        <ProductFilters />
      </div>
      <div className="md:col-span-3 lg:col-span-8">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense fallback={<ProductsListSkeleton />}>
            <ProductsList />
          </Suspense>
        </HydrationBoundary>
      </div>
    </div>
  );
};

export default TenantPage;
