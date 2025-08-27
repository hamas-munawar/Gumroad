import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

const SearchInput = () => {
  return (
    <div className="relative">
      <SearchIcon
        size={20}
        className="absolute top-1/2 -translate-y-1/2 translate-x-1/2 text-gray-500"
      />
      <Input placeholder="Search Product" className="pl-10" />
    </div>
  );
};

export default SearchInput;
