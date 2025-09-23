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
  params: Promise<{ productId: string; tenantSlug: string }>;
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { productId, tenantSlug } = await params;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    trpc.products.getOne.queryOptions<
      Product & { image: { url: string } } & {
        tenant: Tenant & { image: { url: string } };
      } & { isPurchased: boolean } & {
        averageRating: number;
        reviewCount: number;
        reviewDistribution: Record<number, number>;
      }
    >({ productId })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div>Loading...</div>}>
        <ProductDetailView productId={productId} tenantSlug={tenantSlug} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default ProductPage;
