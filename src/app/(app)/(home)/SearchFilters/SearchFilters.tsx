"use client";

import { useParams } from 'next/navigation';

import { useTRPC } from '@/trpc/client';
import { useQuery } from '@tanstack/react-query';

import SearchCategories from './SearchCategories';
import SearchInput from './SearchInput';

const SearchFilters = () => {
  const trpc = useTRPC();
  const { data: categories } = useQuery(trpc.categories.getMany.queryOptions());
  const { category } = useParams();

  const selectedCategory = categories?.find((cat) => cat.slug === category);

  return (
    <div
      className="flex md:flex-col items-center md:items-stretch gap-2 py-2 md:py-4 px-4 md:px-6 lg:pt-4 lg:pb-2"
      style={{ backgroundColor: selectedCategory?.color || "inherit" }}
    >
      <div className="flex-1">
        <SearchInput />
      </div>
      <div>
        <SearchCategories />
      </div>
      {/* <div>{selectedCategory?.name}</div> */}
    </div>
  );
};

export default SearchFilters;
