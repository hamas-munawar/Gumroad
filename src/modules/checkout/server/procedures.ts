import { z } from "zod";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const checkoutRouter = createTRPCRouter({
  getProducts: baseProcedure
    .input(
      z.object({
        productIds: z.array(z.string()).min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const products = await ctx.payload.find({
        collection: "products",
        where: {
          id: { in: input.productIds },
        },
        depth: 2,
      });

      return products.docs;
    }),
});
