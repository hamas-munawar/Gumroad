import { Suspense } from "react";

import { DEFAULT_PRODUCTS_LIMIT } from "@/constants";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import Footer from "./Footer";
import Navbar from "./Navbar";
import ProductsList, { ProductsListSkeleton } from "./ProductsList";

const LibraryPage = async () => {
  const queryClient = getQueryClient();
  await queryClient.prefetchInfiniteQuery(
    trpc.library.getMany.infiniteQueryOptions({
      limit: DEFAULT_PRODUCTS_LIMIT,
    })
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <header className="bg-[#f4f4f0] font-medium px-4 lg:px-20 py-4">
        <h4 className="font-medium text-3xl">Library</h4>
        <p className="text-sm text-muted-foreground">
          Items you have purchased will appear here.
        </p>
      </header>
      <div className="flex-1 px-4 lg:px-20 py-4">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense fallback={<ProductsListSkeleton />}>
            <ProductsList />
          </Suspense>
        </HydrationBoundary>
      </div>
      <Footer />
    </div>
  );
};

export default LibraryPage;
