import SearchInput from "./SearchInput";

const SearchFiltersSkeleton = () => {
  return (
    <div className="flex md:flex-col items-center md:items-stretch gap-2 py-2 md:py-4 px-4 md:px-6">
      <div className="hidden md:block" />
      <div className="flex-1">
        <SearchInput />
      </div>
      <div className="w-full h-[56px]"></div>
      <div className="hidden md:block"></div>
    </div>
  );
};

export default SearchFiltersSkeleton;
