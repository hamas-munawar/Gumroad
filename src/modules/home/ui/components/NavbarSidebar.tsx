import { Menu } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface Props {
  items: { href: string; children: string }[];
}

const NavbarSidebar = ({ items }: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: session } = useQuery(trpc.auth.session.queryOptions());
  const logout = useMutation(
    trpc.auth.logout.mutationOptions({
      onError: (error) => {
        console.log(error.message);
        toast.error(error.message || "Something went wrong");
      },
      onSuccess: async () => {
        toast.success("Logged Out successfully");
        await queryClient.invalidateQueries(trpc.auth.session.queryFilter());
      },
    })
  );

  return (
    <Sheet>
      <SheetTrigger>
        <Menu size={28} />
      </SheetTrigger>
      <SheetContent className="w-screen max-w-lg">
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

          {session?.user ? (
            <>
              <Link
                href={"/"}
                onClick={() => logout.mutate()}
                className="block p-4 hover:text-white hover:bg-black text-base font-medium"
              >
                Log Out
              </Link>
              <Link
                href={"/admin"}
                className="block p-4 hover:text-white hover:bg-black text-base font-medium"
              >
                Dashboard
              </Link>
            </>
          ) : (
            <>
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
            </>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default NavbarSidebar;
