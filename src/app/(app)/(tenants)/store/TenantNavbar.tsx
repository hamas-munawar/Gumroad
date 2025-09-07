"use client";
import { Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

const popins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});

const Navbar = () => {
  return (
    <nav className="h-16 xl:h-20 flex justify-between bg-white font-medium border-b items-center px-10 py-2">
      <div className="flex gap-2">
        <Image
          src={"/placeholder.png"}
          alt="Author"
          width={48}
          height={48}
          className="rounded-full border shrink-0 size-[48px] object-cover"
        />
        <Link
          href="/"
          className={cn(
            "pl-2 text-4xl xl:text-5xl font-semibold",
            popins.className
          )}
        >
          Hamas
        </Link>
      </div>
      {/* <div className="hidden lg:flex gap-2 xl:gap-4"></div> */}
    </nav>
  );
};

export default Navbar;
