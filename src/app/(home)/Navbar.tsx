"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NavbarSidebar from "./NavbarSidebar";

const popins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});

interface NavbarItemProps {
  href: string;
  isActive?: boolean;
  children: React.ReactNode;
}

const NavbarItem = ({ href, isActive, children }: NavbarItemProps) => {
  return (
    <Button
      asChild
      variant={"outline"}
      className={cn(
        "rounded-full hover:border-primary border-transparent transition-all px-3.5 text-base xl:text-lg",
        isActive && "bg-black text-white hover:bg-black hover:text-white "
      )}
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
};

const navbarItems = [
  { href: "/", children: "Home" },
  { href: "/about", children: "About" },
  { href: "/features", children: "Featuring" },
  { href: "/pricing", children: "Pricing" },
  { href: "/contact", children: "Contact" },
];

const Navbar = () => {
  const path = usePathname();

  return (
    <nav className="h-16 xl:h-20 flex justify-between bg-white font-medium border-b items-center">
      <Link
        href="/"
        className={cn(
          "pl-2 text-4xl xl:text-5xl font-semibold",
          popins.className
        )}
      >
        Gumroad
      </Link>
      <div className="hidden lg:flex gap-2 xl:gap-4">
        {navbarItems.map(({ href, children }) => (
          <NavbarItem key={href} href={href} isActive={path === href}>
            {children}
          </NavbarItem>
        ))}
      </div>
      <div className="hidden lg:flex h-full">
        <Button
          asChild
          variant={"secondary"}
          className="border-l border-r-0 border-y-0 rounded-none h-full bg-white px-8 xl:px-12 hover:bg-pink-400 transition-all text-base xl:text-lg"
        >
          <Link href={"/sign-in"}>Log in</Link>
        </Button>
        <Button
          asChild
          className="border-none rounded-none h-full px-8 xl:px-12 hover:bg-pink-400 hover:text-black transition-all text-base xl:text-lg"
        >
          <Link href={"/sign-up"}>Start Selling</Link>
        </Button>
      </div>
      <div className="lg:hidden bg-white mr-2 border-transparent grid place-content-center">
        <NavbarSidebar items={navbarItems} />
      </div>
    </nav>
  );
};

export default Navbar;
