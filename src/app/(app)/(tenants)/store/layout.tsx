import ProductFilters from "@/modules/productFilters/ui/ProductFilters";
import SortFilter from "@/modules/productFilters/ui/SortFilter";

import TenantNavbar from "./TenantNavbar";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <TenantNavbar />
      <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-10 px-20 py-6 gap-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between col-span-full">
          <div className="text-2xl font-medium">Curated for you</div>
          <div>
            <SortFilter />
          </div>
        </div>
        <div className="md:col-span-2 lg:col-span-2 border border-black rounded-md self-start">
          <ProductFilters />
        </div>
        <div className="md:col-span-3 lg:col-span-8">{children}</div>
      </div>
    </div>
  );
}
