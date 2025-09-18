import { CircleXIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

import CheckoutItem from "./CheckoutItem";

const CheckoutPage = () => {
  return (
    <div className="py-6 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-7 gap-4">
      <div className="col-span-4">
        <div className="border rounded-md overflow-hidden bg-white">
          <CheckoutItem />
          <CheckoutItem />
        </div>
      </div>
      <div className="col-span-3 border rounded-md overflow-hidden bg-white flex flex-col self-start ">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="text-lg font-medium">Total</h4>
          <h4 className="text-lg font-medium">{formatCurrency(199, "USD")}</h4>
        </div>
        <div className="flex justify-center items-center p-4">
          <Button
            variant={"elevated"}
            size={"lg"}
            className="text-base w-full text-white bg-primary hover:bg-pink-400 hover:text-primary"
          >
            Checkout
          </Button>
        </div>
        <div className="p-4 justify-center items-center border-t">
          <div className="bg-red-100 border border-red-400 font-medium px-4 py-3 rounded flex items-center">
            <div className="flex items-center">
              <CircleXIcon className="size-6 mr-2 fill-red-500 text-red-100" />
              <span className="">Checkout Failed. Please try again.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
