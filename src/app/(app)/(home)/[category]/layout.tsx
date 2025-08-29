import { ChevronRight } from "lucide-react";
import { Suspense } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getQueryClient, trpc } from "@/trpc/server";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function CategoryLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ category: string }>;
}>) {
  const { category } = await params;

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({ categorySlug: category })
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-10 p-6 gap-8">
      <div className="md:col-span-2 lg:col-span-2 border border-black rounded-md">
        <div className="flex justify-between border-b p-4 cursor-default">
          <h4 className="text-xl font-medium">Filters</h4>
          <button className="underline text-lg cursor-pointer">Clear</button>
        </div>
        <div>
          <Collapsible className="rounded-md overflow-hidden w-full">
            <CollapsibleTrigger className="w-full cursor-pointer group flex items-center justify-between text-lg font-medium p-4">
              <span>Price</span>
              <ChevronRight className="h-5 w-5 text-black transition-transform duration-200 group-data-[state=open]:rotate-90" />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-6 pb-4 flex flex-col gap-2 mb-2">
              <div className="flex flex-col gap-1 border-0">
                <Label className="text-base font-medium">Min Price</Label>
                <Input type="number" />
              </div>
              <div className="flex flex-col gap-1 border-0">
                <Label className="text-base font-medium">Max Price</Label>
                <Input type="number" />
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<div>Loading...</div>}>
          <div className="md:col-span-3 lg:col-span-8">{children}</div>
        </Suspense>
      </HydrationBoundary>
    </div>
  );
}
