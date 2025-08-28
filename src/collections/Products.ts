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
      name: "desctiption",
      type: "text",
    },
    {
      name: "price",
      type: "text",
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
