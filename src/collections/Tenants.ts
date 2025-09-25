import { isSuperAdmin } from "@/lib/access";

import type { CollectionConfig } from "payload";

export const Tenants: CollectionConfig = {
  slug: "tenants",
  access: {
    create: ({ req }) => isSuperAdmin(req.user),
    delete: ({ req }) => isSuperAdmin(req.user),
  },
  admin: {
    useAsTitle: "slug",
  },
  fields: [
    {
      name: "username",
      type: "text",
      required: true,
      label: "Store Name",
      admin: { description: "The name of the store (e.g Hamas's Store" },
    },
    {
      name: "slug",
      type: "text",
      index: true,
      required: true,
      unique: true,
      admin: {
        description: "The unique domain for the store (e.g. hamas.gumroad.com)",
      },
      access: {
        update: ({ req }) => isSuperAdmin(req.user),
      },
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      label: "Store Image",
      admin: {
        description: "The image for the store (e.g. logo, avatar, etc.)",
      },
    },
    {
      name: "stripeAccountId",
      type: "text",
      required: true,
      label: "Stripe Account ID",
      admin: {
        description:
          "The Stripe Account ID for the store (e.g. acct_1N2bCdEfGhIjKlMn)",
      },
      access: {
        update: ({ req }) => isSuperAdmin(req.user),
      },
    },
    {
      name: "stripeDetailsSubmitted",
      type: "checkbox",
      required: true,
      label: "Stripe Details Submitted",
      admin: {
        description:
          "You can't create products or accept payments until stripe details are submitted",
      },
      access: {
        update: ({ req }) => isSuperAdmin(req.user),
      },
    },
  ],
};
