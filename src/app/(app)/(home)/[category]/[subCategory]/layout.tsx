import { Suspense } from "react";

import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function SubCategoryLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ subCategory: string }>;
}>) {
  const { subCategory } = await params;

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({
      categorySlug: subCategory,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
    </HydrationBoundary>
  );
}
