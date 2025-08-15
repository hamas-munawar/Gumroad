import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";

interface Props {
  items: { href: string; children: string }[];
}

const NavbarSidebar = ({ items }: Props) => {
  return (
    <Sheet>
      <SheetTrigger>

          <Menu size={28} />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <ScrollArea className="pb-2">
          {items.map(({ href, children }) => (
            <Link
              key={href}
              href={href}
              className="block p-4 hover:text-white hover:bg-black text-base font-medium"
            >
              {children}
            </Link>
          ))}

          <div className="border-t border-border my-2" />

          <Link
            href={"/sign-in"}
            className="block p-4 hover:text-white hover:bg-black text-base font-medium"
          >
            Log in
          </Link>
          <Link
            href={"/sign-up"}
            className="block p-4 hover:text-white hover:bg-black text-base font-medium"
          >
            Start Selling
          </Link>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default NavbarSidebar;
