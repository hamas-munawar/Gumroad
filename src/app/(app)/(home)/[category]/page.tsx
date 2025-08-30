"use client";

import { useParams } from 'next/navigation';

import { usePriceFilter } from '@/modules/hooks/usePriceFilter';
import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';

const CategoryPage = () => {
  const params = useParams();

  const [priceFilter] = usePriceFilter();

  const trpc = useTRPC();
  const rawCategory = Array.isArray(params.category)
    ? params.category[0]
    : params.category;
  const { data: products } = useSuspenseQuery(
    trpc.products.getMany.queryOptions({
      categorySlug: rawCategory,
      minPrice: priceFilter.minPrice?.toString(),
      maxPrice: priceFilter.maxPrice?.toString(),
    })
  );

  return <div>{JSON.stringify(products, null, 2)}</div>;
};

export default CategoryPage;
