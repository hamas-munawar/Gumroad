import { getPayload } from "payload";

import { stripe } from "@/lib/stripe";
import payloadConfig from "@/payload.config";

const seed = async () => {
  const payload = await getPayload({ config: payloadConfig });

  const adminAccount = await stripe.accounts.create({});

  if (!adminAccount) {
    throw new Error("Failed to create Stripe account");
  }

  const tenant = await payload.create({
    collection: "tenants",
    data: {
      username: "admin",
      slug: "admin",
      stripeAccountId: adminAccount.id,
      stripeDetailsSubmitted: true,
    },
  });

  const user = await payload.create({
    collection: "users",
    data: {
      username: "admin",
      email: "admin@hamas.com",
      password: "adminhamas",
      roles: ["super-admin"],
      tenants: [{ tenant: tenant.id }],
    },
  });

  console.log(user);
};

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
