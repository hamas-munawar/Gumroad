import type { Category } from "@/payload-types";
import Link from "next/link";
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";

interface Props {
  categories: any;
}

const SubCategories = ({ categories }: Props) => {
  return (
    <div
      style={categories.color ? { background: categories.color } : undefined}
      className="hidden group-hover:flex flex-col border-black border overflow-hidden rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white"
    >
      {categories.subcategories?.map((subcategory: { slug: Key | null | undefined; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => {
        return (
          <Link
            href={`/categories/${subcategory.slug}`}
            key={subcategory.slug}
            className="p-2 hover:bg-black hover:text-white underline"
          >
            {subcategory.name}
          </Link>
        );
      })}
    </div>
  );
};

export default SubCategories;
