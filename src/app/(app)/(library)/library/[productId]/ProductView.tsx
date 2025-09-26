"use client";
import { Product } from "@/payload-types";
import { useTRPC } from "@/trpc/client";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { useSuspenseQuery } from "@tanstack/react-query";

import ReviewSidebar, { ReviewSidebarSkeleton } from "./ReviewSidebar";

interface Props {
  productId: string;
}

const ProductView = ({ productId }: Props) => {
  const trpc = useTRPC();
  const { data: order } = useSuspenseQuery(
    trpc.library.getOne.queryOptions({ productId })
  );
  const { product } =
    typeof order?.docs[0] === "string"
      ? ({} as Product & { product: Product })
      : (order?.docs[0] as { product: Product });

  return (
    <div>
      <header className="bg-[#f4f4f0] font-medium px-4 lg:px-20 py-4">
        <h4 className="font-medium text-3xl">{product?.name}</h4>
      </header>
      <section className="px-4 lg:px-20 py-4 grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-16">
        <div className="lg:col-span-2">
          <div className="p-4 bg-white rounded-md border gap-4">
            <ReviewSidebar productId={productId} />
          </div>
        </div>
        <div className="lg:col-span-5">
          {product.content ? (
            <RichText data={product.content} />
          ) : (
            <p className="font-medium italic text-muted-foreground">
              No Special Content
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductView;

export const ProductViewSkeleton = () => {
  return (
    <div>
      <header className="bg-[#f4f4f0] font-medium px-4 lg:px-20 py-4">
        <h4 className="font-medium text-3xl"></h4>
      </header>
      <section className="px-4 lg:px-20 py-4 grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-16">
        <div className="lg:col-span-2">
          <div className="p-4 bg-white rounded-md border gap-4">
            <ReviewSidebarSkeleton />
          </div>
        </div>
        <div className="lg:col-span-5">
          <div className="h-6 w-1/2 bg-muted rounded animate-pulse mb-4" />
          <div className="h-4 w-full bg-muted rounded animate-pulse mb-2" />
          <div className="h-4 w-full bg-muted rounded animate-pulse mb-2" />
        </div>
      </section>
    </div>
  );
};
