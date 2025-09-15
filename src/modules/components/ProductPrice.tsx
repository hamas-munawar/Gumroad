import { formatCurrency } from "@/lib/utils";

const ProductPrice = ({ amount }: { amount: number }) => {
  return (
    <p className="text-sm font-medium bg-pink-400 border px-2 py-1">
      {formatCurrency(amount, "USD")}
    </p>
  );
};

export default ProductPrice;
