import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

export const reviewsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const product = await ctx.payload.findByID({
        collection: "products",
        id: input.productId,
        depth: 1,
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      const reviewData = await ctx.payload.find({
        collection: "reviews",
        limit: 1,
        where: {
          and: [
            {
              product: {
                equals: input.productId,
              },
            },
            {
              user: {
                equals: ctx.session.user.id,
              },
            },
          ],
        },
      });

      const review = reviewData?.docs?.[0] || null;

      return review;
    }),

  create: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        rating: z
          .number()
          .min(1, { message: "Rating must be at least 1" })
          .max(5, { message: "Rating must be at most 5" }),
        description: z
          .string()
          .min(1, { message: "Description must be at least 1 character long" })
          .max(1000, {
            message: "Description must be at most 1000 characters long",
          }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const product = await ctx.payload.findByID({
        collection: "products",
        id: input.productId,
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      const existingReviewData = await ctx.payload.find({
        collection: "reviews",
        limit: 1,
        where: {
          and: [
            {
              product: {
                equals: input.productId,
              },
            },
            {
              user: {
                equals: ctx.session.user.id,
              },
            },
          ],
        },
      });

      if (existingReviewData.totalDocs > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You have already reviewed this product",
        });
      }

      const review = await ctx.payload.create({
        collection: "reviews",
        data: {
          user: ctx.session.user.id,
          product: input.productId,
          rating: input.rating,
          description: input.description,
        },
      });

      return review;
    }),
  update: protectedProcedure
    .input(
      z.object({
        reviewId: z.string(),
        rating: z
          .number()
          .min(1, { message: "Rating must be at least 1" })
          .max(5, { message: "Rating must be at most 5" }),
        description: z
          .string()
          .min(1, { message: "Description must be at least 1 character long" })
          .max(1000, {
            message: "Description must be at most 1000 characters long",
          }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingReview = await ctx.payload.findByID({
        collection: "reviews",
        id: input.reviewId,
        depth: 0,
      });

      if (!existingReview) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Review not found",
        });
      }

      if (existingReview.user !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only update your own reviews",
        });
      }

      const review = await ctx.payload.update({
        collection: "reviews",
        id: input.reviewId,
        data: {
          rating: input.rating,
          description: input.description,
        },
      });

      return review;
    }),
});
