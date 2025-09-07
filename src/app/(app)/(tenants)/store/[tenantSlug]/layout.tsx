import { Suspense } from "react";

import ProductFilters from "@/modules/productFilters/ui/ProductFilters";
import SortFilter from "@/modules/productFilters/ui/SortFilter";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import TenantFooter from "./TenantFooter";
import TenantNavbar, { TenantNavbarSkeleton } from "./TenantNavbar";

export default async function HomeLayout({
  params,
  children,
}: Readonly<{
  params: Promise<{ tenantSlug: string }>;
  children: React.ReactNode;
}>) {
  const { tenantSlug } = await params;

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    trpc.tenants.getOne.queryOptions({
      tenantSlug,
    })
  );

  return (
    <div className="flex flex-col min-h-screen">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<TenantNavbarSkeleton />}>
          <TenantNavbar />
        </Suspense>
      </HydrationBoundary>
      <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-10 px-20 py-6 gap-8 flex-1 place-content-start bg-[#f4f4f0]">
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
      <TenantFooter />
    </div>
  );
}
