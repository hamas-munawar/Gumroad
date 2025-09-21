"use client";

import { InboxIcon } from "lucide-react";
import { PaginatedDocs } from "payload";

import { Button } from "@/components/ui/button";
import { DEFAULT_PRODUCTS_LIMIT } from "@/constants";
import { Order, Product, Tenant } from "@/payload-types";
import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";

import ProductCard, { ProductCardSkeleton } from "./ProductCard";

const ProductsList = () => {
  const trpc = useTRPC();
  const {
    data: orders,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useSuspenseInfiniteQuery(
    trpc.library.getProducts.infiniteQueryOptions<
      PaginatedDocs<
        Order & {
          product: Product & { image?: { url: string } } & {
            tenant: Tenant & { image?: { url: string } };
          };
        }
      >
    >(
      {
        limit: DEFAULT_PRODUCTS_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => {
          const next = lastPage?.nextPage;
          return typeof next === "number" ? next : undefined;
        },
      }
    )
  );

  if (!orders || orders.pages[0]?.docs.length === 0) {
    return (
      <div className="border border-black border-dashed w-full flex flex-col justify-center items-center gap-4 rounded-lg bg-white p-8">
        <InboxIcon />
        <p className="text-base font-medium">No Purchased products.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-4 flex-wrap justify-center md:justify-start">
        {orders?.pages
          .flatMap((page) => page!.docs)
          .map((order) => (
            <ProductCard product={order.product} key={order.id} />
          ))}
      </div>
      {hasNextPage && (
        <Button
          variant={"elevated"}
          className="font-medium text-base bg-white disabled:opacity-50 self-center md:self-start"
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
      <div className="flex gap-4 flex-wrap justify-center md:justify-start">
        {[...Array(DEFAULT_PRODUCTS_LIMIT)].map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};
