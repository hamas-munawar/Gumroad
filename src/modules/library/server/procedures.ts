import { z } from "zod";

import { DEFAULT_TAGS_LIMIT } from "@/constants";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const libraryRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z.object({
        cursor: z.number().int().min(1).default(1),
        limit: z.number().int().min(1).max(50).default(DEFAULT_TAGS_LIMIT),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.payload.find({
        collection: "orders",
        depth: 2,
        where: {
          user: { equals: ctx.session.user.id },
        },
        page: input.cursor,
        limit: input.limit,
      });
    }),
});
