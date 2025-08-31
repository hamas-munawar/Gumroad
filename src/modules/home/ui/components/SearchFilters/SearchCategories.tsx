"use client";
import type { CategoryForComponent } from "@/types/trpc";

import Link from "next/link";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";

import CategoriesSidebar from "./CategoriesSidebar";
import SearchCategory from "./SearchCategory";

const SearchCategories = ({
  visibleCategories,
  hidden = false,
}: {
  visibleCategories: CategoryForComponent[];
  hidden?: boolean;
}) => {
  const { categories } = useParams();
  const selectedCategory = (categories && categories[0]) || undefined;

  return (
    <div className="relative flex gap-2" aria-label="Browse categories">
      <div className="gap-2 hidden md:flex">
        <div className="flex flex-col items-center">
          <Button
            asChild
            variant={"elevated"}
            className={`bg-transparent border-transparent hover:border-black hover:bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:-translate-y-[4px] group-hover:-translate-x-[4px] rounded-full ${selectedCategory === undefined && "border-black bg-white"}`}
          >
            <Link href={"/"}>All</Link>
          </Button>
        </div>
        {visibleCategories.map((category) => (
          <SearchCategory key={category.slug} category={category} />
        ))}
      </div>

      {hidden && (
        <CategoriesSidebar
          title={"View All"}
          selectedCategory={
            (selectedCategory !== undefined &&
              visibleCategories.find((cat) => cat.slug === selectedCategory) ===
                undefined) ||
            false
          }
        />
      )}
    </div>
  );
};

export default SearchCategories;
