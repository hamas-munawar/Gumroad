import z from "zod";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const productsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        category: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!input.category) return [];
      const { docs: category } = await ctx.payload.find({
        collection: "categories",
        depth: 1,
        where: {
          slug: { equals: input.category },
        },
      });

      const categoryDoc = category[0];
      if (!categoryDoc) return [];
      const categoryIds: string[] = [categoryDoc.id];
      const children = categoryDoc.subcategories?.docs ?? [];
      for (const child of children) {
        if (typeof child === "string") categoryIds.push(child);
        else if (child) categoryIds.push(child.id);
      }

      const { docs } = await ctx.payload.find({
        collection: "products",
        depth: 1, // Populate the category relationship && Image
        where: {
          Category: { in: categoryIds },
        },
        select: {
          name: true,
          description: true,
          price: true,
          Category: true,
        },
      });

      return docs;
    }),
});
