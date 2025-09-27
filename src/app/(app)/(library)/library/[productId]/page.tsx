import { Suspense } from "react";

import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import Footer from "./Footer";
import Navbar from "./Navbar";
import ProductView, { ProductViewSkeleton } from "./ProductView";

interface Props {
  params: Promise<{ productId: string }>;
}

const page = async ({ params }: Props) => {
  const { productId } = await params;

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    trpc.library.getOne.queryOptions({
      productId,
    })
  );

  await queryClient.prefetchQuery(
    trpc.reviews.getOne.queryOptions({
      productId,
    })
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense fallback={<ProductViewSkeleton />}>
            <ProductView productId={productId} />
          </Suspense>
        </HydrationBoundary>
      </div>
      <Footer />
    </div>
  );
};

export default page;
