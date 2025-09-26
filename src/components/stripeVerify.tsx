import Link from "next/link";

import { Button } from "./ui/button";

const stripeVerify = () => {
  return (
    <Link href={"/stripe-verify"} className="my-2">
      <Button>Verify Account</Button>
    </Link>
  );
};

export default stripeVerify;
