import type { Category } from "@/payload-types";
import Link from "next/link";

interface Props {
  categories: {
    color?: string | null;
    subcategories?:
      | Pick<Category, "slug" | "name">[]
      | { docs?: Pick<Category, "slug" | "name">[] };
  };
}

const SubCategories = ({ categories }: Props) => {
  return (
    <div
      style={categories.color ? { background: categories.color } : undefined}
      className="hidden group-hover:flex flex-col border-black border overflow-hidden rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white"
    >
      {(Array.isArray(categories.subcategories)
        ? categories.subcategories
        : (categories.subcategories?.docs ?? [])
      )?.map((category) => (
        <Link
          href={`/categories/${category.slug}`}
          key={category.slug}
          className="p-2 hover:bg-black hover:text-white"
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
};

export default SubCategories;
