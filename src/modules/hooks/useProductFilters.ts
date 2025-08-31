import {
  parseAsArrayOf,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs";

export const sortTypes = ["curated", "trending", "hot_and_new"] as const;

export const useProductFilters = () => {
  return useQueryStates(
    {
      minPrice: parseAsString,
      maxPrice: parseAsString,
      tags: parseAsArrayOf(parseAsString),
      sort: parseAsStringLiteral(sortTypes),
    },
    {
      clearOnDefault: true,
    }
  );
};
