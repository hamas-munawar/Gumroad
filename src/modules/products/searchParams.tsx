import {
  createLoader,
  parseAsArrayOf,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";

export const sortTypes = ["curated", "trending", "hot_and_new"] as const;

export const params = {
  minPrice: parseAsString,
  maxPrice: parseAsString,
  tags: parseAsArrayOf(parseAsString),
  sort: parseAsStringLiteral(sortTypes),
};

export const loadSearchParams = createLoader(params);
