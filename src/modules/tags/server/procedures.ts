import { z } from 'zod';

import { DEFAULT_TAGS_LIMIT } from '@/constants';
import { baseProcedure, createTRPCRouter } from '@/trpc/init';

export const tagsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        cursor: z.number().int().min(1).default(1),
        limit: z.number().int().min(1).max(50).default(DEFAULT_TAGS_LIMIT),
      })
    )
    .query(async ({ ctx, input }) => {
      const docs = await ctx.payload.find({
        collection: "tags",
        page: input.cursor,
        limit: input.limit,
        sort: "name",
        depth: 0,
        select: {
          id: true,
          name: true,
          slug: true,
        },
      });

      return docs;
    }),
});
