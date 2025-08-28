import z from "zod";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const productsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(z.object({ categorySlug: z.string().optional() }))
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

      // The key change is here: instead of returning undefined, we return an empty array.
      // This satisfies tRPC's expectation for a query that returns a list.
      if (!parentCategory.docs || parentCategory.docs.length === 0) {
        return [];
      }

      const mainCategory = parentCategory.docs[0];
      const categorySlugs = [mainCategory.slug];

      mainCategory.subcategories?.docs?.forEach(
        (cat) =>
          typeof cat !== "string" && cat.slug && categorySlugs.push(cat.slug)
      );

      const { docs } = await ctx.payload.find({
        collection: "products",
        depth: 1,
        where: {
          "category.slug": {
            in: categorySlugs,
          },
        },
        select: {
          name: true,
          desctiption: true,
          price: true,
        },
      });

      return docs;
    }),
});
