import { z } from 'zod';

import { baseProcedure, createTRPCRouter } from '@/trpc/init';

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

      if (parentCategory.docs[0]) {
        const mainCategory = parentCategory.docs[0];
        const categoryIds: string[] = [mainCategory.id];
        mainCategory.subcategories?.docs?.forEach((cat) => {
          if (typeof cat !== "string" && cat.id) categoryIds.push(cat.id);
        });

        const { docs } = await ctx.payload.find({
          collection: "products",
          depth: 0,
          pagination: false,
          where: {
            category: { in: categoryIds },
          },
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
