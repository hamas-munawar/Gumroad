import z from 'zod';

import { baseProcedure, createTRPCRouter } from '@/trpc/init';

export const productsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        category: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!input.category) return [];
      const { docs: category } = await ctx.payload.find({
        collection: "categories",
        depth: 1,
        where: {
          slug: { equals: input.category },
        },
      });

      const categories =
        category[0] && category[0].subcategories?.docs !== undefined
          ? category[0].subcategories?.docs.map((subcat) => {
              // Check if subcat is a string or a Category object
              return typeof subcat === "string" ? subcat : subcat.slug;
            })
          : [];

      categories?.unshift(input.category || "");

      const { docs } = await ctx.payload.find({
        collection: "products",
        depth: 1, // Populate the category relationship && Image
        where: {
          "Category.slug": { in: categories },
        },
        select: {
          name: true,
          description: true,
          price: true,
          Category: true,
        },
      });

      return docs;
    }),
});
