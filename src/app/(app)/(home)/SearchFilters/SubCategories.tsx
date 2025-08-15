import Link from "next/link";

interface Props {
  categories: any[];
}

const SubCategories = ({ categories }: Props) => {
  return (
    <div
      style={{ background: categories.color }}
      className="hidden group-hover:flex flex-col border-black border overflow-hidden rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white"
    >
      {categories.subcategories?.map((category) => (
        <Link
          href={""}
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
