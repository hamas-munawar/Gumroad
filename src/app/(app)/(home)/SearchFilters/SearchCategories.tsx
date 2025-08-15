import configPromise from "@payload-config";
import { getPayload } from "payload";
import SearchCategory from "./SearchCategory";

const SearchCategories = async () => {
  const payload = await getPayload({
    config: configPromise,
  });

  const { docs } = await payload.find({
    collection: "categories",
    depth: 1,
    where: {
      parent: {
        exists: false,
      },
    },
  });

  let categories = docs.map((parent) => {
    return {
      ...parent,
      subcategories:
        parent.subcategories?.docs &&
        parent.subcategories.docs.map((child) => {
          return { ...child, subcategories: undefined };
        }),
    };
  });

  return (
    <div className="flex gap-2 w-full py-2">
      {categories.map((category) => (
        <SearchCategory key={category.slug} category={category} />
      ))}
    </div>
  );
};

export default SearchCategories;
