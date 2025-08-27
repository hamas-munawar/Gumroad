import Link from "next/link";

import type { CategoryForComponent } from "@/types/trpc";

interface Props {
  category: CategoryForComponent;
}

const SubCategories = ({ category }: Props) => {
  return (
    <div
      style={category.color ? { background: category.color } : undefined}
      className="hidden group-hover:flex flex-col border-black border overflow-hidden rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white"
    >
      {category.subcategories?.map((subcategory) => (
        <Link
          href={`/${category.slug}/${subcategory.slug}`}
          key={subcategory.slug}
          className="p-2 hover:bg-black hover:text-white underline"
        >
          {subcategory.name}
        </Link>
      ))}
    </div>
  );
};

export default SubCategories;
