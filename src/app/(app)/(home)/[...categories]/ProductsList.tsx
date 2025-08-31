"use client";

import { useParams } from "next/navigation";

import { useProductFilters } from "@/modules/hooks/useProductFilters";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

import ProductCard from "./ProductCard";

const ProductsList = () => {
  const [productFilters] = useProductFilters();

  const params = useParams();
  let categorySlug: string | undefined;
  if (params.categories)
    if (params.categories.length > 1) {
      categorySlug = params.categories[1];
    } else {
      categorySlug = params.categories[0];
    }

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
