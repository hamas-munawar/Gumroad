import { z } from 'zod';

import { baseProcedure, createTRPCRouter } from '@/trpc/init';

export const tagsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        cursor: z.number().default(1),
        limit: z.number().default(2),
      })
    )
    .query(async ({ ctx, input }) => {
      const docs = await ctx.payload.find({
        collection: "tags",
        page: input.cursor,
        limit: input.limit,
      });

      return docs;
    }),
});
