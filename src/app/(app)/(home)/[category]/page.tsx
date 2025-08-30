"use client";

import { useParams } from 'next/navigation';

import { usePriceFilter } from '@/modules/hooks/usePriceFilter';
import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';

import ProductCard from './ProductCard';

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
      minPrice: priceFilter.minPrice?.trim() || undefined,
      maxPrice: priceFilter.maxPrice?.trim() || undefined,
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

export default CategoryPage;
