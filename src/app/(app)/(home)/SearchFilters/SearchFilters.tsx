import SearchCategories from "./SearchCategories";
import SearchInput from "./SearchInput";
import { getQueryClient, trpc } from "@/trpc/server";
import { Category } from "@/payload-types";

const SearchFilters = async () => {
  const queryClient = getQueryClient();
  const categories = await queryClient.fetchQuery(trpc.categories.getMany.queryOptions());


  return (
    <div className="flex md:flex-col items-center md:items-stretch gap-2 py-4 px-2 lg:pt-4 lg:pb-2">
      <div className="flex-1">
        <SearchInput />
      </div>
      <div>
        <SearchCategories categories={categories as Category[]} />
      </div>
    </div>
  );
};

export default SearchFilters;
