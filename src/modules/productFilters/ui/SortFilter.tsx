"use client";
import { Button } from "@/components/ui/button";
import {
  sortTypes as allowedSortTypes,
  useProductFilters,
} from "@/modules/hooks/useProductFilters";

const sortOptions: {
  label: string;
  slug: (typeof allowedSortTypes)[number];
}[] = [
  { label: "Curated", slug: "curated" },
  { label: "Trending", slug: "trending" },
  { label: "Hot & New", slug: "hot_and_new" },
];

const SortFilter = () => {
  const [productFilters, setProductFilters] = useProductFilters();

  const handleSortSelection = (
    key: "sort",
    value: (typeof allowedSortTypes)[number]
  ) => {
    setProductFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex gap-2">
      {sortOptions.map((sort) => (
        <Button
          key={sort.slug}
          className={`bg-transparent text-black rounded-full border-transparent hover:border-black hover:bg-white ${productFilters.sort === sort.slug ? "border-black bg-white" : ""}`}
          onClick={() => handleSortSelection("sort", sort.slug)}
        >
          {sort.label}
        </Button>
      ))}
    </div>
  );
};

export default SortFilter;
