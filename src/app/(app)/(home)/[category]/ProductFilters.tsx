"use client";
import { useProductFilters } from '@/modules/hooks/useProductFilters';

import PriceFilter from './PriceFilter';
import TagsFilter from './TagsFilter';

const ProductFilters = () => {
  const [productFilters, setProductFilters] = useProductFilters();

  const hasAnyFilters =
    Boolean(productFilters.minPrice?.trim()) ||
    Boolean(productFilters.maxPrice?.trim());

  return (
    <div className="bg-white rounded-md">
      <div className="flex justify-between border-b p-4 cursor-default">
        <h4 className="text-xl font-medium">Filters</h4>
        {hasAnyFilters && (
          <button
            className="underline text-lg cursor-pointer"
            onClick={() =>
              setProductFilters({ minPrice: null, maxPrice: null })
            }
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
