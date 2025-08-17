"use client";
import { Category } from "@/payload-types";
import { useEffect, useRef, useState } from "react";
import SearchCategory from "./SearchCategory";

interface Props {
  categories: Category[]
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
      setContainerWidth(containerWidth);

      // Approximate width calculation for each category button
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

  return (
    <div className="flex gap-2 w-full py-2" ref={containerRef}>
      {visibleCategories.map((category) => (
        <SearchCategory key={category.slug} category={category} />
      ))}
      {visibleCategories.length < categories.length && (
        <div className="flex items-center text-gray-500 text-sm">
          +{categories.length - visibleCategories.length} more
        </div>
      )}
    </div>
  );
};

export default SearchCategories;
