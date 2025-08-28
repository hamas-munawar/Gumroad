"use client";
import { useParams } from 'next/navigation';

import { useTRPC } from '@/trpc/client';
import { useQuery } from '@tanstack/react-query';

const SubCategoryPage = () => {
  const trpc = useTRPC();
  const params = useParams();
  const { data } = useQuery(
    trpc.products.getMany.queryOptions({
      categorySlug: params.subCategory as string,
    })
  );
  return (
    <>
      <div>{JSON.stringify(data)}</div>
    </>
  );
};

export default SubCategoryPage;
