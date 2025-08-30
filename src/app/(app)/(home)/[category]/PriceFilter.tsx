"use client";
import { ChevronRight } from 'lucide-react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePriceFilter } from '@/modules/hooks/usePriceFilter';

const PriceFilter = () => {
  const [priceFilter, setPriceFilter] = usePriceFilter();

  const handlePriceChange = (key: keyof typeof priceFilter, value: string) => {
    setPriceFilter({ ...priceFilter, [key]: value });
  };

  return (
    <Collapsible className="rounded-md overflow-hidden w-full">
      <CollapsibleTrigger className="w-full cursor-pointer group flex items-center justify-between text-lg font-medium p-4">
        <span>Price</span>
        <ChevronRight className="h-5 w-5 text-black transition-transform duration-200 group-data-[state=open]:rotate-90" />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-6 pb-4 flex flex-col gap-2 mb-2">
        <div className="flex flex-col gap-1 border-0">
          <Label className="text-base font-medium">Min Price</Label>
          <Input
            type="number"
            placeholder="$0"
            value={parseInt(priceFilter.minPrice!)}
            onChange={(e) =>
              handlePriceChange("minPrice", e.currentTarget.value)
            }
          />
        </div>
        <div className="flex flex-col gap-1 border-0">
          <Label className="text-base font-medium">Max Price</Label>
          <Input
            type="number"
            placeholder="$∞"
            value={parseInt(priceFilter.maxPrice!)}
            onChange={(e) =>
              handlePriceChange("maxPrice", e.currentTarget.value)
            }
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default PriceFilter;
