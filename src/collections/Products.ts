import { isSuperAdmin } from "@/lib/access";
import { Tenant } from "@/payload-types";

import type { CollectionConfig } from "payload";

export const Products: CollectionConfig = {
  slug: "products",
  access: {
    read: () => true,
    create: ({ req }) => {
      if (isSuperAdmin(req.user)) return true;

      const tenant = req.user?.tenants?.[0]?.tenant as Tenant;
      return Boolean(tenant?.stripeDetailsSubmitted);
    },
    delete: ({ req }) => isSuperAdmin(req.user),
  },
  admin: {
    useAsTitle: "name",
    description: "You must verify your account before creating products",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "description",
      // TODO: switch to richText
      type: "text",
    },
    {
      name: "price",
      type: "number",
      required: true,
      min: 0,
      admin: {
        description: "Price in USD",
      },
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      hasMany: false,
    },
    {
      name: "tags",
      type: "relationship",
      relationTo: "tags",
      hasMany: true,
    },
    {
      name: "refundPolicy",
      type: "select",
      options: [
        {
          label: "No Refunds",
          value: "no-refunds",
        },
        {
          label: "30 Day Refunds",
          value: "30-days",
        },
        {
          label: "60 Day Refunds",
          value: "60-days",
        },
      ],
      defaultValue: "no-refunds",
      required: true,
    },
    {
      name: "content",
      // TODO: switch to richText
      type: "textarea",
      admin: {
        description:
          "Protected content, only accessible after purchase. Add product documentation, downloadable files, getting started guides, and bonus materials here. Support Markdown formatting.",
      },
    },
    {
      name: "archived",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description: "Archived products are hidden from the storefront",
      },
    },
  ],
};
