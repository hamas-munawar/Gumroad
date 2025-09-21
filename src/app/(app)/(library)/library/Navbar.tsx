import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="h-16 xl:h-20 flex justify-between bg-white font-medium border-b items-center px-4 lg:px-20 py-4">
      <Link
        href="/"
        className="group font-medium text-xl hover:underline flex justify-center items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black rounded"
        aria-label="Continue shopping"
      >
        <ArrowLeft
          aria-hidden="true"
          className="group-hover:-translate-x-1 transition-transform"
        />
        Continue Shopping
      </Link>
    </nav>
  );
};

export default Navbar;
