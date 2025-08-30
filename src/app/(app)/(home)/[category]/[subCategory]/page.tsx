"use client";

import { useParams } from 'next/navigation';

import { usePriceFilter } from '@/modules/hooks/usePriceFilter';
import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';

const SubCategoryPage = () => {
  const [priceFilter] = usePriceFilter();
  const trpc = useTRPC();
  const params = useParams();
  const rawSubCategory = Array.isArray(params.subCategory)
    ? params.subCategory[0]
    : params.subCategory;
  const { data: products } = useSuspenseQuery(
    trpc.products.getMany.queryOptions({
      categorySlug: rawSubCategory,
      minPrice: priceFilter.minPrice?.toString(),
      maxPrice: priceFilter.maxPrice?.toString(),
    })
  );
  return (
    <>
      <div>{JSON.stringify(products)}</div>
    </>
  );
};

export default SubCategoryPage;
