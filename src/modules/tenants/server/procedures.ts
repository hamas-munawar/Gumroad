import { z } from "zod";

import { Tenant } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

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
        depth: 1,
        limit: 1,
        where: {
          slug: { equals: input.tenantSlug },
        },
      });

      const doc = docs.docs[0];
      if (!doc) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Tenant not found" });
      }
      return doc as Tenant;
    }),
});
