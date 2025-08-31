"use client";

import { useParams } from "next/navigation";

import { useProductFilters } from "@/modules/hooks/useProductFilters";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

import ProductCard from "../ProductCard";

const SubCategoryPage = () => {
  const [productFilters] = useProductFilters();
  const trpc = useTRPC();
  const params = useParams();
  const rawSubCategory = Array.isArray(params.subCategory)
    ? params.subCategory[0]
    : params.subCategory;
  const { data: products } = useSuspenseQuery(
    trpc.products.getMany.queryOptions({
      categorySlug: rawSubCategory,
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

export default SubCategoryPage;
