"use client";

import { useParams } from "next/navigation";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

const SubCategoryPage = () => {
  const trpc = useTRPC();
  const params = useParams();
  const { data: products } = useQuery(
    trpc.products.getMany.queryOptions({
      categorySlug: params.subCategory as string,
    })
  );
  return (
    <>
      <div>{JSON.stringify(products)}</div>
    </>
  );
};

export default SubCategoryPage;
