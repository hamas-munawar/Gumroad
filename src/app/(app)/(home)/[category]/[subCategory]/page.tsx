"use client";

import { useParams } from 'next/navigation';

import { usePriceFilter } from '@/modules/hooks/usePriceFilter';
import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';

import ProductCard from '../ProductCard';

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

export default SubCategoryPage;
