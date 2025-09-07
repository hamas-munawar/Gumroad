import { z } from "zod";

import { Tenant } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const tenantsRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(
      z.object({
        tenantSlug: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const docs = await ctx.payload.find({
        collection: "tenants",
        pagination: false,
        limit: 1,
        where: {
          slug: { equals: input.tenantSlug },
        },
      });

      return { ...(docs.docs[0] as Tenant) };
    }),
});
