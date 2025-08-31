import { parseAsString, useQueryStates } from "nuqs";

export const usePriceFilter = () => {
  return useQueryStates(
    {
      minPrice: parseAsString,
      maxPrice: parseAsString,
    },
    {
      clearOnDefault: true,
    }
  );
};
