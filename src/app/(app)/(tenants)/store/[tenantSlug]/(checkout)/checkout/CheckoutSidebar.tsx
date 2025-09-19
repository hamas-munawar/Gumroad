import { CircleXIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Product, Tenant } from "@/payload-types";

interface CheckoutSidebarProps {
  products: (Product & { image?: { url: string } } & {
    tenant: Tenant & { image?: { url: string } };
  })[];
  onPurchase?: () => void;
  disabled?: boolean;
  isCanceled?: boolean;
}

const CheckoutSidebar = ({
  products,
  onPurchase,
  disabled,
  isCanceled,
}: CheckoutSidebarProps) => {
  const totalPrice = products.reduce(
    (total, product) => total + (product.price || 0),
    0
  );

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h4 className="text-lg font-medium">Total</h4>
        <h4 className="text-lg font-medium">
          {formatCurrency(totalPrice, "USD")}
        </h4>
      </div>
      <div className="flex justify-center items-center p-4">
        <Button
          variant={"elevated"}
          size={"lg"}
          className="text-base w-full text-white bg-primary hover:bg-pink-400 hover:text-primary"
          onClick={onPurchase}
          disabled={disabled}
        >
          Checkout
        </Button>
      </div>
      {isCanceled && (
        <div className="p-4 justify-center items-center border-t">
          <div className="bg-red-100 border border-red-400 font-medium px-4 py-3 rounded flex items-center">
            <div className="flex items-center">
              <CircleXIcon className="size-6 mr-2 fill-red-500 text-red-100" />
              <span className="">Checkout Failed. Please try again.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutSidebar;
