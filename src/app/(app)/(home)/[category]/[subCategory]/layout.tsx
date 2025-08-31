import { Suspense } from "react";

import { loadSearchParams } from "@/modules/products/searchParams";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import type { SearchParams } from "nuqs/server";
export default async function SubCategoryLayout({
  children,
  params,
  searchParams,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ subCategory: string }>;
  searchParams: Promise<SearchParams>;
}>) {
  const { subCategory } = await params;
  const productFilters = await loadSearchParams(searchParams);

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({
      categorySlug: subCategory,
      ...productFilters,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
    </HydrationBoundary>
  );
}
