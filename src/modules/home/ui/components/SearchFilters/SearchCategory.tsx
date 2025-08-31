"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

import SubCategories from "./SubCategories";

import type { CategoryForComponent } from "@/types/trpc";
interface Props {
  category: CategoryForComponent;
}

const SearchCategory = ({ category }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const { categories } = useParams();
  const selectedCategory = (categories && categories[0]) || undefined;

  const [left, setLeft] = useState(0);

  useEffect(() => {
    const rect = ref.current?.getBoundingClientRect();
    if (rect && rect.right > window.innerWidth) {
      const newLeft = window.innerWidth - rect.right - 16;
      setLeft(newLeft);
    }
  }, []);

  return (
    <div className="group relative">
      <div className="flex flex-col items-center">
        <Button
          asChild
          variant={"elevated"}
          className={`bg-transparent border-transparent group-hover:border-black group-hover:bg-white group-hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:-translate-y-[4px] group-hover:-translate-x-[4px] rounded-full ${selectedCategory === category.slug && "border-black bg-white"}`}
        >
          <Link
            href={category.slug === "all" ? "/" : `/${category.slug}`}
            aria-current={
              selectedCategory === category.slug ? "page" : undefined
            }
          >
            {category.name}
          </Link>
        </Button>
        {category?.subcategories && category.subcategories.length > 0 && (
          <div className="group-hover:border-b-black border-b-transparent border-x-transparent border-x-8 border-b-8 border-t-transparent w-4" />
        )}
      </div>
      <div style={{ left }} className={`absolute top-[100%] w-60`} ref={ref}>
        {category?.subcategories && category.subcategories.length > 0 && (
          <SubCategories category={category} key={category.slug} />
        )}
      </div>
    </div>
  );
};

export default SearchCategory;
