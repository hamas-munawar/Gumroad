"use client";
import { LinkIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";
import { Product, Tenant } from "@/payload-types";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

import StarRating from "./StarRating";

const ProductDetailView = () => {
  const { productId } = useParams();
  const trpc = useTRPC();
  const { data: product } = useSuspenseQuery(
    trpc.products.getOne.queryOptions<
      Product & { image: { url: string } } & {
        tenant: Tenant & { image: { url: string } };
      }
    >({
      productId: productId as string,
    })
  );

  return (
    <div className="p-4">
      <div className="bg-white border rounded-md overflow-hidden">
        <div className="relative aspect-[3.9] border-b min-h-48">
          <Image
            src={product.image.url || "/placeholder.png"}
            alt="Cover"
            fill
            className="object-cover"
          />
        </div>
        <div className="lg:grid lg:grid-cols-6">
          <div className="lg:col-span-4">
            <h5 className="text-4xl font-medium p-6 border-b">
              {product.name}
            </h5>
            <div className="flex border-b">
              <div className="px-6 py-4 flex items-center justify-center border-r">
                <div className="px-2 py-1 border bg-pink-400 w-fit">
                  <p className="text-base font-medium">
                    {formatCurrency(product.price, "USD")}
                  </p>
                </div>
              </div>
              <div className="px-6 py-4 flex items-center justify-center border-r">
                <Link
                  href={`/store/${product.tenant.slug}`}
                  className="flex gap-1 items-center justify-center"
                >
                  <Image
                    src={product.tenant.image.url || "/auth-background.png"}
                    alt="Avatar"
                    width={24}
                    height={24}
                    className="rounded-full border shrink-0 size-[24px] object-cover"
                  />
                  <span className="underline text-base font-medium">
                    {product.tenant.username}
                  </span>
                </Link>
              </div>
              <div className="px-6 py-4 flex items-center justify-center">
                <div className="hidden lg:flex">
                  <StarRating rating={4} />
                </div>
                <div className="lg:hidden text-base font-medium">4/5</div>
              </div>
            </div>
            <div>
              <div className="px-6 py-4 flex items-center">
                <p className="text-base">
                  {product.description || "No description provided."}
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
                {product.refundPolicy === "no-refunds"
                  ? "No Refunds"
                  : `Money Back Guarantee within ${product.refundPolicy}`}
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

export default ProductDetailView;
