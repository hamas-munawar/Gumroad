"use client";

import { useParams } from 'next/navigation';

import { useTRPC } from '@/trpc/client';
import { useQuery } from '@tanstack/react-query';

const CategoryPage = () => {
  const trpc = useTRPC();
  const params = useParams();
  const { data } = useQuery(
    trpc.products.getMany.queryOptions({
      categorySlug: params.category as string,
    })
  );

  return <div>{JSON.stringify(data, null, 2)}</div>;
};

export default CategoryPage;
