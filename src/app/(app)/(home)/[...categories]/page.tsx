import { SearchParams } from "nuqs";
import { Suspense } from "react";

import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import ProductsList, { ProductsListSkeleton } from "./ProductsList";

const CategoryPage = async ({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{ categories: string[] }>;
  searchParams: Promise<SearchParams>;
}>) => {
  const { categories } = await params;
  const categorySlug = categories[categories.length - 1];

  const productFilters = await searchParams;

  const queryClient = getQueryClient();
  await queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({
      categorySlug,
      ...productFilters,
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

export default CategoryPage;
