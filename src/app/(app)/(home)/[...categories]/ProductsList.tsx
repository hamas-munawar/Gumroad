"use client";

import { useParams } from "next/navigation";

import { useProductFilters } from "@/modules/hooks/useProductFilters";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

import ProductCard from "./ProductCard";

const ProductsList = () => {
  const [productFilters] = useProductFilters();

  const params = useParams<{ categories: string[] }>();
  const categorySlug = params.categories?.at(-1);

  const trpc = useTRPC();
  const { data: products } = useSuspenseQuery(
    trpc.products.getMany.queryOptions({
      categorySlug,
      ...productFilters,
    })
  );

  return (
    <div className="flex gap-4">
      {products?.map((product) => (
        <ProductCard product={product} key={product.id} />
      ))}
    </div>
  );
};

export default ProductsList;
