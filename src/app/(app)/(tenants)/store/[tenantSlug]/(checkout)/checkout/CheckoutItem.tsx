import Image from "next/image";
import Link from "next/link";

const CheckoutItem = () => {
  return (
    <div className="grid grid-cols-[8.5rem_1fr_auto] gap-4 border-b pr-4">
      <div className={"relative aspect-square h-full border-r"}>
        <Image
          src={"/placeholder.png"}
          alt="image"
          fill
          className="object-cover"
        />
      </div>
      <div className="py-4 flex flex-col items-start gap-2">
        <Link href={"/store/"} className="text-lg font-medium underline">
          Headphones
        </Link>
        <Link href={"/store/"} className="underline text-base">
          <div className="flex items-center gap-2">
            <Image
              src={"/placeholder.png"}
              alt="Author"
              width={16}
              height={16}
              className="rounded-full border shrink-0 size-[16px] object-cover"
            />
            hamas
          </div>
        </Link>
      </div>
      <div className="py-4 flex flex-col justify-between items-end">
        <p className="text-base font-medium">$19.99</p>
        <button className="text-base font-medium underline cursor-pointer">
          Remove
        </button>
      </div>
    </div>
  );
};

export default CheckoutItem;
