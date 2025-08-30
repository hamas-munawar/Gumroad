import { Where } from 'payload';
import { z } from 'zod';

import { baseProcedure, createTRPCRouter } from '@/trpc/init';

export const productsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z
        .object({
          categorySlug: z.string().optional(),
          minPrice: z.coerce.number().min(0).optional(),
          maxPrice: z.coerce.number().min(0).optional(),
        })
        .refine(
          (v) =>
            !(v.minPrice != null && v.maxPrice != null) ||
            v.minPrice <= v.maxPrice,
          { message: "minPrice must be <= maxPrice", path: ["minPrice"] }
        )
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
        if (input.minPrice != null || input.maxPrice != null) {
          where.price = {
            ...(input.minPrice != null
              ? { greater_than_equal: input.minPrice }
              : {}),
            ...(input.maxPrice != null
              ? { less_than_equal: input.maxPrice }
              : {}),
          };
        }

        const { docs } = await ctx.payload.find({
          collection: "products",
          depth: 0,
          pagination: false,
          where: where,
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
