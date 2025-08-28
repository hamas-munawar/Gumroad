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
      name: "images",
      type: "upload",
      relationTo: "media",
      hasMany: true,
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      required: true,
    },
  ],
};
