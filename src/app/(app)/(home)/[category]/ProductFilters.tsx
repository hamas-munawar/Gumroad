"use client";
import { usePriceFilter } from '@/modules/hooks/usePriceFilter';

import PriceFilter from './PriceFilter';
import TagsFilter from './TagsFilter';

const ProductFilters = () => {
  const [priceFilter, setPriceFilter] = usePriceFilter();

  const hasAnyFilters =
    Boolean(priceFilter.minPrice?.trim()) ||
    Boolean(priceFilter.maxPrice?.trim());

  return (
    <div className="bg-white rounded-md">
      <div className="flex justify-between border-b p-4 cursor-default">
        <h4 className="text-xl font-medium">Filters</h4>
        {hasAnyFilters && (
          <button
            className="underline text-lg cursor-pointer"
            onClick={() => setPriceFilter({ minPrice: null, maxPrice: null })}
          >
            Clear
          </button>
        )}
      </div>
      <div className="border-b">
        <PriceFilter />
      </div>
      <div>
        <TagsFilter />
      </div>
    </div>
  );
};

export default ProductFilters;
