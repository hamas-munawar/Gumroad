import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs';

export const useProductFilters = () => {
  return useQueryStates(
    {
      minPrice: parseAsString,
      maxPrice: parseAsString,
      tags: parseAsArrayOf(parseAsString),
    },
    {
      clearOnDefault: true,
    }
  );
};
