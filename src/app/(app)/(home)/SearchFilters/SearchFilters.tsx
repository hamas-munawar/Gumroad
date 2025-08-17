import { Category } from "@/payload-types";
import configPromise from "@payload-config";
import { getPayload } from "payload";
import SearchCategories from "./SearchCategories";
import SearchInput from "./SearchInput";

const SearchFilters = async () => {
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
    sort: "name",
    pagination: false,
  });

  let categories = docs.map((parent) => {
    return {
      ...parent,
      subcategories:
        parent.subcategories?.docs &&
        parent.subcategories.docs.map((child) => {
          return { ...(child as Category), subcategories: undefined };
        }),
    };
  });

  return (
    <div className="flex flex-col gap-2 py-4 px-2 lg:pt-4 lg:pb-2">
      <SearchInput />
      <SearchCategories categories={categories as Category[]} />
    </div>
  );
};

export default SearchFilters;
