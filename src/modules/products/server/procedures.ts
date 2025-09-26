import { headers as getHeaders } from "next/headers";
import { z } from "zod";

import { DEFAULT_PRODUCTS_LIMIT } from "@/constants";
import { Tenant } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

import { sortTypes } from "../searchParams";

import type { Where } from "payload";
export const productsRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(z.object({ productId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const product = await ctx.payload.findByID({
        collection: "products",
        id: input.productId,
        depth: 2,
        select: {
          content: false, // Exclude protected content
        },
      });

      const reviews = await ctx.payload.find({
        collection: "reviews",
        pagination: false,
        depth: 0,
        where: {
          product: { equals: input.productId },
        },
      });

      const reviewCount = reviews.docs.length;
      const averageRating =
        reviewCount > 0
          ? Math.round(
              reviews.docs.reduce(
                (acc, review) =>
                  acc +
                  (typeof review.rating === "number"
                    ? review.rating
                    : Number(review.rating) || 0),
                0
              ) / reviewCount
            )
          : 0;

      const reviewDistribution: Record<number, number> = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      };
      reviews.docs.forEach((review) => {
        if (review.rating >= 1 && review.rating <= 5) {
          reviewDistribution[review.rating]! += 1;
        }
      });

      const headers = await getHeaders();
      const session = await ctx.payload.auth({ headers });

      if (!session.user)
        return {
          ...product,
          isPurchased: false,
          averageRating,
          reviewCount,
          reviewDistribution,
        };

      const orders = await ctx.payload.find({
        collection: "orders",
        pagination: false,
        limit: 1,
        depth: 0,
        where: {
          and: [
            { product: { equals: input.productId } },
            { user: { equals: session.user.id } },
          ],
        },
      });

      const isPurchased = orders.totalDocs > 0;

      return {
        ...product,
        isPurchased,
        averageRating,
        reviewCount,
        reviewDistribution,
      };
    }),
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
        tenantSlug: z.string().nullable().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      // Initialize where and sort using the helper function
      let { where, sort } = buildProductQuery(input);

      // If a category slug is provided, find the category and update the query
      if (input.categorySlug) {
        const parentCategory = await ctx.payload.find({
          collection: "categories",
          pagination: false,
          depth: 1,
          where: {
            slug: { equals: input.categorySlug },
          },
        });

        const mainCategory = parentCategory.docs[0];

        // If the category is found, gather its ID and subcategory IDs
        if (mainCategory) {
          const categoryIds: string[] = [mainCategory.id];
          mainCategory.subcategories?.docs?.forEach((cat) => {
            if (typeof cat !== "string" && cat.id) categoryIds.push(cat.id);
          });

          // Rebuild the query with the category IDs
          const updatedQuery = buildProductQuery({ ...input, categoryIds });
          where = updatedQuery.where;
          sort = updatedQuery.sort;
        }
      }

      const data = await ctx.payload.find({
        collection: "products",
        depth: 2,
        where,
        sort,
        page: input.cursor,
        limit: input.limit,
        select: {
          content: false, // Exclude protected content
        },
      });

      const productIds = data.docs.map((product) => product.id);

      const reviews = await ctx.payload.find({
        collection: "reviews",
        pagination: false,
        depth: 0,
        where: {
          product: { in: productIds },
        },
      });

      const reviewsByProductId: Record<string, typeof reviews.docs> = {};
      reviews.docs.forEach((review) => {
        const prodId =
          typeof review.product === "string"
            ? review.product
            : review.product.id;
        if (!reviewsByProductId[prodId]) reviewsByProductId[prodId] = [review];
        else reviewsByProductId[prodId].push(review);
      });

      const keys = Object.keys(reviewsByProductId);

      return {
        ...data,
        docs: data.docs.map((product) => ({
          ...product,
          averageRating: keys.includes(product.id)
            ? Math.round(
                reviewsByProductId[product.id]!.reduce(
                  (acc, review) => acc + review.rating,
                  0
                ) / reviewsByProductId[product.id]!.length
              )
            : 0,
          reviewsCount: keys.includes(product.id)
            ? reviewsByProductId[product.id]?.length
            : 0,
          tenant: product.tenant as Tenant,
        })),
      };
    }),
});

// Helper function to build the common query parameters
const buildProductQuery = (input: {
  minPrice?: string | null;
  maxPrice?: string | null;
  tags?: string[] | null;
  sort?: z.infer<typeof sortTypes> | null;
  categoryIds?: string[];
  tenantSlug?: string | null;
}): { where: Where; sort: string } => {
  const where: Where = {};

  // Archived filter logic
  where.archived = { not_equals: true };

  // Tenant filter logic
  if (input.tenantSlug) {
    where["tenant.slug"] = { equals: input.tenantSlug };
  }

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
