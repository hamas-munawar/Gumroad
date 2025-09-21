import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="h-16 xl:h-20 flex justify-between bg-white font-medium border-b items-center px-4 lg:px-20 py-4">
      <button className="group flex justify-center items-center gap-2">
        <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
        <Link href={`/`} className="font-medium text-xl group-hover:underline">
          Continue Shopping
        </Link>
      </button>
    </nav>
  );
};

export default Navbar;
