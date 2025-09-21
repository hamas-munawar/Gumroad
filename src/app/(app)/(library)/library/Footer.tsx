import { Poppins } from "next/font/google";
import Link from "next/link";

import { cn } from "@/lib/utils";

const popins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});

const Footer = () => {
  return (
    <nav className="h-16 xl:h-20 flex justify-between bg-white font-medium border-t items-center px-4 lg:px-20 py-4">
      <div className="flex gap-1 justify-center items-end">
        <p>Powered by</p>
        <Link
          href={`/`}
          className={cn(
            "pl-2 text-4xl xl:text-5xl font-semibold",
            popins.className
          )}
        >
          Gumroad
        </Link>
      </div>
    </nav>
  );
};

export default Footer;
