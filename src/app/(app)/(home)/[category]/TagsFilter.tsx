"use client";
import { ChevronRight } from 'lucide-react';

import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Label } from '@/components/ui/label';

const TagsFilter = () => {
  return (
    <Collapsible className="rounded-md overflow-hidden w-full">
      <CollapsibleTrigger className="w-full cursor-pointer group flex items-center justify-between text-lg font-medium p-4">
        <span>Tags</span>
        <ChevronRight className="h-5 w-5 text-black transition-transform duration-200 group-data-[state=open]:rotate-90" />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 pb-4 flex flex-col gap-2 mb-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="checkbox" className="text-base">
            Lorem
          </Label>
          <Checkbox id="checkbox" />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default TagsFilter;
