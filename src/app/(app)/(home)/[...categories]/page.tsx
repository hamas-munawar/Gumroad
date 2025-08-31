import { SearchParams } from "nuqs";
import { Suspense } from "react";

import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import ProductsList from "./ProductsList";

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
  await queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({
      categorySlug,
      ...productFilters,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div>Loading...</div>}>
        <ProductsList />
      </Suspense>
    </HydrationBoundary>
  );
};

export default CategoryPage;
