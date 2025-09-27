"use client";
import dynamic from "next/dynamic";
import { Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

import { Skeleton } from "@/components/ui/skeleton";
import { cn, generateTenantSubdomain } from "@/lib/utils";
import { Tenant } from "@/payload-types";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

import { CheckoutButtonSkeleton } from "./products/[productId]/CheckoutButton";

const CheckoutButton = dynamic(
  () =>
    import("./products/[productId]/CheckoutButton").then((mod) => mod.default),
  { ssr: false, loading: () => <CheckoutButtonSkeleton /> }
);

const popins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});

interface NavbarProps {
  tenantSlug: string;
}

const Navbar = ({ tenantSlug }: NavbarProps) => {
  const trpc = useTRPC();
  const { data: tenant } = useSuspenseQuery(
    trpc.tenants.getOne.queryOptions<Tenant & { image?: { url: string } }>({
      tenantSlug: tenantSlug as string,
    })
  );

  return (
    <nav className="h-16 xl:h-20 flex justify-between bg-white font-medium border-b items-center px-4 lg:px-20 py-4">
      <div className="flex gap-2 justify-center items-center">
        {tenant.image?.url && (
          <Image
            src={tenant.image?.url}
            alt="Author"
            width={48}
            height={48}
            className="rounded-full border shrink-0 size-[48px] object-cover"
          />
        )}
        <Link
          href={generateTenantSubdomain(tenantSlug)}
          className={cn(
            "pl-2 text-4xl xl:text-5xl font-semibold",
            popins.className
          )}
        >
          {tenant?.username}
        </Link>
      </div>
      <CheckoutButton hideIfEmpty tenantSlug={tenantSlug} />
    </nav>
  );
};

export default Navbar;

export const TenantNavbarSkeleton = () => {
  return (
    <nav className="h-16 xl:h-20 flex justify-between bg-white font-medium border-b items-center px-20 py-4">
      <div className="flex gap-2 justify-center items-center">
        <Skeleton className="rounded-full shrink-0 size-[48px] h-12 w-12" />
        <Skeleton className="h-8 w-48" />
      </div>
    </nav>
  );
};
