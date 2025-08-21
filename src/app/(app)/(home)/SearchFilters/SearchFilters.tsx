import SearchCategories from "./SearchCategories";
import SearchInput from "./SearchInput";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Suspense } from "react";

const SearchFilters = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.categories.getMany.queryOptions(),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
    <div className="flex md:flex-col items-center md:items-stretch gap-2 py-4 px-2 lg:pt-4 lg:pb-2">
      <div className="flex-1">
        <SearchInput />
      </div>
      <div>
      <Suspense fallback={<div>Loading...</div>}>
        <SearchCategories />
        </Suspense>
      </div>
    </div>
    </HydrationBoundary>
  );
};

export default SearchFilters;
