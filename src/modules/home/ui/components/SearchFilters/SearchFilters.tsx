"use client";

import { BookmarkCheckIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { CategoryForComponent } from "@/types/trpc";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

import CategoriesBreadcrumb from "./CategoriesBreadcrumb";
import SearchCategories from "./SearchCategories";
import SearchInput from "./SearchInput";

const SearchFilters = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCategories, setVisibleCategories] = useState<
    CategoryForComponent[]
  >([]);
  const [containerWidth, setContainerWidth] = useState(0);

  const trpc = useTRPC();
  const { data: data } = useSuspenseQuery(
    trpc.categories.getMany.queryOptions()
  );

  const { data: session } = useQuery(trpc.auth.session.queryOptions());

  const { categories } = useParams();
  const selectedCategory = data?.find(
    (cat) => categories && cat.slug === categories[0] && cat
  );

  useEffect(() => {
    const updateVisibleCategories = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const containerWidth = container.offsetWidth;
      setContainerWidth(containerWidth);

      const estimatedCategoryWidth = 120;
      const gapWidth = 8;

      let totalWidth = 130;
      const visible: CategoryForComponent[] = [];

      if (data)
        for (const category of data) {
          const textWidth = category.name.length * 8;
          const categoryWidth = Math.max(
            estimatedCategoryWidth,
            textWidth + 32
          );

          if (totalWidth + categoryWidth <= containerWidth) {
            visible.push(category);

            totalWidth += categoryWidth + gapWidth;
          } else {
            break;
          }
        }

      setVisibleCategories(visible);
    };

    updateVisibleCategories();

    const resizeObserver = new ResizeObserver(updateVisibleCategories);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [data]);

  const hiddenCount = Math.max(
    (data?.length || 0) - visibleCategories.length,
    0
  );

  return (
    <div
      className="flex md:flex-col items-center md:items-stretch gap-2 py-2 md:py-4 px-4 md:px-6"
      style={{ backgroundColor: selectedCategory?.color || "inherit" }}
    >
      <div ref={containerRef} className="hidden md:block" />
      <div className="flex-1 flex gap-2">
        <div className="flex-1">
          <SearchInput />
        </div>
        {session?.user && (
          <Button variant="elevated" asChild>
            <Link prefetch href="/library" className="flex items-center gap-2">
              <BookmarkCheckIcon />
              Library
            </Link>
          </Button>
        )}
      </div>
      <div>
        <SearchCategories
          visibleCategories={visibleCategories}
          hidden={hiddenCount > 0}
        />
      </div>
      <div className="hidden md:block">
        {selectedCategory && <CategoriesBreadcrumb />}
      </div>
    </div>
  );
};

export default SearchFilters;
