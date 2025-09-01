import { StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  product: {
    id: string;
    name: string;
    description?: string | null | undefined;
    price: number;
  };
}

const ProductCard = ({ product }: Props) => {
  return (
    <Card className="w-md rounded-md p-0 overflow-hidden gap-0">
      <CardHeader className="p-0">
        <div className="relative aspect-square border-b w-full ">
          <Image
            src={"/placeholder.png"}
            fill
            className="object-cover"
            alt={"Product Image"}
          />
        </div>
      </CardHeader>
      <CardContent className="border-b p-4 text-black">
        <CardTitle className="text-2xl font-medium">{product.name}</CardTitle>
        <CardDescription>
          <Link href={"#"} className="underline text-lg">
            hamas
          </Link>
          <div className="flex gap-2">
            <StarIcon className="size-5 fill-black stroke-0" /> 3 (5)
          </div>
        </CardDescription>
      </CardContent>
      <CardFooter className="p-4 m-0">
        <p className="text-sm font-medium bg-pink-400 border px-2 py-1">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 1,
          }).format(Number(product.price))}
        </p>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
