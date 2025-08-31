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
      minPrice: parseAsString.withDefault(""),
      maxPrice: parseAsString.withDefault(""),
      tags: parseAsArrayOf(parseAsString).withDefault([]),
      sort: parseAsStringLiteral(sortTypes).withDefault("curated"),
    },
    {
      clearOnDefault: true,
    }
  );
};
