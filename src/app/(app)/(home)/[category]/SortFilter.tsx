"use client";
import { Button } from "@/components/ui/button";
import { useProductFilters } from "@/modules/hooks/useProductFilters";

const sortTypes = [
  { label: "Curated", slug: "curated" },
  { label: "Trending", slug: "trending" },
  { label: "Hot & New", slug: "hot_and_new" },
];

const SortFilter = () => {
  const [productFilters, setProductFilters] = useProductFilters();

  const handleSortSelection = (
    key: keyof typeof productFilters,
    value: string
  ) => {
    setProductFilters({ ...productFilters, [key]: value });
  };

  return (
    <div className="flex gap-2">
      {sortTypes.map((sort) => (
        <Button
          key={sort.slug}
          className={`bg-transparent text-black rounded-full border-transparent hover:border-black hover:bg-white ${productFilters.sort === sort.slug && "border-black bg-white"}`}
          onClick={() => handleSortSelection("sort", sort.slug)}
        >
          {sort.label}
        </Button>
      ))}
    </div>
  );
};

export default SortFilter;
