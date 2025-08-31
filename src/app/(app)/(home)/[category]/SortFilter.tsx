import { Button } from "@/components/ui/button";

const sortTypes = [
  { label: "Curated", slug: "curated" },
  { label: "Trending", slug: "trending" },
  { label: "Hot & New", slug: "hot_and_new" },
];

const SortFilter = () => {
  return (
    <div className="flex gap-2">
      {sortTypes.map((sort) => (
        <Button
          key={sort.slug}
          className={`bg-transparent text-black rounded-full border-transparent hover:border-black hover:bg-white`}
        >
          {sort.label}
        </Button>
      ))}
    </div>
  );
};

export default SortFilter;
