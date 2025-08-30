"use client";
import { usePriceFilter } from '@/modules/hooks/usePriceFilter';

import PriceFilter from './PriceFilter';

const ProductFilters = () => {
  const [priceFilter, setPriceFilter] = usePriceFilter();

  const hasAnyFilters = Object.entries(priceFilter).some(([, value]) => {
    if (typeof value === "string") {
      return value !== "";
    }
    return value !== null;
  });

  return (
    <div>
      <div className="flex justify-between border-b p-4 cursor-default">
        <h4 className="text-xl font-medium">Filters</h4>
        {hasAnyFilters && (
          <button
            className="underline text-lg cursor-pointer"
            onClick={() => setPriceFilter(null)}
          >
            Clear
          </button>
        )}
      </div>
      <div>
        <PriceFilter />
      </div>
    </div>
  );
};

export default ProductFilters;
