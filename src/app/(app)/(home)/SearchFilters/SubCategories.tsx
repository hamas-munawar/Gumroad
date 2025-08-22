import Link from "next/link";
import type { CategoryForComponent } from "@/types/trpc";

interface Props {
  categories: CategoryForComponent;
}

const SubCategories = ({ categories }: Props) => {
  return (
    <div
      style={categories.color ? { background: categories.color } : undefined}
      className="hidden group-hover:flex flex-col border-black border overflow-hidden rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white"
    >
      {categories.subcategories?.map((subcategory) => (
           <Link
             href={`/categories/${subcategory.slug}`}
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
