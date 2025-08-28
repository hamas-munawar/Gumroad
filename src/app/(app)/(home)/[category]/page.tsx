"use client";

import { useParams } from "next/navigation";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

const CategoryPage = () => {
  const params = useParams();
  const trpc = useTRPC();
  const { data: products } = useSuspenseQuery(
    trpc.products.getMany.queryOptions({
      categorySlug: params.category as string,
    })
  );

  return <div>{JSON.stringify(products, null, 2)}</div>;
};

export default CategoryPage;
