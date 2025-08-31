"use client";
import { ChevronRight } from 'lucide-react';

import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Label } from '@/components/ui/label';
import { useProductFilters } from '@/modules/hooks/useProductFilters';
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

  const [productFilters, setProductFilters] = useProductFilters();
  const handleTagCheck = (key: keyof typeof productFilters, tag: string) => {
    if (productFilters.tags?.includes(tag))
      setProductFilters({
        ...productFilters,
        [key]: productFilters.tags.filter((t) => t !== tag) || [],
      });
    else {
      setProductFilters({
        ...productFilters,
        [key]: [...(productFilters.tags || []), tag],
      });
    }
  };

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
              <Label htmlFor={tag.name} className="text-base">
                {tag.name}
              </Label>
              <Checkbox
                id={tag.name}
                onCheckedChange={() => handleTagCheck("tags", tag.name)}
              />
            </div>
          ))
        )}
        {hasNextPage && (
          <button
            disabled={isFetchingNextPage}
            onClick={() => fetchNextPage()}
            className="underline font-medium justify-start text-start disabled:opacity-50 cursor-pointer"
          >
            Load more...
          </button>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default TagsFilter;
