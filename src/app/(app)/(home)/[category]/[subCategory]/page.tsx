"use client";

import { useParams } from "next/navigation";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

const SubCategoryPage = () => {
  const trpc = useTRPC();
  const params = useParams();
  const rawSubCategory = Array.isArray(params.subCategory)
    ? params.subCategory[0]
    : params.subCategory;
  const { data: products } = useSuspenseQuery(
    trpc.products.getMany.queryOptions({
      categorySlug: rawSubCategory,
    })
  );
  return (
    <>
      <div>{JSON.stringify(products)}</div>
    </>
  );
};

export default SubCategoryPage;
