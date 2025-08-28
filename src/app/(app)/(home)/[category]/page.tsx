"use client";

import { useParams } from "next/navigation";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

const CategoryPage = () => {
  const params = useParams();
  const trpc = useTRPC();
  const rawCategory = Array.isArray(params.category)
    ? params.category[0]
    : params.category;
  const { data: products } = useSuspenseQuery(
    trpc.products.getMany.queryOptions({
      categorySlug: rawCategory,
    })
  );

  return <div>{JSON.stringify(products, null, 2)}</div>;
};

export default CategoryPage;
