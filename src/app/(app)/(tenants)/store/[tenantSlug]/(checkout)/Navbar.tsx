import Link from "next/link";

import { Button } from "@/components/ui/button";

interface NavbarProps {
  tenantSlug: string;
}

const Navbar = ({ tenantSlug }: NavbarProps) => {
  return (
    <nav className="h-16 xl:h-20 flex justify-between bg-white font-medium border-b items-center px-4 lg:px-20 py-4">
      <div className="flex gap-2 justify-center items-center">
        <p className="text-2xl font-medium">Checkout</p>
      </div>
      <Button variant="elevated" size="sm" asChild>
        <Link href={`/store/${tenantSlug}`}>Back to store</Link>
      </Button>
    </nav>
  );
};

export default Navbar;
