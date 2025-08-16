import SearchCategories from "./SearchCategories";
import SearchInput from "./SearchInput";

const SearchFilters = () => {
  return (
    <div className="flex flex-col gap-2 py-4 px-2 lg:pt-4 lg:pb-0">
      <SearchInput />
      <SearchCategories />
    </div>
  );
};

export default SearchFilters;
