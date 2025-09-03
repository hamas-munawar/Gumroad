import { Where } from 'payload';
import { z } from 'zod';

import { DEFAULT_PRODUCTS_LIMIT } from '@/constants';
import { baseProcedure, createTRPCRouter } from '@/trpc/init';

import { sortTypes } from '../searchParams';

export const productsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        cursor: z.number().int().min(1).default(1),
        limit: z.number().int().min(1).max(50).default(DEFAULT_PRODUCTS_LIMIT),
        categorySlug: z.string().optional(),
        minPrice: z.string().nullable().optional(),
        maxPrice: z.string().nullable().optional(),
        tags: z.array(z.string()).nullable().optional(),
        sort: z.enum(sortTypes).nullable().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      // All products view (no category filter):
      if (!input.categorySlug) {
        const where: Where = {};
        // Price filter
        const minRaw =
          typeof input.minPrice === "string" ? input.minPrice.trim() : "";
        const maxRaw =
          typeof input.maxPrice === "string" ? input.maxPrice.trim() : "";
        const min = minRaw !== "" ? Number(minRaw) : undefined;
        const max = maxRaw !== "" ? Number(maxRaw) : undefined;
        const hasMin = typeof min === "number" && !Number.isNaN(min);
        const hasMax = typeof max === "number" && !Number.isNaN(max);
        if (hasMin || hasMax) {
          let from = hasMin ? min : undefined;
          let to = hasMax ? max : undefined;
          if (from != null && to != null && from > to) [from, to] = [to, from];
          const price: Record<string, number> = {};
          if (from != null) price.greater_than_equal = from;
          if (to != null) price.less_than_equal = to;
          if (Object.keys(price).length) where.price = price;
        }
        // Tags filter
        if (input.tags && input.tags.length > 0) {
          where["tags.slug"] = { in: input.tags };
        }
        // Sort
        let sort = "createdAt";
        if (input.sort) {
          if (input.sort === "curated") sort = "-createdAt";
          else if (input.sort === "trending") sort = "name";
          else if (input.sort === "hot_and_new") sort = "-name";
        }
        return ctx.payload.find({
          collection: "products",
          depth: 1,
          where,
          sort,
          page: input.cursor,
          limit: input.limit,
        });
      }

      const parentCategory = await ctx.payload.find({
        collection: "categories",
        pagination: false,
        depth: 1,
        where: {
          slug: { equals: input.categorySlug },
        },
      });

      if (!parentCategory.docs || parentCategory.docs.length === 0) {
        // Fallback: return “all products” with filters so the UI keeps working.
        let sort = "createdAt";
        if (input.sort) {
          if (input.sort === "curated") sort = "-createdAt";
          else if (input.sort === "trending") sort = "name";
          else if (input.sort === "hot_and_new") sort = "-name";
        }
        const where: Where = {};
        // Optionally mirror the price/tags logic here (or refactor into a helper)
        return ctx.payload.find({
          collection: "products",
          depth: 1,
          where,
          sort,
          page: input.cursor,
          limit: input.limit,
        });
      }

      if (parentCategory.docs[0]) {
        const mainCategory = parentCategory.docs[0];
        const categoryIds: string[] = [mainCategory.id];
        mainCategory.subcategories?.docs?.forEach((cat) => {
          if (typeof cat !== "string" && cat.id) categoryIds.push(cat.id);
        });

        const where: Where = { category: { in: categoryIds } };

        const minRaw =
          typeof input.minPrice === "string" ? input.minPrice.trim() : "";
        const maxRaw =
          typeof input.maxPrice === "string" ? input.maxPrice.trim() : "";
        const min = minRaw !== "" ? Number(minRaw) : undefined;
        const max = maxRaw !== "" ? Number(maxRaw) : undefined;
        const hasMin = typeof min === "number" && !Number.isNaN(min);
        const hasMax = typeof max === "number" && !Number.isNaN(max);
        if (hasMin || hasMax) {
          let from = hasMin ? min : undefined;
          let to = hasMax ? max : undefined;
          if (from != null && to != null && from > to) [from, to] = [to, from];
          const price: Record<string, number> = {};
          if (from != null) price.greater_than_equal = from;
          if (to != null) price.less_than_equal = to;
          if (Object.keys(price).length) where.price = price;
        }

        if (input.tags && input.tags.length > 0) {
          where["tags.slug"] = {
            in: input.tags,
          };
        }

        let sort = "createdAt";
        if (input.sort) {
          if (input.sort === "curated") sort = "-createdAt";
          else if (input.sort === "trending") sort = "name";
          else if (input.sort === "hot_and_new") sort = "-name";
        }

        const data = await ctx.payload.find({
          collection: "products",
          depth: 1,
          where,
          sort,
          page: input.cursor,
          limit: input.limit,
        });

        return data;
      }
    }),
});
