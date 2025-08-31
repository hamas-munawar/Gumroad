import { Where } from "payload";
import { z } from "zod";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";

import { sortTypes } from "../searchParams";

export const productsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        categorySlug: z.string().optional(),
        minPrice: z.string().nullable().optional(),
        maxPrice: z.string().nullable().optional(),
        tags: z.array(z.string()).nullable().optional(),
        sort: z.enum(sortTypes).nullable().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!input.categorySlug) return [];

      const parentCategory = await ctx.payload.find({
        collection: "categories",
        pagination: false,
        depth: 1,
        where: {
          slug: { equals: input.categorySlug },
        },
      });

      if (!parentCategory.docs || parentCategory.docs.length === 0) {
        return [];
      }

      if (parentCategory.docs[0]) {
        const mainCategory = parentCategory.docs[0];
        const categoryIds: string[] = [mainCategory.id];
        mainCategory.subcategories?.docs?.forEach((cat) => {
          if (typeof cat !== "string" && cat.id) categoryIds.push(cat.id);
        });

        const where: Where = { category: { in: categoryIds } };
        if (input.minPrice != "" || input.maxPrice != "") {
          where.price = {
            ...(input.minPrice != ""
              ? { greater_than_equal: input.minPrice }
              : {}),
            ...(input.maxPrice != ""
              ? { less_than_equal: input.maxPrice }
              : {}),
          };
        }

        if (input.tags && input.tags.length > 0) {
          where["tags.name"] = {
            in: input.tags,
          };
        }

        let sort = "createdAt";
        if (input.sort) {
          if (input.sort === "curated") sort = "-createdAt";
          else if (input.sort === "trending") sort = "name";
          else if (input.sort === "hot_and_new") sort = "-name";
        }

        const { docs } = await ctx.payload.find({
          collection: "products",
          depth: 0,
          pagination: false,
          where: where,
          sort,
          select: {
            name: true,
            description: true,
            price: true,
          },
        });

        return docs;
      }
    }),
});
