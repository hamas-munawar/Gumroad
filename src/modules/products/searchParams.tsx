import { createLoader, parseAsArrayOf, parseAsString } from "nuqs/server";

export const params = {
  minPrice: parseAsString,
  maxPrice: parseAsString,
  tags: parseAsArrayOf(parseAsString),
};

export const loadSearchParams = createLoader(params);
