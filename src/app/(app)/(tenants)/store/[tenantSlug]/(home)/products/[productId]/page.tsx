import { Suspense } from "react";

import { Product, Tenant } from "@/payload-types";
import { trpc } from "@/trpc/server";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import ProductDetailView from "./ProductDetailView";

interface ProductPageProps {
  params: Promise<{ productId: string }>;
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { productId } = await params;
  console.log(productId);

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    trpc.products.getOne.queryOptions<
      Product & { image: { url: string } } & {
        tenant: Tenant & { image: { url: string } };
      }
    >({ productId })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div>Loading...</div>}>
        <ProductDetailView />
      </Suspense>
    </HydrationBoundary>
  );
};

export default ProductPage;
