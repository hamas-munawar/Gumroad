import type { CollectionConfig } from "payload";

export const Products: CollectionConfig = {
  slug: "products",
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "description",
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
  ],
};
