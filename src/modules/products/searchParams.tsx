import {
  createLoader,
  parseAsArrayOf,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";

export const sortTypes = ["curated", "trending", "hot_and_new"] as const;

export const params = {
  minPrice: parseAsString.withDefault(""),
  maxPrice: parseAsString.withDefault(""),
  tags: parseAsArrayOf(parseAsString).withDefault([]),
  sort: parseAsStringLiteral(sortTypes).withDefault("curated"),
};

export const loadSearchParams = createLoader(params);
