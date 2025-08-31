import { Suspense } from "react";

import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import ProductsList from "./ProductsList";

const CategoryPage = async ({
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ categories: string[] }>;
}>) => {
  const { categories } = await params;
  const categorySlug = categories[categories.length - 1];
  console.log(categorySlug);

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({
      categorySlug,
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
