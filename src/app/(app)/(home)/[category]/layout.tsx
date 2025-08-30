import { Suspense } from "react";

import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import PriceFilter from "./PriceFilter";

export default async function CategoryLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ category: string }>;
}>) {
  const { category } = await params;

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({ categorySlug: category })
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-10 p-6 gap-8">
      <div className="md:col-span-2 lg:col-span-2 border border-black rounded-md">
        <div className="flex justify-between border-b p-4 cursor-default">
          <h4 className="text-xl font-medium">Filters</h4>
          <button className="underline text-lg cursor-pointer">Clear</button>
        </div>
        <div>
          <PriceFilter />
        </div>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<div>Loading...</div>}>
          <div className="md:col-span-3 lg:col-span-8">{children}</div>
        </Suspense>
      </HydrationBoundary>
    </div>
  );
}
