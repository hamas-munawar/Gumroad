import { Suspense } from "react";

import { loadSearchParams } from "@/modules/products/searchParams";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import ProductFilters from "./ProductFilters";
import SortFilter from "./SortFilter";

import type { SearchParams } from "nuqs/server";
export default async function CategoryLayout({
  children,
  params,
  searchParams,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ category: string }>;
  searchParams: Promise<SearchParams>;
}>) {
  const { category } = await params;

  const productFilters = await loadSearchParams(searchParams);

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({
      categorySlug: category,
      ...productFilters,
    })
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-10 p-6 gap-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between col-span-full">
        <div className="text-2xl font-medium">Curated for you</div>
        <div>
          <SortFilter />
        </div>
      </div>
      <div className="md:col-span-2 lg:col-span-2 border border-black rounded-md">
        <ProductFilters />
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<div>Loading...</div>}>
          <div className="md:col-span-3 lg:col-span-8">{children}</div>
        </Suspense>
      </HydrationBoundary>
    </div>
  );
}
