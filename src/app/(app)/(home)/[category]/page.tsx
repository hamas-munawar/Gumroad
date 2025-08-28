"use client";

import { useParams } from "next/navigation";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

const CategoryPage = () => {
  const params = useParams();
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.products.getMany.queryOptions({ category: params.category as string })
  );

  return <div>{JSON.stringify(data)}</div>;
};

export default CategoryPage;
