"use client";
import { ChevronRight } from 'lucide-react';

import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Label } from '@/components/ui/label';
import { useTRPC } from '@/trpc/client';
import { useInfiniteQuery } from '@tanstack/react-query';

const TagsFilter = () => {
  const trpc = useTRPC();
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      trpc.tags.getMany.infiniteQueryOptions(
        {
          limit: 2,
        },
        {
          getNextPageParam: (lastPage) => {
            return lastPage.docs.length > 0 ? lastPage.nextPage : undefined;
          },
        }
      )
    );

  return (
    <Collapsible className="rounded-md overflow-hidden w-full">
      <CollapsibleTrigger className="w-full cursor-pointer group flex items-center justify-between text-lg font-medium p-4">
        <span>Tags</span>
        <ChevronRight className="h-5 w-5 text-black transition-transform duration-200 group-data-[state=open]:rotate-90" />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 pb-4 flex flex-col gap-2 mb-2">
        {data?.pages.map((page) =>
          page.docs.map((tag) => (
            <div className="flex items-center justify-between" key={tag.id}>
              <Label htmlFor="checkbox" className="text-base">
                {tag.name}
              </Label>
              W
              <Checkbox id="checkbox" />
            </div>
          ))
        )}
        {hasNextPage && (
          <button
            disabled={isFetchingNextPage}
            onClick={() => fetchNextPage()}
            className="underline font-medium justify-start text-start disabled:opacity-50"
          >
            Load more...
          </button>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default TagsFilter;
