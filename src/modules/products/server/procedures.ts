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
      // If there is no category slug, fetch all products with filters
      if (!input.categorySlug) {
        const { where, sort } = buildProductQuery(input);
        return ctx.payload.find({
          collection: "products",
          depth: 1,
          where,
          sort,
          page: input.cursor,
          limit: input.limit,
        });
      }

      // If a category slug exists, find the parent category and its subcategories
      const parentCategory = await ctx.payload.find({
        collection: "categories",
        pagination: false,
        depth: 1,
        where: {
          slug: { equals: input.categorySlug },
        },
      });

      // If the category is not found, fall back to the "all products" view
      if (!parentCategory.docs || parentCategory.docs.length === 0) {
        const { where, sort } = buildProductQuery(input);
        return ctx.payload.find({
          collection: "products",
          depth: 1,
          where,
          sort,
          page: input.cursor,
          limit: input.limit,
        });
      }

      // Found the category, now gather all relevant category IDs (parent + subcategories)
      const mainCategory = parentCategory.docs[0];

      if (mainCategory) {
        const categoryIds: string[] = [mainCategory.id];
        mainCategory.subcategories?.docs?.forEach((cat) => {
          if (typeof cat !== "string" && cat.id) categoryIds.push(cat.id);
        });

        // Use the helper to build the query, including the category IDs
        const { where, sort } = buildProductQuery({ ...input, categoryIds });

        return ctx.payload.find({
          collection: "products",
          depth: 1,
          where,
          sort,
          page: input.cursor,
          limit: input.limit,
        });
      }
    }),
});

// Helper function to build the common query parameters
const buildProductQuery = (input: {
  minPrice?: string | null;
  maxPrice?: string | null;
  tags?: string[] | null;
  sort?: z.infer<typeof sortTypes> | null;
  categoryIds?: string[]; // Optional category filter
}): { where: Where; sort: string } => {
  const where: Where = {};

  // Price filter logic
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

  // Tags filter logic
  if (input.tags && input.tags.length > 0) {
    where["tags.slug"] = { in: input.tags };
  }

  // Category filter logic (specific to categorized views)
  if (input.categoryIds && input.categoryIds.length > 0) {
    where.category = { in: input.categoryIds };
  }

  // Sort logic
  let sort = "createdAt";
  if (input.sort) {
    if (input.sort === "curated") sort = "-createdAt";
    else if (input.sort === "trending") sort = "name";
    else if (input.sort === "hot_and_new") sort = "-name";
  }

  return { where, sort };
};
