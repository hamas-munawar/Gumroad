"use client";

import { InboxIcon } from "lucide-react";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useProductFilters } from "@/modules/hooks/useProductFilters";
import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";

import ProductCard, { ProductCardSkeleton } from "./ProductCard";

const ProductsList = () => {
  const [productFilters] = useProductFilters();

  const params = useParams<{ categories: string[] }>();
  const categorySlug = params.categories?.at(-1);

  const trpc = useTRPC();
  const {
    data: products,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useSuspenseInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions(
      {
        ...productFilters,
        categorySlug,
        limit: 1,
      },
      {
        getNextPageParam: (lastPage) => {
          return lastPage!.docs.length > 0 ? lastPage!.nextPage : undefined;
        },
      }
    )
  );

  if (!products || products.pages[0]?.docs.length === 0) {
    return (
      <div className="border border-black border-dashed w-full flex flex-col justify-center items-center gap-4 rounded-lg bg-white p-8">
        <InboxIcon />
        <p className="text-base font-medium">No products found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-4">
        {products?.pages
          .flatMap((page) => page!.docs)
          .map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
      </div>
      {hasNextPage && (
        <Button
          variant={"elevated"}
          className="font-medium text-base bg-white disabled:opacity-50 self-start"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          Load More
        </Button>
      )}
    </div>
  );
};

export default ProductsList;

export const ProductsListSkeleton = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-4">
        {[...Array(1)].map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};
