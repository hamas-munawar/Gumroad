"use client";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Category } from "@/payload-types";
import { ChevronRight, ListFilter } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import SearchCategory from "./SearchCategory";

interface Props {
  categories: Category[];
}

const SearchCategories = ({ categories }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCategories, setVisibleCategories] = useState<Category[]>([]);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const updateVisibleCategories = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const containerWidth = container.offsetWidth;
      setContainerWidth(containerWidth); // Approximate width calculation for each category button
      // Based on typical button padding, text length, and gap

      const estimatedCategoryWidth = 120; // Base width for average category name
      const gapWidth = 8; // gap-2 = 8px

      let totalWidth = 0;
      const visible: Category[] = [];

      for (const category of categories) {
        // Estimate width based on category name length
        const textWidth = category.name.length * 8; // Approximate 8px per character
        const categoryWidth = Math.max(estimatedCategoryWidth, textWidth + 32); // 32px for padding

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
  }, [categories]);

  const hiddenCount = Math.max(categories.length - visibleCategories.length, 0);

  return (
    <div
      className="relative flex gap-2 w-full py-2 items-center"
      ref={containerRef}
      aria-label="Browse categories"
    >
      <div className="gap-2 hidden md:flex">
        {visibleCategories.map((category) => (
          <SearchCategory key={category.slug} category={category} />
        ))}
      </div>

      {hiddenCount > 0 && (
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant={"elevated"}
              className="flex items-center gap-2 border-transparent hover:border-black group-hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:-translate-y-[4px] group-hover:-translate-x-[4px] rounded-full"
              aria-label="View all categories"
              title="View all categories"
            >
              <span>View All</span> <ListFilter className="size-4" />
            </Button>
          </SheetTrigger>

          <SheetContent className="flex w-[400px] flex-col gap-6 sm:w-[540px]">
            <SheetHeader>
              <SheetTitle className="text-3xl font-bold">
                Browse Categories
              </SheetTitle>
            </SheetHeader>

            <ScrollArea className="h-[90%] pr-4">
              <div className="flex flex-col gap-2">
                {categories.map(
                  (category) =>
                    category.slug !== "all" && (
                      <Collapsible
                        style={{
                          backgroundColor: category.color || "#e5e7eb",
                        }}
                        key={category.slug}
                        className="rounded-md overflow-hidden ml-2"
                      >
                        <CollapsibleTrigger className="cursor-pointer group flex w-full items-center justify-between p-4 text-lg font-medium transition-colors ">
                          <span className="flex items-center gap-3">
                            {category.name}
                          </span>

                          {/* {category.subcategories &&
                          (category.subcategories as any).length > 0 && (
                            <span className="ml-auto mr-3 inline-flex items-center justify-center rounded-full bg-neutral-200 text-neutral-700 text-xs h-5 min-w-5 px-2">
                              {(category.subcategories as any).length}
                            </span>
                          )} */}

                          {category.subcategories &&
                            (category.subcategories as any).length > 0 && (
                              <ChevronRight className="h-5 w-5 text-gray-500 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                            )}
                        </CollapsibleTrigger>

                        {category.subcategories &&
                          (category.subcategories as any).length > 0 && (
                            <CollapsibleContent>
                              <div
                                style={{
                                  backgroundColor: category.color || "#f9fafb",
                                }}
                                className="flex flex-col gap-1 border-0 p-2"
                              >
                                {(category.subcategories as any).map(
                                  (subCategory: any) => (
                                    <Link
                                      href={`/categories/${subCategory.slug}`}
                                      key={subCategory.slug}
                                      className="cursor-pointer block rounded px-2 py-2 text-base font-medium text-gray-800 transition-colors hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                                    >
                                      {subCategory.name}
                                    </Link>
                                  )
                                )}
                              </div>
                            </CollapsibleContent>
                          )}
                      </Collapsible>
                    )
                )}
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
};

export default SearchCategories;
