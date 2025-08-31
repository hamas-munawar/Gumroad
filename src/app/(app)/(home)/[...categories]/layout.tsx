import ProductFilters from "./ProductFilters";
import SortFilter from "./SortFilter";

export default async function CategoryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-10 p-6 gap-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between col-span-full">
        <div className="text-2xl font-medium">Curated for you</div>
        <div>
          <SortFilter />
        </div>
      </div>
      <div className="md:col-span-2 lg:col-span-2 border border-black rounded-md">
        <ProductFilters />
      </div>
      <div className="md:col-span-3 lg:col-span-8">{children}</div>
    </div>
  );
}
