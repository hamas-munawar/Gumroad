import { CollectionConfig } from "payload";

export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "name",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "price",
      type: "number",
      required: true,
      admin: { description: "Price in USD" },
    },
    {
      name: "Category",
      type: "relationship",
      relationTo: "categories",
      hasMany: false,
    },
    {
      name: "images",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "refundPolicy",
      type: "select",
      options: [
        "30-days",
        "14-days",
        "7-days",
        "3-days",
        "12-day",
        "no-refund",
      ],
      defaultValue: "30-days",
    },
  ],
};
