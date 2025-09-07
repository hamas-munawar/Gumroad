"use client";
import { Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

import { cn } from "@/lib/utils";
import { Tenant } from "@/payload-types";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

const popins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});

const Navbar = () => {
  const { tenantSlug } = useParams();

  const trpc = useTRPC();
  const { data: tenant } = useQuery(
    trpc.tenants.getOne.queryOptions<Tenant & { image: { url: string } }>({
      slug: tenantSlug as string,
    })
  );

  return (
    <nav className="h-16 xl:h-20 flex justify-between bg-white font-medium border-b items-center px-20 py-4">
      <div className="flex gap-2 justify-center items-center">
        <Image
          src={tenant?.image?.url || "/placeholder.png"}
          alt="Author"
          width={48}
          height={48}
          className="rounded-full border shrink-0 size-[48px] object-cover"
        />
        <Link
          href={`/store/${tenantSlug}`}
          className={cn(
            "pl-2 text-4xl xl:text-5xl font-semibold",
            popins.className
          )}
        >
          {tenant?.username}
        </Link>
      </div>
      {/* <div className="hidden lg:flex gap-2 xl:gap-4"></div> */}
    </nav>
  );
};

export default Navbar;
