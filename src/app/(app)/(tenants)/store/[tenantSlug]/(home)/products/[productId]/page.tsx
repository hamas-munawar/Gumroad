import { LinkIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const page = () => {
  return (
    <div className="p-4">
      <div className="bg-white border rounded-md overflow-hidden">
        <div className="relative aspect-[3.9] border-b min-h-48">
          <Image
            src={"/placeholder.png"}
            alt="Cover"
            fill
            className="object-cover"
          />
        </div>
        <div className="lg:grid lg:grid-cols-6">
          <div className="lg:col-span-4">
            <h5 className="text-4xl font-medium p-6 border-b">Product Name</h5>
            <div className="flex border-b">
              <div className="px-6 py-4 flex items-center justify-center border-r">
                <div className="px-2 py-1 border bg-pink-400 w-fit">
                  <p className="text-base font-medium">$50</p>
                </div>
              </div>
              <div className="px-6 py-4 flex items-center justify-center border-r">
                <Link
                  href="/store/hamas"
                  className="flex gap-1 items-center justify-center"
                >
                  <Image
                    src={"/auth-background.png"}
                    alt="Avatar"
                    width={24}
                    height={24}
                    className="rounded-full border size-[24px]"
                  />
                  <span className="underline text-base font-medium">hamas</span>
                </Link>
              </div>
              <div className="px-6 py-4 flex items-center justify-center">
                <div className="hidden lg:flex gap-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <StarIcon key={index} size={20} className={"fill-black"} />
                  ))}
                </div>
                <div className="lg:hidden text-base font-medium">3.5/5</div>
              </div>
            </div>
            <div>
              <div className="px-6 py-4 flex items-center">
                <p className="text-base">
                  This is a sample product description. It provides details
                  about the product, its features, and benefits to the user.
                </p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 border-t lg:border-t-0 lg:border-l">
            <div className="flex flex-col gap-4 p-6 border-b">
              <div className="flex items-center gap-2">
                <Button variant={"elevated"} className="flex-1 bg-pink-400">
                  Add to Cart
                </Button>
                <Button variant={"elevated"}>
                  <LinkIcon />
                </Button>
              </div>
              <p className="text-center font-medium">
                30-days Money back guarantee
              </p>
            </div>
            <div className="flex justify-between p-6">
              <h5>Ratings</h5>
              <div className="flex items-center gap-1">
                <StarIcon size={20} className={"fill-black inline"} />
                <span className="text-base font-medium">({5})</span>
                <span className="text-base font-medium">{5} ratings</span>
              </div>
            </div>
            <div className="flex flex-col p-6 pt-2 gap-3">
              {[5, 4, 3, 2, 1].map((star) => (
                <div
                  className="grid grid-cols-[auto_1fr_auto] gap-2"
                  key={star}
                >
                  <span className="text-base font-medium">{star} star</span>
                  <Progress value={star * 20} className="h-[1lh]" />
                  <span className="text-base font-medium">(5)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
